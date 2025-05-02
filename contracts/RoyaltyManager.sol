// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RoyaltyManager is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    // Structs
    struct RoyaltyShare {
        address payee;
        uint256 share; // Share in basis points (e.g., 2500 = 25%)
    }

    struct RoyaltyPool {
        uint256 totalShares; // Total shares in basis points (should be 10000)
        mapping(address => uint256) shares; // Payee -> share
        mapping(address => mapping(address => uint256)) released; // Payee -> token -> amount released
        address[] payees; // List of payees
        bool isActive; // Pool status
    }

    // Storage
    mapping(uint256 => RoyaltyPool) private _royaltyPools; // Asset ID -> RoyaltyPool
    mapping(address => bool) public supportedTokens; // Supported ERC-20 tokens
    uint256[] private _activePoolIds; // List of active pool IDs for iteration

    // Events
    event RoyaltyPoolCreated(uint256 indexed assetId);
    event RoyaltyDistributed(uint256 indexed assetId, address indexed token, uint256 amount);
    event NativeRoyaltyDistributed(uint256 indexed assetId, uint256 amount);
    event PayeeAdded(uint256 indexed assetId, address indexed payee, uint256 share);
    event RoyaltySharesUpdated(uint256 indexed assetId, address indexed payee, uint256 newShare);
    event PaymentReleased(uint256 indexed assetId, address indexed payee, address indexed token, uint256 amount);
    event NativePaymentReleased(uint256 indexed assetId, address indexed payee, uint256 amount);
    event TokenSupported(address indexed token);
    event TokenUnsupported(address indexed token);
    event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(WITHDRAWER_ROLE, msg.sender);
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

    // Royalty Pool Management
    function createRoyaltyPool(uint256 assetId, RoyaltyShare[] memory initialShares)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        whenNotPaused
    {
        require(!_royaltyPools[assetId].isActive, "Pool already exists");
        require(initialShares.length > 0, "No payees provided");

        RoyaltyPool storage pool = _royaltyPools[assetId];
        pool.isActive = true;

        // Track unique payees to prevent duplicates
        mapping(address => bool) storage payeeExists;
        uint256 totalShares;

        for (uint256 i = 0; i < initialShares.length; i++) {
            address payee = initialShares[i].payee;
            uint256 share = initialShares[i].share;

            require(payee != address(0), "Invalid payee address");
            require(share > 0, "Share must be greater than 0");
            require(!payeeExists[payee], "Duplicate payee");

            pool.shares[payee] = share;
            totalShares += share;
            pool.payees.push(payee);
            payeeExists[payee] = true;

            emit PayeeAdded(assetId, payee, share);
        }

        require(totalShares == 10000, "Total shares must equal 100%");
        pool.totalShares = totalShares;
        _activePoolIds.push(assetId);

        emit RoyaltyPoolCreated(assetId);
    }

    function updateRoyaltyShares(uint256 assetId, RoyaltyShare[] memory newShares)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        whenNotPaused
    {
        require(_royaltyPools[assetId].isActive, "Pool does not exist");
        require(newShares.length > 0, "No payees provided");

        RoyaltyPool storage pool = _royaltyPools[assetId];

        // Clear existing shares and payees
        for (uint256 i = 0; i < pool.payees.length; i++) {
            delete pool.shares[pool.payees[i]];
        }
        delete pool.payees;
        pool.totalShares = 0;

        // Track unique payees
        mapping(address => bool) storage payeeExists;
        uint256 totalShares;

        for (uint256 i = 0; i < newShares.length; i++) {
            address payee = newShares[i].payee;
            uint256 share = newShares[i].share;

            require(payee != address(0), "Invalid payee address");
            require(share > 0, "Share must be greater than 0");
            require(!payeeExists[payee], "Duplicate payee");

            pool.shares[payee] = share;
            totalShares += share;
            pool.payees.push(payee);
            payeeExists[payee] = true;

            emit RoyaltySharesUpdated(assetId, payee, share);
        }

        require(totalShares == 10000, "Total shares must equal 100%");
        pool.totalShares = totalShares;
    }

    // Royalty Distribution
    function distributeRoyalties(uint256 assetId, address token, uint256 amount)
        external
        onlyRole(DISTRIBUTOR_ROLE)
        nonReentrant
        whenNotPaused
    {
        require(_royaltyPools[assetId].isActive, "Pool does not exist");
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");

        RoyaltyPool storage pool = _royaltyPools[assetId];
        IERC20 paymentToken = IERC20(token);

        require(paymentToken.balanceOf(address(this)) >= amount, "Insufficient balance");

        for (uint256 i = 0; i < pool.payees.length; i++) {
            address payee = pool.payees[i];
            uint256 share = pool.shares[payee];
            if (share > 0) {
                uint256 payment = (amount * share) / pool.totalShares;
                if (payment > 0) {
                    pool.released[payee][token] += payment;
                    paymentToken.safeTransfer(payee, payment);
                    emit PaymentReleased(assetId, payee, token, payment);
                }
            }
        }

        emit RoyaltyDistributed(assetId, token, amount);
    }

    function distributeNativeRoyalties(uint256 assetId, uint256 amount)
        external
        payable
        onlyRole(DISTRIBUTOR_ROLE)
        nonReentrant
        whenNotPaused
    {
        require(_royaltyPools[assetId].isActive, "Pool does not exist");
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value >= amount, "Insufficient ETH sent");

        RoyaltyPool storage pool = _royaltyPools[assetId];

        for (uint256 i = 0; i < pool.payees.length; i++) {
            address payee = pool.payees[i];
            uint256 share = pool.shares[payee];
            if (share > 0) {
                uint256 payment = (amount * share) / pool.totalShares;
                if (payment > 0) {
                    pool.released[payee][address(0)] += payment;
                    (bool success, ) = payee.call{value: payment}("");
                    require(success, "ETH transfer failed");
                    emit NativePaymentReleased(assetId, payee, payment);
                }
            }
        }

        // Refund excess ETH
        if (msg.value > amount) {
            (bool success, ) = msg.sender.call{value: msg.value - amount}("");
            require(success, "ETH refund failed");
        }

        emit NativeRoyaltyDistributed(assetId, amount);
    }

    function batchDistributeRoyalties(
        uint256[] memory assetIds,
        address[] memory tokens,
        uint256[] memory amounts
    ) external onlyRole(DISTRIBUTOR_ROLE) nonReentrant whenNotPaused {
        require(assetIds.length == tokens.length && tokens.length == amounts.length, "Array length mismatch");

        for (uint256 i = 0; i < assetIds.length; i++) {
            require(_royaltyPools[assetIds[i]].isActive, "Pool does not exist");
            require(supportedTokens[tokens[i]], "Token not supported");
            require(amounts[i] > 0, "Amount must be greater than 0");

            RoyaltyPool storage pool = _royaltyPools[assetIds[i]];
            IERC20 paymentToken = IERC20(tokens[i]);

            require(paymentToken.balanceOf(address(this)) >= amounts[i], "Insufficient balance");

            for (uint256 j = 0; j < pool.payees.length; j++) {
                address payee = pool.payees[j];
                uint256 share = pool.shares[payee];
                if (share > 0) {
                    uint256 payment = (amounts[i] * share) / pool.totalShares;
                    if (payment > 0) {
                        pool.released[payee][tokens[i]] += payment;
                        paymentToken.safeTransfer(payee, payment);
                        emit PaymentReleased(assetIds[i], payee, tokens[i], payment);
                    }
                }
            }

            emit RoyaltyDistributed(assetIds[i], tokens[i], amounts[i]);
        }
    }

    // Token Management
    function addSupportedToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(token != address(0), "Invalid token address");
        require(!supportedTokens[token], "Token already supported");
        supportedTokens[token] = true;
        emit TokenSupported(token);
    }

    function removeSupportedToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(supportedTokens[token], "Token not supported");
        supportedTokens[token] = false;
        emit TokenUnsupported(token);
    }

    // Fund Withdrawal
    function withdrawFunds(address token, address recipient, uint256 amount)
        external
        onlyRole(WITHDRAWER_ROLE)
        nonReentrant
    {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");

        if (token == address(0)) {
            // Withdraw ETH
            require(address(this).balance >= amount, "Insufficient ETH balance");
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "ETH withdrawal failed");
        } else {
            // Withdraw ERC-20
            require(supportedTokens[token], "Token not supported");
            IERC20 paymentToken = IERC20(token);
            require(paymentToken.balanceOf(address(this)) >= amount, "Insufficient token balance");
            paymentToken.safeTransfer(recipient, amount);
        }

        emit FundsWithdrawn(token, recipient, amount);
    }

    // View Functions
    function getRoyaltyShares(uint256 assetId, address payee) external view returns (uint256) {
        return _royaltyPools[assetId].shares[payee];
    }

    function getRoyaltyPoolInfo(uint256 assetId)
        external
        view
        returns (
            uint256 totalShares,
            address[] memory payees,
            bool isActive
        )
    {
        RoyaltyPool storage pool = _royaltyPools[assetId];
        return (pool.totalShares, pool.payees, pool.isActive);
    }

    function getReleasedAmount(uint256 assetId, address payee, address token)
        external
        view
        returns (uint256)
    {
        return _royaltyPools[assetId].released[payee][token];
    }

    function getPayeeDetails(uint256 assetId, address payee)
        external
        view
        returns (
            uint256 share,
            uint256 releasedETH,
            uint256 releasedToken
        )
    {
        RoyaltyPool storage pool = _royaltyPools[assetId];
        return (
            pool.shares[payee],
            pool.released[payee][address(0)],
            supportedTokens[msg.sender] ? pool.released[payee][msg.sender] : 0
        );
    }

    function getAllRoyaltyPools() external view returns (uint256[] memory) {
        return _activePoolIds;
    }

    function isPoolActive(uint256 assetId) external view returns (bool) {
        return _royaltyPools[assetId].isActive;
    }

    // Fallback to receive ETH
    receive() external payable {}
}