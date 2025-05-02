// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IPAssetToken.sol";

interface IRoyaltyManager {
    struct RoyaltyShare {
        address payee;
        uint256 share;
    }

    function createRoyaltyPool(uint256 assetId, RoyaltyShare[] memory initialShares) external;
}

contract IPAssetFactory is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");
    bytes32 public constant CONFIGURATOR_ROLE = keccak256("CONFIGURATOR_ROLE");

    // State variables
    address public implementation; // IPAssetToken implementation
    address public identityRegistry; // ERC-3643 identity registry
    address public compliance; // ERC-3643 compliance contract
    address public royaltyManager; // RoyaltyManager contract
    address public marketplace; // Marketplace contract
    address[] public deployedAssets; // List of deployed assets
    mapping(address => bool) public isDeployedAsset; // Verify deployed assets
    mapping(address => IPAssetToken.AssetMetadata) public assetMetadata; // Asset -> metadata

    // Events
    event AssetCreated(
        address indexed assetAddress,
        string name,
        string symbol,
        address indexed creator,
        uint256 tokenId
    );
    event AssetCreatedWithMetadata(
        address indexed assetAddress,
        uint256 indexed tokenId,
        string title,
        string assetType,
        address indexed creator
    );
    event ImplementationUpdated(address indexed newImplementation);
    event IdentityRegistryUpdated(address indexed newIdentityRegistry);
    event ComplianceUpdated(address indexed newCompliance);
    event RoyaltyManagerUpdated(address indexed newRoyaltyManager);
    event MarketplaceUpdated(address indexed newMarketplace);
    event RoyaltyPoolLinked(address indexed assetAddress, uint256 indexed assetId);
    event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount);



    function initialize(
        address _implementation,
        address _identityRegistry,
        address _compliance,
        address _royaltyManager,
        address _marketplace
    ) public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        require(_implementation != address(0), "Invalid implementation address");
        require(_identityRegistry != address(0), "Invalid identity registry address");
        require(_compliance != address(0), "Invalid compliance address");

        implementation = _implementation;
        identityRegistry = _identityRegistry;
        compliance = _compliance;
        royaltyManager = _royaltyManager;
        marketplace = _marketplace;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(WITHDRAWER_ROLE, msg.sender);
        _grantRole(CONFIGURATOR_ROLE, msg.sender);
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

    /**
     * @dev Creates a new IP Asset token using minimal proxy pattern
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param royaltyReceiver The address to receive royalties
     * @param royaltyPercentage The royalty percentage in basis points (e.g., 250 = 2.5%)
     * @param metadata The asset metadata
     * @param royaltyShares Optional royalty shares for RoyaltyManager
     * @return The address of the newly created IP Asset token and token ID
     */
    function createIPAsset(
        string memory name,
        string memory symbol,
        address royaltyReceiver,
        uint96 royaltyPercentage,
        IPAssetToken.AssetMetadata memory metadata,
        IRoyaltyManager.RoyaltyShare[] memory royaltyShares
    ) external whenNotPaused nonReentrant onlyRole(CREATOR_ROLE) returns (address, uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(royaltyReceiver != address(0), "Invalid royalty receiver");
        require(royaltyPercentage <= 1000, "Royalty percentage cannot exceed 10%");
        require(bytes(metadata.title).length > 0, "Metadata title cannot be empty");
        require(bytes(metadata.assetType).length > 0, "Metadata asset type cannot be empty");
        require(metadata.creationDate <= block.timestamp, "Invalid creation date");

        // Create minimal proxy clone
        address clone = Clones.clone(implementation);

        // Initialize the token
        IPAssetToken(clone).initialize(
            identityRegistry,
            compliance,
            name,
            symbol,
            msg.sender,
            royaltyReceiver,
            royaltyPercentage,
            metadata
        );

        // Mint initial token
        uint256 tokenId = IPAssetToken(clone).mintAsset(msg.sender, metadata.uri, royaltyPercentage, metadata);

        // Approve marketplace if set
        if (marketplace != address(0)) {
            IPAssetToken(clone).setApprovalForAll(marketplace, true);
        }

        // Register the new asset
        deployedAssets.push(clone);
        isDeployedAsset[clone] = true;
        assetMetadata[clone] = metadata;

        // Create royalty pool if royaltyShares provided and RoyaltyManager is set
        if (royaltyShares.length > 0 && royaltyManager != address(0)) {
            IRoyaltyManager(royaltyManager).createRoyaltyPool(tokenId, royaltyShares);
            emit RoyaltyPoolLinked(clone, tokenId);
        }

        emit AssetCreated(clone, name, symbol, msg.sender, tokenId);
        emit AssetCreatedWithMetadata(clone, tokenId, metadata.title, metadata.assetType, msg.sender);
        return (clone, tokenId);
    }

    /**
     * @dev Creates multiple IP Asset tokens in a single transaction
     * @param names Array of token names
     * @param symbols Array of token symbols
     * @param royaltyReceivers Array of royalty receiver addresses
     * @param royaltyPercentages Array of royalty percentages
     * @param metadatas Array of asset metadata
     * @param royaltyShares Array of royalty share arrays for RoyaltyManager
     * @return Array of addresses and token IDs of the newly created IP Asset tokens
     */
    function batchCreateIPAssets(
        string[] memory names,
        string[] memory symbols,
        address[] memory royaltyReceivers,
        uint96[] memory royaltyPercentages,
        IPAssetToken.AssetMetadata[] memory metadatas,
        IRoyaltyManager.RoyaltyShare[][] memory royaltyShares
    ) external whenNotPaused nonReentrant onlyRole(CREATOR_ROLE) returns (address[] memory, uint256[] memory) {
        require(
            names.length == symbols.length &&
            symbols.length == royaltyReceivers.length &&
            royaltyReceivers.length == royaltyPercentages.length &&
            royaltyPercentages.length == metadatas.length &&
            metadatas.length == royaltyShares.length,
            "Array lengths must match"
        );

        address[] memory newAssets = new address[](names.length);
        uint256[] memory tokenIds = new uint256[](names.length);
        for (uint256 i = 0; i < names.length; i++) {
            (newAssets[i], tokenIds[i]) = createIPAsset(
                names[i],
                symbols[i],
                royaltyReceivers[i],
                royaltyPercentages[i],
                metadatas[i],
                royaltyShares[i]
            );
        }

        return (newAssets, tokenIds);
    }

    /**
     * @dev Updates the implementation address for future deployments
     * @param newImplementation The new implementation address
     */
    function updateImplementation(address newImplementation) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newImplementation != address(0), "Invalid implementation address");
        implementation = newImplementation;
        emit ImplementationUpdated(newImplementation);
    }

    /**
     * @dev Updates the identity registry address
     * @param newIdentityRegistry The new identity registry address
     */
    function updateIdentityRegistry(address newIdentityRegistry) external onlyRole(CONFIGURATOR_ROLE) {
        require(newIdentityRegistry != address(0), "Invalid identity registry address");
        identityRegistry = newIdentityRegistry;
        emit IdentityRegistryUpdated(newIdentityRegistry);
    }

    /**
     * @dev Updates the compliance contract address
     * @param newCompliance The new compliance contract address
     */
    function updateCompliance(address newCompliance) external onlyRole(CONFIGURATOR_ROLE) {
        require(newCompliance != address(0), "Invalid compliance address");
        compliance = newCompliance;
        emit ComplianceUpdated(newCompliance);
    }

    /**
     * @dev Updates the royalty manager contract address
     * @param newRoyaltyManager The new royalty manager address
     */
    function updateRoyaltyManager(address newRoyaltyManager) external onlyRole(CONFIGURATOR_ROLE) {
        royaltyManager = newRoyaltyManager;
        emit RoyaltyManagerUpdated(newRoyaltyManager);
    }

    /**
     * @dev Updates the marketplace contract address
     * @param newMarketplace The new marketplace address
     */
    function updateMarketplace(address newMarketplace) external onlyRole(CONFIGURATOR_ROLE) {
        marketplace = newMarketplace;
        emit MarketplaceUpdated(newMarketplace);
    }

    /**
     * @dev Withdraws stuck ETH or ERC-20 tokens
     * @param token The token address (address(0) for ETH)
     * @param recipient The recipient address
     * @param amount The amount to withdraw
     */
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
            IERC20 paymentToken = IERC20(token);
            require(paymentToken.balanceOf(address(this)) >= amount, "Insufficient token balance");
            paymentToken.safeTransfer(recipient, amount);
        }

        emit FundsWithdrawn(token, recipient, amount);
    }

    /**
     * @dev Returns all deployed IP Asset addresses
     * @return Array of deployed IP Asset addresses
     */
    function getAllDeployedAssets() external view returns (address[] memory) {
        return deployedAssets;
    }

    /**
     * @dev Returns the total number of deployed IP Assets
     * @return The total number of deployed assets
     */
    function getDeployedAssetsCount() external view returns (uint256) {
        return deployedAssets.length;
    }

    /**
     * @dev Verifies if an address is a deployed IP Asset
     * @param asset The address to verify
     * @return True if the address is a deployed IP Asset
     */
    function isIPAsset(address asset) external view returns (bool) {
        return isDeployedAsset[asset];
    }

    /**
     * @dev Returns details of a deployed IP Asset
     * @param asset The asset address
     * @return name, symbol, creator, tokenId
     */
    function getAssetDetails(address asset)
        external
        view
        returns (string memory name, string memory symbol, address creator, uint256 tokenId)
    {
        require(isDeployedAsset[asset], "Not a deployed asset");
        IPAssetToken token = IPAssetToken(asset);
        return (
            token.name(),
            token.symbol(),
            token.ownerOf(0), // Assuming first token ID is 0
            0 // First token ID
        );
    }

    /**
     * @dev Returns metadata of a deployed IP Asset
     * @param asset The asset address
     * @return AssetMetadata struct
     */
    function getAssetMetadata(address asset) external view returns (IPAssetToken.AssetMetadata memory) {
        require(isDeployedAsset[asset], "Not a deployed asset");
        return assetMetadata[asset];
    }

    /**
     * @dev Checks if an asset is compatible with the marketplace
     * @param asset The asset address
     * @return True if compatible
     */
    function isAssetCompatible(address asset) external view returns (bool) {
        if (!isDeployedAsset[asset] || marketplace == address(0)) {
            return false;
        }
        return IPAssetToken(asset).isApprovedForAll(asset, marketplace);
    }

    // Fallback to receive ETH
    receive() external payable {}
}