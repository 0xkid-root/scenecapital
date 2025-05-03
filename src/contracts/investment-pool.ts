import { ethers } from 'ethers';
import type { BigNumber, ContractTransaction } from 'ethers';

// InvestmentPool contract ABI
export const InvestmentPoolABI = [
  // View functions
  'function getAvailableInvestments() view returns (tuple(uint256 id, string name, string description, uint256 totalFunding, uint256 currentFunding, uint256 minInvestment, uint256 apy, uint256 duration, bool isActive, address paymentToken, uint256 createdAt)[])',
  'function getInvestmentDetails(uint256 investmentId) view returns (tuple(uint256 id, string name, string description, uint256 totalFunding, uint256 currentFunding, uint256 minInvestment, uint256 apy, uint256 duration, bool isActive, address paymentToken, uint256 createdAt))',
  'function getUserInvestments(address investor) view returns (tuple(uint256 investmentId, address investor, uint256 amount, uint256 timestamp, uint256 maturityDate, bool isActive, bool rewardsClaimed)[])',
  'function calculateRewards(uint256 amount, uint256 apy, uint256 duration) pure returns (uint256)',
  'function isTokenSupported(address token) view returns (bool)',
  'function getSupportedTokens() view returns (address[])',
  'function investments(uint256 id) view returns (uint256 id, string name, string description, uint256 totalFunding, uint256 currentFunding, uint256 minInvestment, uint256 apy, uint256 duration, bool isActive, address paymentToken, uint256 createdAt)',
  'function userInvestments(address investor, uint256 investmentId) view returns (uint256 investmentId, address investor, uint256 amount, uint256 timestamp, uint256 maturityDate, bool isActive, bool rewardsClaimed)',
  'function userInvestmentIds(address investor, uint256 index) view returns (uint256)',
  'function allInvestmentIds(uint256 index) view returns (uint256)',
  'function supportedTokens(uint256 index) view returns (address)',
  
  // State-changing functions
  'function createInvestment(string name, string description, uint256 totalFunding, uint256 minInvestment, uint256 apy, uint256 duration, address paymentToken) returns ()',
  'function updateInvestment(uint256 investmentId, uint256 totalFunding, uint256 minInvestment, uint256 apy, uint256 duration, bool isActive) returns ()',
  'function invest(uint256 investmentId, uint256 amount) payable returns ()',
  'function withdrawInvestment(uint256 investmentId) returns ()',
  'function claimRewards(uint256 investmentId) returns ()',
  'function addSupportedToken(address token) returns ()',
  'function removeSupportedToken(address token) returns ()',
  'function withdrawFunds(address token, address recipient, uint256 amount) returns ()',
  
  // Events
  'event InvestmentCreated(uint256 indexed id, string name, uint256 totalFunding, uint256 apy, uint256 duration)',
  'event InvestmentUpdated(uint256 indexed id, uint256 totalFunding, uint256 apy, bool isActive)',
  'event InvestmentMade(uint256 indexed investmentId, address indexed investor, uint256 amount, uint256 maturityDate)',
  'event InvestmentWithdrawn(uint256 indexed investmentId, address indexed investor, uint256 amount)',
  'event RewardsClaimed(uint256 indexed investmentId, address indexed investor, uint256 amount)',
  'event TokenAdded(address indexed token)',
  'event TokenRemoved(address indexed token)',
  'event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount)'
];

// Contract addresses for different networks
export const INVESTMENT_POOL_ADDRESSES: Record<number, `0x${string}`> = {
  1: '0x0000000000000000000000000000000000000000', // Ethereum Mainnet (placeholder)
  11155111: '0x0000000000000000000000000000000000000000', // Sepolia Testnet (placeholder)
  8453: '0x0000000000000000000000000000000000000000', // Base (placeholder)
  10: '0x0000000000000000000000000000000000000000', // Optimism (placeholder)
  42161: '0x0000000000000000000000000000000000000000', // Arbitrum One (placeholder)
};

// Investment interface
export interface Investment {
  id: BigNumber;
  name: string;
  description: string;
  totalFunding: BigNumber;
  currentFunding: BigNumber;
  minInvestment: BigNumber;
  apy: BigNumber;
  duration: BigNumber;
  isActive: boolean;
  paymentToken: string;
  createdAt: BigNumber;
}

// User Investment interface
export interface UserInvestment {
  investmentId: BigNumber;
  investor: string;
  amount: BigNumber;
  timestamp: BigNumber;
  maturityDate: BigNumber;
  isActive: boolean;
  rewardsClaimed: boolean;
}

// Investment Pool contract interface
export interface InvestmentPoolContract {
  // View functions
  getAvailableInvestments(): Promise<Investment[]>;
  getInvestmentDetails(investmentId: BigNumber | number): Promise<Investment>;
  getUserInvestments(investor: string): Promise<UserInvestment[]>;
  calculateRewards(amount: BigNumber | string, apy: BigNumber | number, duration: BigNumber | number): Promise<BigNumber>;
  isTokenSupported(token: string): Promise<boolean>;
  getSupportedTokens(): Promise<string[]>;
  investments(id: BigNumber | number): Promise<Investment>;
  userInvestments(investor: string, investmentId: BigNumber | number): Promise<UserInvestment>;
  
  // State-changing functions
  createInvestment(
    name: string,
    description: string,
    totalFunding: BigNumber | string,
    minInvestment: BigNumber | string,
    apy: number,
    duration: number,
    paymentToken: string
  ): Promise<ContractTransaction>;
  
  updateInvestment(
    investmentId: BigNumber | number,
    totalFunding: BigNumber | string,
    minInvestment: BigNumber | string,
    apy: number,
    duration: number,
    isActive: boolean
  ): Promise<ContractTransaction>;
  
  invest(
    investmentId: BigNumber | number,
    amount: BigNumber | string,
    overrides?: { value?: BigNumber | string }
  ): Promise<ContractTransaction>;
  
  withdrawInvestment(investmentId: BigNumber | number): Promise<ContractTransaction>;
  claimRewards(investmentId: BigNumber | number): Promise<ContractTransaction>;
  addSupportedToken(token: string): Promise<ContractTransaction>;
  removeSupportedToken(token: string): Promise<ContractTransaction>;
  withdrawFunds(token: string, recipient: string, amount: BigNumber | string): Promise<ContractTransaction>;
}
