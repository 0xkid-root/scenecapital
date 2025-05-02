// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

// Mock ERC-3643 interfaces (replace with T-REX imports in production)
interface IERC3643 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IIdentityRegistry {
    function isVerified(address _userAddress) external view returns (bool);
    function registerIdentity(address _userAddress, bytes32 _identity) external;
}

interface ICompliance {
    function canTransfer(address _from, address _to, uint256 _amount) external view returns (bool);
    function transferred(address _from, address _to, uint256 _amount) external;
}

contract IPAssetToken is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    IERC3643,
    IERC2981
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Token metadata
    string private _name;
    string private _symbol;
    uint8 private constant _decimals = 0; // Non-divisible tokens
    uint256 private _totalSupply;

    // Token ID counter
    CountersUpgradeable.Counter private _tokenIdCounter;

    // Storage for balances and allowances
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256[]) private _ownedTokens;

    // Metadata storage
    struct AssetMetadata {
        string title;
        string description;
        string assetType; // e.g., "movie", "music", "art"
        uint256 creationDate;
        string[] contributors;
        string uri; // Token URI for off-chain metadata
    }
    mapping(uint256 => AssetMetadata) private _assetMetadata;

    // Royalty storage (ERC-2981)
    mapping(uint256 => address) private _royaltyReceivers;
    mapping(uint256 => uint96) private _royaltyFractions;

    // Compliance and identity
    IIdentityRegistry public identityRegistry;
    ICompliance public compliance;

    // Events
    event Mint(address indexed to, uint256 indexed tokenId, string uri);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event MetadataUpdated(uint256 indexed tokenId, string title, string description, string assetType);
    event Burn(address indexed owner, uint256 indexed tokenId);


    function initialize(address _identityRegistry, address _compliance,string  _name,string _symbol) public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __Pausable_init();

        _name = _name;
        _symbol = _symbol;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);

        identityRegistry = IIdentityRegistry(_identityRegistry);
        compliance = ICompliance(_compliance);
    }

    // UUPS Upgradeable
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    // Pausable Functions
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ERC-3643 Token Functions
    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        require(account != address(0), "Invalid address");
        return _balances[account];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token does not exist");
        return owner;
    }

    function mintAsset(
        address to,
        string memory uri,
        uint96 royaltyFraction,
        AssetMetadata memory metadata
    ) public onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(identityRegistry.isVerified(to), "Recipient not verified");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _balances[to]++;
        _owners[tokenId] = to;
        _ownedTokens[to].push(tokenId);
        _totalSupply++;

        _assetMetadata[tokenId] = AssetMetadata({
            title: metadata.title,
            description: metadata.description,
            assetType: metadata.assetType,
            creationDate: metadata.creationDate,
            contributors: metadata.contributors,
            uri: uri
        });

        // Set royalty (ERC-2981)
        _royaltyReceivers[tokenId] = to;
        _royaltyFractions[tokenId] = royaltyFraction;

        emit Mint(to, tokenId, uri);
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }

    function burn(uint256 tokenId) public whenNotPaused {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token does not exist");
        require(
            msg.sender == owner || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized"
        );

        _balances[owner]--;
        _totalSupply--;
        delete _owners[tokenId];

        // Update owned tokens
        for (uint256 i = 0; i < _ownedTokens[owner].length; i++) {
            if (_ownedTokens[owner][i] == tokenId) {
                _ownedTokens[owner][i] = _ownedTokens[owner][_ownedTokens[owner].length - 1];
                _ownedTokens[owner].pop();
                break;
            }
        }

        // Clear metadata and royalties
        delete _assetMetadata[tokenId];
        delete _royaltyReceivers[tokenId];
        delete _royaltyFractions[tokenId];

        emit Burn(owner, tokenId);
        emit Transfer(owner, address(0), tokenId);
    }

    function transfer(address recipient, uint256 tokenId) public override whenNotPaused returns (bool) {
        return transferFrom(msg.sender, recipient, tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override whenNotPaused returns (bool) {
        require(_owners[tokenId] == from, "Not owner");
        require(to != address(0), "Invalid recipient");
        require(identityRegistry.isVerified(to), "Recipient not verified");
        require(compliance.canTransfer(from, to, 1), "Transfer not compliant");

        // Check allowance or ownership
        require(
            msg.sender == from ||
            _allowances[from][msg.sender] >= 1 ||
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized"
        );

        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;

        // Update owned tokens
        for (uint256 i = 0; i < _ownedTokens[from].length; i++) {
            if (_ownedTokens[from][i] == tokenId) {
                _ownedTokens[from][i] = _ownedTokens[from][_ownedTokens[from].length - 1];
                _ownedTokens[from].pop();
                break;
            }
        }
        _ownedTokens[to].push(tokenId);

        // Reset allowance
        _allowances[from][msg.sender] = 0;

        compliance.transferred(from, to, 1);
        emit Transfer(from, to, tokenId);
        return true;
    }

    function approve(address spender, uint256 tokenId) public override whenNotPaused returns (bool) {
        address owner = _owners[tokenId];
        require(spender != address(0), "Invalid spender");
        require(msg.sender == owner || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not authorized");

        _allowances[owner][spender] = 1;
        emit Approval(owner, spender, tokenId);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    // Metadata Functions
    function getAssetMetadata(uint256 tokenId) public view returns (AssetMetadata memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _assetMetadata[tokenId];
    }

    function updateAssetMetadata(uint256 tokenId, AssetMetadata memory newMetadata)
        public
        whenNotPaused
    {
        require(_owners[tokenId] != address(0), "Token does not exist");
        require(
            _owners[tokenId] == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        _assetMetadata[tokenId] = AssetMetadata({
            title: newMetadata.title,
            description: newMetadata.description,
            assetType: newMetadata.assetType,
            creationDate: newMetadata.creationDate,
            contributors: newMetadata.contributors,
            uri: _assetMetadata[tokenId].uri // Preserve original URI
        });
        emit MetadataUpdated(tokenId, newMetadata.title, newMetadata.description, newMetadata.assetType);
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        return _assetMetadata[tokenId].uri;
    }

    // ERC-2981 Royalty Functions
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_owners[tokenId] != address(0), "Token does not exist");
        receiver = _royaltyReceivers[tokenId];
        royaltyAmount = (salePrice * _royaltyFractions[tokenId]) / 10000; // Basis points
    }

    // Compliance Management
    function setIdentityRegistry(address _identityRegistry) external onlyRole(COMPLIANCE_ROLE) {
        identityRegistry = IIdentityRegistry(_identityRegistry);
    }

    function setCompliance(address _compliance) external onlyRole(COMPLIANCE_ROLE) {
        compliance = ICompliance(_compliance);
    }

    // Supports Interface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlUpgradeable, IERC2981)
        returns (bool)
    {
        return
            interfaceId == type(IERC3643).interfaceId ||
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}