// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

// Mock ERC-3643 interfaces (replace with T-REX imports in production)
interface IERC3643 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IIdentityRegistry {
    function isVerified(address _userAddress) external view returns (bool);
}

interface ICompliance {
    function canTransfer(address _from, address _to, uint256 _amount) external view returns (bool);
    function transferred(address _from, address _to, uint256 _amount) external;
}

contract Marketplace is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    // Structs
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        address paymentToken; // address(0) for ETH
        uint256 price;
        bool isActive;
        bool isERC3643; // True for ERC-3643, false for ERC-721
    }

    struct Offer {
        address buyer;
        address paymentToken; // address(0) for ETH
        uint256 amount;
        uint256 expirationTime;
        bool isActive;
    }

    // Storage
    uint256 public platformFeeRate; // In basis points (e.g., 250 = 2.5%)
    address public feeCollector;
    mapping(uint256 => Listing) public listings;
    mapping(address => bool) public supportedPaymentTokens; // Includes address(0) for ETH
    mapping(uint256 => mapping(address => Offer)) public offers;
    uint256 private _listingCounter;
    IIdentityRegistry public identityRegistry; // For ERC-3643 compliance
    ICompliance public compliance; // For ERC-3643 compliance
    uint256[] private _activeListingIds; // Track active listings

    // Events
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        address nftContract,
        uint256 tokenId,
        address paymentToken,
        uint256 price,
        bool isERC3643
    );
    event ListingUpdated(uint256 indexed listingId, uint256 newPrice);
    event ListingCanceled(uint256 indexed listingId);
    event OfferCreated(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount,
        uint256 expirationTime,
        address paymentToken
    );
    event OfferAccepted(uint256 indexed listingId, address indexed buyer);
    event OfferCanceled(uint256 indexed listingId, address indexed buyer);
    event Sale(
        uint256 indexed listingId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        address paymentToken
    );
    event RoyaltyPaid(
        uint256 indexed listingId,
        address indexed recipient,
        uint256 amount,
        address paymentToken
    );
    event PaymentTokenAdded(address indexed token);
    event PaymentTokenRemoved(address indexed token);
    event PlatformFeeUpdated(uint256 newFeeRate);
    event FeeCollectorUpdated(address indexed newFeeCollector);
    event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount);

    
    function initialize(
        uint256 _platformFeeRate,
        address _feeCollector,
        address _identityRegistry,
        address _compliance
    ) public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        require(_platformFeeRate <= 1000, "Fee rate cannot exceed 10%");
        require(_feeCollector != address(0), "Invalid fee collector address");
        require(_identityRegistry != address(0), "Invalid identity registry");
        require(_compliance != address(0), "Invalid compliance address");

        platformFeeRate = _platformFeeRate;
        feeCollector = _feeCollector;
        identityRegistry = IIdentityRegistry(_identityRegistry);
        compliance = ICompliance(_compliance);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(WITHDRAWER_ROLE, msg.sender);

        supportedPaymentTokens[address(0)] = true; // Enable ETH by default
    }

    // UUPS Upgradeable
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    // Pausable Functions
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Listing Management
    function createListing(
        address nftContract,
        uint256 tokenId,
        address paymentToken,
        uint256 price,
        bool isERC3643
    ) external whenNotPaused returns (uint256) {
        require(supportedPaymentTokens[paymentToken], "Unsupported payment token");
        require(price > 0, "Price must be greater than 0");
        require(identityRegistry.isVerified(msg.sender), "Seller not verified");

        if (isERC3643) {
            require(compliance.canTransfer(msg.sender, address(this), 1), "Compliance check failed");
        } else {
            IERC721 nft = IERC721(nftContract);
            require(nft.ownerOf(tokenId) == msg.sender, "Not the owner of the NFT");
            require(nft.isApprovedForAll(msg.sender, address(this)), "Marketplace not approved");
        }

        uint256 listingId = _listingCounter++;
        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            paymentToken: paymentToken,
            price: price,
            isActive: true,
            isERC3643: isERC3643
        });
        _activeListingIds.push(listingId);

        emit ListingCreated(listingId, msg.sender, nftContract, tokenId, paymentToken, price, isERC3643);
        return listingId;
    }

    function batchCreateListing(
        address[] memory nftContracts,
        uint256[] memory tokenIds,
        address[] memory paymentTokens,
        uint256[] memory prices,
        bool[] memory isERC3643s
    ) external whenNotPaused returns (uint256[] memory) {
        require(
            nftContracts.length == tokenIds.length &&
            tokenIds.length == paymentTokens.length &&
            paymentTokens.length == prices.length &&
            prices.length == isERC3643s.length,
            "Array length mismatch"
        );

        uint256[] memory listingIds = new uint256[](nftContracts.length);
        for (uint256 i = 0; i < nftContracts.length; i++) {
            listingIds[i] = createListing(
                nftContracts[i],
                tokenIds[i],
                paymentTokens[i],
                prices[i],
                isERC3643s[i]
            );
        }
        return listingIds;
    }

    function updateListing(uint256 listingId, uint256 newPrice) external whenNotPaused {
        require(newPrice > 0, "Price must be greater than 0");
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");

        listing.price = newPrice;
        emit ListingUpdated(listingId, newPrice);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(
            listing.seller == msg.sender || hasRole(OPERATOR_ROLE, msg.sender),
            "Not authorized"
        );

        listing.isActive = false;
        for (uint256 i = 0; i < _activeListingIds.length; i++) {
            if (_activeListingIds[i] == listingId) {
                _activeListingIds[i] = _activeListingIds[_activeListingIds.length - 1];
                _activeListingIds.pop();
                break;
            }
        }

        emit ListingCanceled(listingId);
    }

    function batchCancelListing(uint256[] memory listingIds) external {
        for (uint256 i = 0; i < listingIds.length; i++) {
            cancelListing(listingIds[i]);
        }
    }

    // Offer Management
    function makeOffer(uint256 listingId, uint256 amount, uint256 duration)
        external
        payable
        whenNotPaused
        nonReentrant
    {
        require(duration > 0 && duration <= 30 days, "Invalid duration");
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(amount > 0, "Amount must be greater than 0");
        require(identityRegistry.isVerified(msg.sender), "Buyer not verified");

        if (listing.paymentToken == address(0)) {
            require(msg.value >= amount, "Insufficient ETH sent");
        } else {
            IERC20 paymentToken = IERC20(listing.paymentToken);
            require(paymentToken.balanceOf(msg.sender) >= amount, "Insufficient balance");
            require(paymentToken.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        }

        offers[listingId][msg.sender] = Offer({
            buyer: msg.sender,
            paymentToken: listing.paymentToken,
            amount: amount,
            expirationTime: block.timestamp + duration,
            isActive: true
        });

        emit OfferCreated(listingId, msg.sender, amount, block.timestamp + duration, listing.paymentToken);
    }

    function acceptOffer(uint256 listingId, address buyer) external whenNotPaused nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");

        Offer storage offer = offers[listingId][buyer];
        require(offer.isActive, "Offer not active");
        require(offer.expirationTime > block.timestamp, "Offer expired");

        _executeSale(listingId, buyer, offer.amount);
        offer.isActive = false;
        emit OfferAccepted(listingId, buyer);
    }

    function cancelOffer(uint256 listingId) external {
        Offer storage offer = offers[listingId][msg.sender];
        require(offer.isActive, "Offer not active");

        offer.isActive = false;
        if (offer.paymentToken == address(0)) {
            (bool success, ) = msg.sender.call{value: offer.amount}("");
            require(success, "ETH refund failed");
        }
        emit OfferCanceled(listingId, msg.sender);
    }

    // Buy Now
    function buyNow(uint256 listingId) external payable whenNotPaused nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(identityRegistry.isVerified(msg.sender), "Buyer not verified");

        if (listing.paymentToken == address(0)) {
            require(msg.value >= listing.price, "Insufficient ETH sent");
        } else {
            IERC20 paymentToken = IERC20(listing.paymentToken);
            require(paymentToken.balanceOf(msg.sender) >= listing.price, "Insufficient balance");
            require(paymentToken.allowance(msg.sender, address(this)) >= listing.price, "Insufficient allowance");
        }

        _executeSale(listingId, msg.sender, listing.price);
    }

    function batchBuyNow(uint256[] memory listingIds) external payable whenNotPaused nonReentrant {
        uint256 totalETHRequired;
        for (uint256 i = 0; i < listingIds.length; i++) {
            Listing storage listing = listings[listingIds[i]];
            if (listing.paymentToken == address(0)) {
                totalETHRequired += listing.price;
            }
        }
        require(msg.value >= totalETHRequired, "Insufficient ETH sent");

        for (uint256 i = 0; i < listingIds.length; i++) {
            buyNow(listingIds[i]);
        }
    }

    // Internal Sale Execution
    function _executeSale(uint256 listingId, address buyer, uint256 price) internal {
        Listing storage listing = listings[listingId];
        require(compliance.canTransfer(listing.seller, buyer, 1), "Compliance check failed");

        // Calculate fees
        uint256 platformFee = (price * platformFeeRate) / 10000;
        uint256 royaltyAmount;
        address royaltyRecipient;

        // Check for ERC-2981 royalties
        try IERC2981(listing.nftContract).royaltyInfo(listing.tokenId, price) returns (
            address recipient,
            uint256 amount
        ) {
            royaltyRecipient = recipient;
            royaltyAmount = amount;
        } catch {
            royaltyAmount = 0;
        }

        uint256 sellerAmount = price - platformFee - royaltyAmount;

        // Handle payment
        if (listing.paymentToken == address(0)) {
            // ETH payment
            require(msg.value >= price, "Insufficient ETH sent");
            if (platformFee > 0) {
                (bool success, ) = feeCollector.call{value: platformFee}("");
                require(success, "Platform fee transfer failed");
            }
            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                (bool success, ) = royaltyRecipient.call{value: royaltyAmount}("");
                require(success, "Royalty transfer failed");
                emit RoyaltyPaid(listingId, royaltyRecipient, royaltyAmount, address(0));
            }
            (bool success, ) = listing.seller.call{value: sellerAmount}("");
            require(success, "Seller payment failed");

            // Refund excess ETH
            if (msg.value > price) {
                (bool refundSuccess, ) = buyer.call{value: msg.value - price}("");
                require(refundSuccess, "ETH refund failed");
            }
        } else {
            // ERC-20 payment
            IERC20 paymentToken = IERC20(listing.paymentToken);
            if (platformFee > 0) {
                paymentToken.safeTransferFrom(buyer, feeCollector, platformFee);
            }
            if (royaltyAmount > 0 && royaltyRecipient != address(0)) {
                paymentToken.safeTransferFrom(buyer, royaltyRecipient, royaltyAmount);
                emit RoyaltyPaid(listingId, royaltyRecipient, royaltyAmount, listing.paymentToken);
            }
            paymentToken.safeTransferFrom(buyer, listing.seller, sellerAmount);
        }

        // Transfer NFT
        if (listing.isERC3643) {
            IERC3643(listing.nftContract).transferFrom(listing.seller, buyer, listing.tokenId);
            compliance.transferred(listing.seller, buyer, 1);
        } else {
            IERC721(listing.nftContract).safeTransferFrom(listing.seller, buyer, listing.tokenId);
        }

        // Update listing status
        listing.isActive = false;
        for (uint256 i = 0; i < _activeListingIds.length; i++) {
            if (_activeListingIds[i] == listingId) {
                _activeListingIds[i] = _activeListingIds[_activeListingIds.length - 1];
                _activeListingIds.pop();
                break;
            }
        }

        emit Sale(listingId, listing.seller, buyer, price, listing.paymentToken);
    }

    // Admin Functions
    function addPaymentToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(token != address(0) || token == address(0), "Invalid token address");
        require(!supportedPaymentTokens[token], "Token already supported");
        supportedPaymentTokens[token] = true;
        emit PaymentTokenAdded(token);
    }

    function removePaymentToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(supportedPaymentTokens[token], "Token not supported");
        supportedPaymentTokens[token] = false;
        emit PaymentTokenRemoved(token);
    }

    function updatePlatformFee(uint256 newFeeRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeRate <= 1000, "Fee rate cannot exceed 10%");
        platformFeeRate = newFeeRate;
        emit PlatformFeeUpdated(newFeeRate);
    }

    function updateFeeCollector(address newFeeCollector) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeCollector != address(0), "Invalid fee collector address");
        feeCollector = newFeeCollector;
        emit FeeCollectorUpdated(newFeeCollector);
    }

    function setIdentityRegistry(address _identityRegistry) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_identityRegistry != address(0), "Invalid identity registry");
        identityRegistry = IIdentityRegistry(_identityRegistry);
    }

    function setCompliance(address _compliance) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_compliance != address(0), "Invalid compliance address");
        compliance = ICompliance(_compliance);
    }

    function withdrawFunds(address token, address recipient, uint256 amount)
        external
        onlyRole(WITHDRAWER_ROLE)
        nonReentrant
    {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");

        if (token == address(0)) {
            require(address(this).balance >= amount, "Insufficient ETH balance");
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "ETH withdrawal failed");
        } else {
            require(supportedPaymentTokens[token], "Token not supported");
            IERC20 paymentToken = IERC20(token);
            require(paymentToken.balanceOf(address(this)) >= amount, "Insufficient token balance");
            paymentToken.safeTransfer(recipient, amount);
        }

        emit FundsWithdrawn(token, recipient, amount);
    }

    // View Functions
    function getListingDetails(uint256 listingId)
        external
        view
        returns (
            address seller,
            address nftContract,
            uint256 tokenId,
            address paymentToken,
            uint256 price,
            bool isActive,
            bool isERC3643
        )
    {
        Listing storage listing = listings[listingId];
        return (
            listing.seller,
            listing.nftContract,
            listing.tokenId,
            listing.paymentToken,
            listing.price,
            listing.isActive,
            listing.isERC3643
        );
    }

    function getOfferDetails(uint256 listingId, address buyer)
        external
        view
        returns (
            address offerBuyer,
            address paymentToken,
            uint256 amount,
            uint256 expirationTime,
            bool isActive
        )
    {
        Offer storage offer = offers[listingId][buyer];
        return (
            offer.buyer,
            offer.paymentToken,
            offer.amount,
            offer.expirationTime,
            offer.isActive
        );
    }

    function getAllActiveListings() external view returns (uint256[] memory) {
        return _activeListingIds;
    }

    function isListingActive(uint256 listingId) external view returns (bool) {
        return listings[listingId].isActive;
    }

    // Fallback to receive ETH
    receive() external payable {}
}