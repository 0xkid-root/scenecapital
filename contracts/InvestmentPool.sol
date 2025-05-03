// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title InvestmentPool
 * @dev A secure, upgradeable contract for managing investment opportunities and user investments
 * @notice This contract supports both native currency (ETH) and ERC20 tokens, with pausability and upgradeability
 */
contract InvestmentPool is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;

    // Investment opportunity structure
    struct Investment {
        uint256 id;
        string name;
        string description;
        uint256 totalFunding;
        uint256 currentFunding;
        uint256 minInvestment;
        uint256 apy; // Annual percentage yield (in basis points, e.g., 1000 = 10%)
        uint256 duration; // Duration in seconds
        bool isActive;
        address paymentToken; // ERC20 token address or address(0) for native currency
        uint256 createdAt;
    }

    // User investment structure
    struct UserInvestment {
        uint256 investmentId;
        address investor;
        uint256 amount;
        uint256 timestamp;
        uint256 maturityDate;
        bool isActive;
        bool rewardsClaimed;
    }

    // State variables
    mapping(uint256 => Investment) public investments;
    mapping(address => mapping(uint256 => UserInvestment)) public userInvestments;
    mapping(address => uint256[]) public userInvestmentIds;
    uint256[] public allInvestmentIds;
    address[] public supportedTokens;
    uint256 private nextInvestmentId;

    // Constants
    uint256 private constant ONE_YEAR_SECONDS = 365 * 24 * 60 * 60; // Seconds in a year
    uint256 private constant BASIS_POINTS = 10000; // Basis points for APY calculations

    // Events
    event InvestmentCreated(uint256 indexed id, string name, uint256 totalFunding, uint256 apy, uint256 duration);
    event InvestmentUpdated(uint256 indexed id, uint256 totalFunding, uint256 apy, bool isActive);
    event InvestmentMade(uint256 indexed investmentId, address indexed investor, uint256 amount, uint256 maturityDate);
    event InvestmentWithdrawn(uint256 indexed investmentId, address indexed investor, uint256 amount);
    event RewardsClaimed(uint256 indexed investmentId, address indexed investor, uint256 amount);
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    event EmergencyWithdrawn(address indexed user, uint256 indexed investmentId, uint256 amount);

   

    /**
     * @dev Initializes the contract with default settings
     * @notice Must be called during deployment
     */
    function initialize() external initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();
        
        nextInvestmentId = 1;
        supportedTokens.push(address(0)); // Add native currency (ETH) support
    }

    /**
     * @dev Authorizes contract upgrades
     * @param newImplementation Address of the new implementation
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev Creates a new investment opportunity
     * @param _name Name of the investment
     * @param _description Description of the investment
     * @param _totalFunding Total funding required
     * @param _minInvestment Minimum investment amount
     * @param _apy Annual percentage yield (in basis points)
     * @param _duration Duration in seconds
     * @param _paymentToken ERC20 token address or address(0) for native currency
     */
    function createInvestment(
        string memory _name,
        string memory _description,
        uint256 _totalFunding,
        uint256 _minInvestment,
        uint256 _apy,
        uint256 _duration,
        address _paymentToken
    ) external onlyOwner whenNotPaused {
        require(bytes(_name).length > 0, "InvestmentPool: Name cannot be empty");
        require(_totalFunding > 0, "InvestmentPool: Total funding must be > 0");
        require(_minInvestment > 0, "InvestmentPool: Min investment must be > 0");
        require(_minInvestment <= _totalFunding, "InvestmentPool: Min investment exceeds total funding");
        require(_apy > 0 && _apy <= 10000, "InvestmentPool: Invalid APY range");
        require(_duration > 0, "InvestmentPool: Duration must be > 0");
        require(isTokenSupported(_paymentToken), "InvestmentPool: Token not supported");

        uint256 investmentId = nextInvestmentId++;
        
        investments[investmentId] = Investment({
            id: investmentId,
            name: _name,
            description: _description,
            totalFunding: _totalFunding,
            currentFunding: 0,
            minInvestment: _minInvestment,
            apy: _apy,
            duration: _duration,
            isActive: true,
            paymentToken: _paymentToken,
            createdAt: block.timestamp
        });
        
        allInvestmentIds.push(investmentId);
        
        emit InvestmentCreated(investmentId, _name, _totalFunding, _apy, _duration);
    }

    /**
     * @dev Updates an existing investment
     * @param _investmentId ID of the investment to update
     * @param _totalFunding New total funding (0 to keep current)
     * @param _minInvestment New minimum investment (0 to keep current)
     * @param _apy New APY (0 to keep current)
     * @param _duration New duration (0 to keep current)
     * @param _isActive New active status
     */
    function updateInvestment(
        uint256 _investmentId,
        uint256 _totalFunding,
        uint256 _minInvestment,
        uint256 _apy,
        uint256 _duration,
        bool _isActive
    ) external onlyOwner whenNotPaused {
        require(investments[_investmentId].id == _investmentId, "InvestmentPool: Investment does not exist");
        
        Investment storage investment = investments[_investmentId];
        
        if (_totalFunding > 0) {
            require(_totalFunding >= investment.currentFunding, "InvestmentPool: Total funding too low");
            investment.totalFunding = _totalFunding;
        }
        
        if (_minInvestment > 0) {
            require(_minInvestment <= investment.totalFunding, "InvestmentPool: Min investment exceeds total funding");
            investment.minInvestment = _minInvestment;
        }
        
        if (_apy > 0) {
            require(_apy <= 10000, "InvestmentPool: Invalid APY range");
            investment.apy = _apy;
        }
        
        if (_duration > 0) {
            investment.duration = _duration;
        }
        
        investment.isActive = _isActive;
        
        emit InvestmentUpdated(_investmentId, investment.totalFunding, investment.apy, investment.isActive);
    }

    /**
     * @dev Allows users to invest in an opportunity
     * @param _investmentId ID of the investment
     * @param _amount Amount to invest
     */
    function invest(uint256 _investmentId, uint256 _amount) external payable nonReentrant whenNotPaused {
        Investment storage investment = investments[_investmentId];
        
        require(investment.id == _investmentId, "InvestmentPool: Investment does not exist");
        require(investment.isActive, "InvestmentPool: Investment not active");
        require(_amount >= investment.minInvestment, "InvestmentPool: Amount below minimum");
        require(investment.currentFunding + _amount <= investment.totalFunding, "InvestmentPool: Exceeds total funding");
        
        // Handle payment
        if (investment.paymentToken == address(0)) {
            require(msg.value == _amount, "InvestmentPool: Incorrect ETH amount");
        } else {
            require(msg.value == 0, "InvestmentPool: ETH sent with ERC20");
            IERC20(investment.paymentToken).safeTransferFrom(msg.sender, address(this), _amount);
        }
        
        // Update investment
        investment.currentFunding += _amount;
        
        // Create user investment record
        uint256 maturityDate = block.timestamp + investment.duration;
        
        userInvestments[msg.sender][_investmentId] = UserInvestment({
            investmentId: _investmentId,
            investor: msg.sender,
            amount: _amount,
            timestamp: block.timestamp,
            maturityDate: maturityDate,
            isActive: true,
            rewardsClaimed: false
        });
        
        userInvestmentIds[msg.sender].push(_investmentId);
        
        emit InvestmentMade(_investmentId, msg.sender, _amount, maturityDate);
    }

    /**
     * @dev Withdraws an investment after maturity
     * @param _investmentId ID of the investment to withdraw
     */
    function withdrawInvestment(uint256 _investmentId) external nonReentrant whenNotPaused {
        UserInvestment storage userInvestment = userInvestments[msg.sender][_investmentId];
        
        require(userInvestment.investmentId == _investmentId, "InvestmentPool: No investment found");
        require(userInvestment.isActive, "InvestmentPool: Already withdrawn");
        require(block.timestamp >= userInvestment.maturityDate, "InvestmentPool: Not yet mature");
        
        Investment storage investment = investments[_investmentId];
        
        // Mark as withdrawn
        userInvestment.isActive = false;
        
        // Transfer principal
        _transferFunds(investment.paymentToken, msg.sender, userInvestment.amount);
        
        emit InvestmentWithdrawn(_investmentId, msg.sender, userInvestment.amount);
    }

    /**
     * @dev Claims rewards from an investment
     * @param _investmentId ID of the investment
     */
    function claimRewards(uint256 _investmentId) external nonReentrant whenNotPaused {
        UserInvestment storage userInvestment = userInvestments[msg.sender][_investmentId];
        
        require(userInvestment.investmentId == _investmentId, "InvestmentPool: No investment found");
        require(!userInvestment.rewardsClaimed, "InvestmentPool: Rewards already claimed");
        require(block.timestamp >= userInvestment.maturityDate, "InvestmentPool: Not yet mature");
        
        Investment storage investment = investments[_investmentId];
        
        // Calculate and transfer rewards
        uint256 rewardAmount = calculateRewards(userInvestment.amount, investment.apy, investment.duration);
        userInvestment.rewardsClaimed = true;
        
        _transferFunds(investment.paymentToken, msg.sender, rewardAmount);
        
        emit RewardsClaimed(_investmentId, msg.sender, rewardAmount);
    }

    /**
     * @dev Allows emergency withdrawal during paused state
     * @param _investmentId ID of the investment
     */
    function emergencyWithdraw(uint256 _investmentId) external nonReentrant whenPaused {
        UserInvestment storage userInvestment = userInvestments[msg.sender][_investmentId];
        
        require(userInvestment.investmentId == _investmentId, "InvestmentPool: No investment found");
        require(userInvestment.isActive, "InvestmentPool: Already withdrawn");
        
        Investment storage investment = investments[_investmentId];
        
        // Mark as withdrawn
        userInvestment.isActive = false;
        userInvestment.rewardsClaimed = true;
        
        // Transfer principal
        _transferFunds(investment.paymentToken, msg.sender, userInvestment.amount);
        
        emit EmergencyWithdrawn(msg.sender, _investmentId, userInvestment.amount);
    }

    /**
     * @dev Calculates rewards based on amount, APY, and duration
     * @param _amount Investment amount
     * @param _apy APY in basis points
     * @param _duration Duration in seconds
     * @return Reward amount
     */
    function calculateRewards(uint256 _amount, uint256 _apy, uint256 _duration) public pure returns (uint256) {
        return (_amount * _apy * _duration) / (BASIS_POINTS * ONE_YEAR_SECONDS);
    }

    /**
     * @dev Returns all available investments
     * @return Array of active investments
     */
    function getAvailableInvestments() external view returns (Investment[] memory) {
        uint256 count = 0;
        
        // Count active investments
        for (uint256 i = 0; i < allInvestmentIds.length; i++) {
            if (investments[allInvestmentIds[i]].isActive) {
                count++;
            }
        }
        
        // Create array of active investments
        Investment[] memory activeInvestments = new Investment[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allInvestmentIds.length; i++) {
            uint256 id = allInvestmentIds[i];
            if (investments[id].isActive) {
                activeInvestments[index] = investments[id];
                index++;
            }
        }
        
        return activeInvestments;
    }

    /**
     * @dev Returns details of a specific investment
     * @param _investmentId ID of the investment
     * @return Investment details
     */
    function getInvestmentDetails(uint256 _investmentId) external view returns (Investment memory) {
        require(investments[_investmentId].id == _investmentId, "InvestmentPool: Investment does not exist");
        return investments[_investmentId];
    }

    /**
     * @dev Returns all investments made by a user
     * @param _investor Address of the investor
     * @return Array of user investments
     */
    function getUserInvestments(address _investor) external view returns (UserInvestment[] memory) {
        uint256[] memory ids = userInvestmentIds[_investor];
        UserInvestment[] memory result = new UserInvestment[](ids.length);
        
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = userInvestments[_investor][ids[i]];
        }
        
        return result;
    }

    /**
     * @dev Adds a supported token
     * @param _token Address of the token
     */
    function addSupportedToken(address _token) external onlyOwner whenNotPaused {
        require(_token != address(0), "InvestmentPool: Invalid token address");
        require(!isTokenSupported(_token), "InvestmentPool: Token already supported");
        
        // Verify token compatibility
        try IERC20(_token).decimals() returns (uint8) {} catch {
            revert("InvestmentPool: Invalid ERC20 token");
        }
        
        supportedTokens.push(_token);
        emit TokenAdded(_token);
    }

    /**
     * @dev Removes a supported token
     * @param _token Address of the token
     */
    function removeSupportedToken(address _token) external onlyOwner whenNotPaused {
        require(_token != address(0), "InvestmentPool: Cannot remove native currency");
        require(isTokenSupported(_token), "InvestmentPool: Token not supported");
        
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            if (supportedTokens[i] == _token) {
                supportedTokens[i] = supportedTokens[supportedTokens.length - 1];
                supportedTokens.pop();
                emit TokenRemoved(_token);
                break;
            }
        }
    }

    /**
     * @dev Checks if a token is supported
     * @param _token Address of the token
     * @return True if supported, false otherwise
     */
    function isTokenSupported(address _token) public view returns (bool) {
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            if (supportedTokens[i] == _token) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Returns all supported tokens
     * @return Array of supported token addresses
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    /**
     * @dev Withdraws funds from the contract (admin function)
     * @param _token Address of the token (address(0) for native currency)
     * @param _recipient Address of the recipient
     * @param _amount Amount to withdraw
     */
    function withdrawFunds(address _token, address _recipient, uint256 _amount) external onlyOwner whenNotPaused {
        require(_recipient != address(0), "InvestmentPool: Invalid recipient");
        require(_amount > 0, "InvestmentPool: Amount must be > 0");
        
        _transferFunds(_token, _recipient, _amount);
        
        emit FundsWithdrawn(_token, _recipient, _amount);
    }

    /**
     * @dev Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Internal function to transfer funds
     * @param _token Address of the token (address(0) for ETH)
     * @param _recipient Recipient address
     * @param _amount Amount to transfer
     */
    function _transferFunds(address _token, address _recipient, uint256 _amount) internal {
        if (_token == address(0)) {
            require(address(this).balance >= _amount, "InvestmentPool: Insufficient ETH balance");
            (bool success, ) = _recipient.call{value: _amount}("");
            require(success, "InvestmentPool: ETH transfer failed");
        } else {
            require(IERC20(_token).balanceOf(address(this)) >= _amount, "InvestmentPool: Insufficient token balance");
            IERC20(_token).safeTransfer(_recipient, _amount);
        }
    }

    /**
     * @dev Fallback function to accept ETH
     */
    receive() external payable {}
}