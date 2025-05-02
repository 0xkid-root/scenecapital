// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Mock ERC-3643 interface for identity verification (replace with T-REX in production)
interface IIdentityRegistry {
    function isVerified(address _userAddress) external view returns (bool);
}

contract SceneCapitalGovernance is
    Initializable,
    GovernorUpgradeable,
    GovernorSettingsUpgradeable,
    GovernorCountingSimpleUpgradeable,
    GovernorVotesUpgradeable,
    GovernorVotesQuorumFractionUpgradeable,
    GovernorTimelockControlUpgradeable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PARAMETER_SETTER_ROLE = keccak256("PARAMETER_SETTER_ROLE");
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    // Storage
    IIdentityRegistry public identityRegistry; // For ERC-3643 voter verification
    mapping(uint256 => string) private _proposalDescriptions; // Store proposal descriptions
    uint256[] private _activeProposalIds; // Track active proposals

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        string description
    );
    event ProposalCanceled(uint256 indexed proposalId);
    event ProposalExecuted(uint256 indexed proposalId);
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        uint8 support,
        uint256 weight,
        string reason
    );
    event ParametersUpdated(
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 quorumPercentage,
        uint256 proposalThreshold
    );
    event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount);


    function initialize(
        IVotes _token,
        TimelockController _timelock,
        IIdentityRegistry _identityRegistry,
        uint48 _votingDelay,
        uint32 _votingPeriod,
        uint256 _quorumPercentage,
        uint256 _proposalThreshold
    ) public initializer {
        __Governor_init("SceneCapitalGovernance");
        __GovernorSettings_init(_votingDelay, _votingPeriod, _proposalThreshold);
        __GovernorCountingSimple_init();
        __GovernorVotes_init(_token);
        __GovernorVotesQuorumFraction_init(_quorumPercentage);
        __GovernorTimelockControl_init(_timelock);
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        require(_identityRegistry.isVerified(address(this)), "Contract not verified");
        identityRegistry = _identityRegistry;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(PARAMETER_SETTER_ROLE, msg.sender);
        _grantRole(WITHDRAWER_ROLE, msg.sender);
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

    // Governance Functions
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override whenNotPaused returns (uint256) {
        require(identityRegistry.isVerified(msg.sender), "Proposer not verified");
        require(targets.length > 0, "No targets provided");
        require(
            targets.length == values.length && values.length == calldatas.length,
            "Array length mismatch"
        );

        uint256 proposalId = super.propose(targets, values, calldatas, description);
        _proposalDescriptions[proposalId] = description;
        _activeProposalIds.push(proposalId);

        emit ProposalCreated(proposalId, msg.sender, targets, values, description);
        return proposalId;
    }

    function castVote(uint256 proposalId, uint8 support)
        public
        override
        whenNotPaused
        returns (uint256)
    {
        require(identityRegistry.isVerified(msg.sender), "Voter not verified");
        uint256 weight = super.castVote(proposalId, support);
        emit VoteCast(msg.sender, proposalId, support, weight, "");
        return weight;
    }

    function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason)
        public
        override
        whenNotPaused
        returns (uint256)
    {
        require(identityRegistry.isVerified(msg.sender), "Voter not verified");
        uint256 weight = super.castVoteWithReason(proposalId, support, reason);
        emit VoteCast(msg.sender, proposalId, support, weight, reason);
        return weight;
    }

    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public override payable whenNotPaused returns (uint256) {
        uint256 proposalId = super.execute(targets, values, calldatas, descriptionHash);
        emit ProposalExecuted(proposalId);
        _removeActiveProposal(proposalId);
        return proposalId;
    }

    function cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public override returns (uint256) {
        require(
            msg.sender == proposer(hashProposal(targets, values, calldatas, descriptionHash)) ||
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        uint256 proposalId = super._cancel(targets, values, calldatas, descriptionHash);
        emit ProposalCanceled(proposalId);
        _removeActiveProposal(proposalId);
        return proposalId;
    }

    // Parameter Management
    function updateGovernanceParameters(
        uint48 newVotingDelay,
        uint32 newVotingPeriod,
        uint256 newQuorumPercentage,
        uint256 newProposalThreshold
    ) external onlyRole(PARAMETER_SETTER_ROLE) {
        require(newQuorumPercentage <= 100, "Quorum percentage too high");
        require(newVotingPeriod > 0, "Invalid voting period");
        require(newProposalThreshold >= 0, "Invalid proposal threshold");

        setVotingDelay(newVotingDelay);
        setVotingPeriod(newVotingPeriod);
        setQuorumNumerator(newQuorumPercentage);
        setProposalThreshold(newProposalThreshold);

        emit ParametersUpdated(newVotingDelay, newVotingPeriod, newQuorumPercentage, newProposalThreshold);
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

    // View Functions
    function votingDelay() public view override(GovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(GovernorUpgradeable, GovernorSettingsUpgradeable) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(GovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalThreshold()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function getProposalDetails(uint256 proposalId)
        external
        view
        returns (
            address proposer,
            address[] memory targets,
            uint256[] memory values,
            bytes[] memory calldatas,
            string memory description,
            ProposalState state
        )
    {
        (
            ,
            address _proposer,
            address[] memory _targets,
            uint256[] memory _values,
            ,
            bytes[] memory _calldatas,
            ,
            
        ) = proposalDetails(proposalId);
        return (
            _proposer,
            _targets,
            _values,
            _calldatas,
            _proposalDescriptions[proposalId],
            state(proposalId)
        );
    }

    function getAllActiveProposals() external view returns (uint256[] memory) {
        return _activeProposalIds;
    }

    function isVoterEligible(address voter) external view returns (bool) {
        return identityRegistry.isVerified(voter) && getVotes(voter, block.number - 1) > 0;
    }

    // Internal Helpers
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _removeActiveProposal(uint256 proposalId) internal {
        for (uint256 i = 0; i < _activeProposalIds.length; i++) {
            if (_activeProposalIds[i] == proposalId) {
                _activeProposalIds[i] = _activeProposalIds[_activeProposalIds.length - 1];
                _activeProposalIds.pop();
                break;
            }
        }
    }

    // Fallback to receive ETH
    receive() external payable {}
}