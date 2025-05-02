import { ethers } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber, Contract, ContractTransaction } from 'ethers';

// Contract ABI fragments (minimal for SDK usage)
const IPAssetFactoryABI = [
  'function createIPAsset(string name, string symbol, address royaltyReceiver, uint96 royaltyPercentage, (string title, string description, string assetType, uint256 creationDate, string[] contributors, string uri) metadata, (address payee, uint256 share)[] royaltyShares) returns (address, uint256)',
  'function batchCreateIPAssets(string[] names, string[] symbols, address[] royaltyReceivers, uint96[] royaltyPercentages, (string title, string description, string assetType, uint256 creationDate, string[] contributors, string uri)[] metadatas, (address payee, uint256 share)[][] royaltyShares) returns (address[], uint256[])',
  'function getAllDeployedAssets() view returns (address[])',
  'function getAssetDetails(address asset) view returns (string name, string symbol, address creator, uint256 tokenId)',
  'function getAssetMetadata(address asset) view returns ((string title, string description, string assetType, uint256 creationDate, string[] contributors, string uri))',
  'function isAssetCompatible(address asset) view returns (bool)',
  'function identityRegistry() view returns (address)',
  'function updateImplementation(address newImplementation)',
  'function updateIdentityRegistry(address newIdentityRegistry)',
  'function updateCompliance(address newCompliance)',
  'function updateRoyaltyManager(address newRoyaltyManager)',
  'function updateMarketplace(address newMarketplace)',
  'function withdrawFunds(address token, address recipient, uint256 amount)',
  'event AssetCreated(address indexed assetAddress, string name, string symbol, address indexed creator, uint256 tokenId)',
  'event AssetCreatedWithMetadata(address indexed assetAddress, uint256 indexed tokenId, string title, string assetType, address indexed creator)',
  'event ImplementationUpdated(address indexed newImplementation)',
  'event IdentityRegistryUpdated(address indexed newIdentityRegistry)',
  'event ComplianceUpdated(address indexed newCompliance)',
  'event RoyaltyManagerUpdated(address indexed newRoyaltyManager)',
  'event MarketplaceUpdated(address indexed newMarketplace)',
  'event RoyaltyPoolLinked(address indexed assetAddress, uint256 indexed assetId)',
  'event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount)'
];

const RoyaltyManagerABI = [
  'function createRoyaltyPool(uint256 assetId, (address payee, uint256 share)[] initialShares)',
  'function updateRoyaltyShares(uint256 assetId, (address payee, uint256 share)[] newShares)',
  'function distributeRoyalties(uint256 assetId, address token, uint256 amount)',
  'function distributeNativeRoyalties(uint256 assetId, uint256 amount) payable',
  'function batchDistributeRoyalties(uint256[] assetIds, address[] tokens, uint256[] amounts)',
  'function addSupportedToken(address token)',
  'function removeSupportedToken(address token)',
  'function withdrawFunds(address token, address recipient, uint256 amount)',
  'function getRoyaltyShares(uint256 assetId, address payee) view returns (uint256)',
  'function getRoyaltyPoolInfo(uint256 assetId) view returns (uint256 totalShares, address[] payees, bool isActive)',
  'function getReleasedAmount(uint256 assetId, address payee, address token) view returns (uint256)',
  'function getAllRoyaltyPools() view returns (uint256[])',
  'function isPoolActive(uint256 assetId) view returns (bool)',
  'event RoyaltyPoolCreated(uint256 indexed assetId)',
  'event RoyaltyDistributed(uint256 indexed assetId, address indexed token, uint256 amount)',
  'event NativeRoyaltyDistributed(uint256 indexed assetId, uint256 amount)',
  'event PayeeAdded(uint256 indexed assetId, address indexed payee, uint256 share)',
  'event RoyaltySharesUpdated(uint256 indexed assetId, address indexed payee, uint256 newShare)',
  'event PaymentReleased(uint256 indexed assetId, address indexed payee, address indexed token, uint256 amount)',
  'event NativePaymentReleased(uint256 indexed assetId, address indexed payee, uint256 amount)',
  'event TokenSupported(address indexed token)',
  'event TokenUnsupported(address indexed token)',
  'event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount)'
];

const MarketplaceABI = [
  'function createListing(address nftContract, uint256 tokenId, address paymentToken, uint256 price, bool isERC3643) returns (uint256)',
  'function batchCreateListing(address[] nftContracts, uint256[] tokenIds, address[] paymentTokens, uint256[] prices, bool[] isERC3643s) returns (uint256[])',
  'function updateListing(uint256 listingId, uint256 newPrice)',
  'function cancelListing(uint256 listingId)',
  'function batchCancelListing(uint256[] listingIds)',
  'function makeOffer(uint256 listingId, uint256 amount, uint256 duration) payable',
  'function acceptOffer(uint256 listingId, address buyer)',
  'function cancelOffer(uint256 listingId)',
  'function buyNow(uint256 listingId) payable',
  'function batchBuyNow(uint256[] listingIds) payable',
  'function addPaymentToken(address token)',
  'function removePaymentToken(address token)',
  'function updatePlatformFee(uint256 newFeeRate)',
  'function updateFeeCollector(address newFeeCollector)',
  'function setIdentityRegistry(address _identityRegistry)',
  'function setCompliance(address _compliance)',
  'function withdrawFunds(address token, address recipient, uint256 amount)',
  'function getListingDetails(uint256 listingId) view returns (address seller, address nftContract, uint256 tokenId, address paymentToken, uint256 price, bool isActive, bool isERC3643)',
  'function getOfferDetails(uint256 listingId, address buyer) view returns (address offerBuyer, address paymentToken, uint256 amount, uint256 expirationTime, bool isActive)',
  'function getAllActiveListings() view returns (uint256[])',
  'function isListingActive(uint256 listingId) view returns (bool)',
  'event ListingCreated(uint256 indexed listingId, address indexed seller, address nftContract, uint256 tokenId, address paymentToken, uint256 price, bool isERC3643)',
  'event ListingUpdated(uint256 indexed listingId, uint256 newPrice)',
  'event ListingCanceled(uint256 indexed listingId)',
  'event OfferCreated(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 expirationTime, address paymentToken)',
  'event OfferAccepted(uint256 indexed listingId, address indexed buyer)',
  'event OfferCanceled(uint256 indexed listingId, address indexed buyer)',
  'event Sale(uint256 indexed listingId, address indexed seller, address indexed buyer, uint256 price, address paymentToken)',
  'event RoyaltyPaid(uint256 indexed listingId, address indexed recipient, uint256 amount, address paymentToken)',
  'event PaymentTokenAdded(address indexed token)',
  'event PaymentTokenRemoved(address indexed token)',
  'event PlatformFeeUpdated(uint256 newFeeRate)',
  'event FeeCollectorUpdated(address indexed newFeeCollector)',
  'event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount)'
];

const GovernanceABI = [
  'function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) returns (uint256)',
  'function castVote(uint256 proposalId, uint8 support) returns (uint256)',
  'function castVoteWithReason(uint256 proposalId, uint8 support, string reason) returns (uint256)',
  'function execute(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) payable returns (uint256)',
  'function cancel(address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash) returns (uint256)',
  'function updateGovernanceParameters(uint48 newVotingDelay, uint32 newVotingPeriod, uint256 newQuorumPercentage, uint256 newProposalThreshold)',
  'function withdrawFunds(address token, address recipient, uint256 amount)',
  'function pause()',
  'function unpause()',
  'function votingDelay() view returns (uint256)',
  'function votingPeriod() view returns (uint256)',
  'function quorum(uint256 blockNumber) view returns (uint256)',
  'function state(uint256 proposalId) view returns (uint8)',
  'function proposalThreshold() view returns (uint256)',
  'function getProposalDetails(uint256 proposalId) view returns (address proposer, address[] targets, uint256[] values, bytes[] calldatas, string description, uint8 state)',
  'function getAllActiveProposals() view returns (uint256[])',
  'function isVoterEligible(address voter) view returns (bool)',
  'event ProposalCreated(uint256 indexed proposalId, address indexed proposer, address[] targets, uint256[] values, string description)',
  'event ProposalCanceled(uint256 indexed proposalId)',
  'event ProposalExecuted(uint256 indexed proposalId)',
  'event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 weight, string reason)',
  'event ParametersUpdated(uint256 votingDelay, uint256 votingPeriod, uint256 quorumPercentage, uint256 proposalThreshold)',
  'event FundsWithdrawn(address indexed token, address indexed recipient, uint256 amount)'
];

const IPAssetTokenABI = [
  'function mintAsset(address to, string uri, uint96 royaltyFraction, (string title, string description, string assetType, uint256 creationDate, string[] contributors, string uri) metadata) returns (uint256)',
  'function burn(uint256 tokenId)',
  'function transfer(address recipient, uint256 tokenId) returns (bool)',
  'function transferFrom(address from, address to, uint256 tokenId) returns (bool)',
  'function approve(address spender, uint256 tokenId) returns (bool)',
  'function updateAssetMetadata(uint256 tokenId, (string title, string description, string assetType, uint256 creationDate, string[] contributors, string uri) newMetadata)',
  'function setIdentityRegistry(address _identityRegistry)',
  'function setCompliance(address _compliance)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function getAssetMetadata(uint256 tokenId) view returns ((string title, string description, string assetType, uint256 creationDate, string[] contributors, string uri))',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address receiver, uint256 royaltyAmount)',
  'event Mint(address indexed to, uint256 indexed tokenId, string uri)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event MetadataUpdated(uint256 indexed tokenId, string title, string description, string assetType)',
  'event Burn(address indexed owner, uint256 indexed tokenId)'
];

const IdentityRegistryABI = [
  'function isVerified(address _userAddress) view returns (bool)',
  'function registerIdentity(address _userAddress, bytes32 _identity)'
];

// Types
export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}

export interface AssetMetadata {
  title: string;
  description: string;
  assetType: string;
  creationDate: number;
  contributors: string[];
  uri: string;
}

export interface RoyaltyShare {
  payee: string;
  share: number; // Share in basis points (e.g., 2500 = 25%)
}

export interface AssetDetails {
  name: string;
  symbol: string;
  creator: string;
  tokenId: number;
}

export interface Listing {
  seller: string;
  nftContract: string;
  tokenId: number;
  paymentToken: string;
  price: BigNumber;
  isActive: boolean;
  isERC3643: boolean;
}

export interface Offer {
  buyer: string;
  paymentToken: string;
  amount: BigNumber;
  expirationTime: number;
  isActive: boolean;
}

export interface ProposalDetails {
  proposer: string;
  targets: string[];
  values: BigNumber[];
  calldatas: string[];
  description: string;
  state: ProposalState;
}

export interface RoyaltyPoolInfo {
  totalShares: number;
  payees: string[];
  isActive: boolean;
}

// Interfaces for contract instances
interface IPAssetFactoryContract extends Contract {
  createIPAsset: (
    name: string,
    symbol: string,
    royaltyReceiver: string,
    royaltyPercentage: number,
    metadata: AssetMetadata,
    royaltyShares: RoyaltyShare[]
  ) => Promise<ContractTransaction>;
  batchCreateIPAssets: (
    names: string[],
    symbols: string[],
    royaltyReceivers: string[],
    royaltyPercentages: number[],
    metadatas: AssetMetadata[],
    royaltyShares: RoyaltyShare[][]
  ) => Promise<ContractTransaction>;
  getAllDeployedAssets: () => Promise<string[]>;
  getAssetDetails: (assetAddress: string) => Promise<AssetDetails>;
  getAssetMetadata: (assetAddress: string) => Promise<AssetMetadata>;
  isAssetCompatible: (assetAddress: string) => Promise<boolean>;
  identityRegistry: () => Promise<string>;
  updateImplementation: (newImplementation: string) => Promise<ContractTransaction>;
  updateIdentityRegistry: (newIdentityRegistry: string) => Promise<ContractTransaction>;
  updateCompliance: (newCompliance: string) => Promise<ContractTransaction>;
  updateRoyaltyManager: (newRoyaltyManager: string) => Promise<ContractTransaction>;
  updateMarketplace: (newMarketplace: string) => Promise<ContractTransaction>;
  withdrawFunds: (token: string, recipient: string, amount: BigNumber) => Promise<ContractTransaction>;
}

interface RoyaltyManagerContract extends Contract {
  createRoyaltyPool: (assetId: number, initialShares: RoyaltyShare[]) => Promise<ContractTransaction>;
  updateRoyaltyShares: (assetId: number, newShares: RoyaltyShare[]) => Promise<ContractTransaction>;
  distributeRoyalties: (assetId: number, token: string, amount: BigNumber) => Promise<ContractTransaction>;
  distributeNativeRoyalties: (assetId: number, amount: BigNumber) => Promise<ContractTransaction>;
  batchDistributeRoyalties: (
    assetIds: number[],
    tokens: string[],
    amounts: BigNumber[]
  ) => Promise<ContractTransaction>;
  addSupportedToken: (token: string) => Promise<ContractTransaction>;
  removeSupportedToken: (token: string) => Promise<ContractTransaction>;
  withdrawFunds: (token: string, recipient: string, amount: BigNumber) => Promise<ContractTransaction>;
  getRoyaltyShares: (assetId: number, payee: string) => Promise<BigNumber>;
  getRoyaltyPoolInfo: (assetId: number) => Promise<RoyaltyPoolInfo>;
  getReleasedAmount: (assetId: number, payee: string, token: string) => Promise<BigNumber>;
  getAllRoyaltyPools: () => Promise<number[]>;
  isPoolActive: (assetId: number) => Promise<boolean>;
}

interface MarketplaceContract extends Contract {
  createListing: (
    nftContract: string,
    tokenId: number,
    paymentToken: string,
    price: BigNumber,
    isERC3643: boolean
  ) => Promise<ContractTransaction>;
  batchCreateListing: (
    nftContracts: string[],
    tokenIds: number[],
    paymentTokens: string[],
    prices: BigNumber[],
    isERC3643s: boolean[]
  ) => Promise<ContractTransaction>;
  updateListing: (listingId: number, newPrice: BigNumber) => Promise<ContractTransaction>;
  cancelListing: (listingId: number) => Promise<ContractTransaction>;
  batchCancelListing: (listingIds: number[]) => Promise<ContractTransaction>;
  makeOffer: (listingId: number, amount: BigNumber, duration: number) => Promise<ContractTransaction>;
  acceptOffer: (listingId: number, buyer: string) => Promise<ContractTransaction>;
  cancelOffer: (listingId: number) => Promise<ContractTransaction>;
  buyNow: (listingId: number) => Promise<ContractTransaction>;
  batchBuyNow: (listingIds: number[]) => Promise<ContractTransaction>;
  addPaymentToken: (token: string) => Promise<ContractTransaction>;
  removePaymentToken: (token: string) => Promise<ContractTransaction>;
  updatePlatformFee: (newFeeRate: number) => Promise<ContractTransaction>;
  updateFeeCollector: (newFeeCollector: string) => Promise<ContractTransaction>;
  setIdentityRegistry: (identityRegistry: string) => Promise<ContractTransaction>;
  setCompliance: (compliance: string) => Promise<ContractTransaction>;
  withdrawFunds: (token: string, recipient: string, amount: BigNumber) => Promise<ContractTransaction>;
  getListingDetails: (listingId: number) => Promise<Listing>;
  getOfferDetails: (listingId: number, buyer: string) => Promise<Offer>;
  getAllActiveListings: () => Promise<number[]>;
  isListingActive: (listingId: number) => Promise<boolean>;
}

interface GovernanceContract extends Contract {
  propose: (
    targets: string[],
    values: BigNumber[],
    calldatas: string[],
    description: string
  ) => Promise<ContractTransaction>;
  castVote: (proposalId: number, support: number) => Promise<ContractTransaction>;
  castVoteWithReason: (
    proposalId: number,
    support: number,
    reason: string
  ) => Promise<ContractTransaction>;
  execute: (
    targets: string[],
    values: BigNumber[],
    calldatas: string[],
    descriptionHash: string
  ) => Promise<ContractTransaction>;
  cancel: (
    targets: string[],
    values: BigNumber[],
    calldatas: string[],
    descriptionHash: string
  ) => Promise<ContractTransaction>;
  updateGovernanceParameters: (
    newVotingDelay: number,
    newVotingPeriod: number,
    newQuorumPercentage: number,
    newProposalThreshold: number
  ) => Promise<ContractTransaction>;
  withdrawFunds: (token: string, recipient: string, amount: BigNumber) => Promise<ContractTransaction>;
  pause: () => Promise<ContractTransaction>;
  unpause: () => Promise<ContractTransaction>;
  votingDelay: () => Promise<BigNumber>;
  votingPeriod: () => Promise<BigNumber>;
  quorum: (blockNumber: number) => Promise<BigNumber>;
  state: (proposalId: number) => Promise<ProposalState>;
  proposalThreshold: () => Promise<BigNumber>;
  getProposalDetails: (proposalId: number) => Promise<ProposalDetails>;
  getAllActiveProposals: () => Promise<number[]>;
  isVoterEligible: (voter: string) => Promise<boolean>;
}

interface IPAssetTokenContract extends Contract {
  mintAsset: (
    to: string,
    uri: string,
    royaltyFraction: number,
    metadata: AssetMetadata
  ) => Promise<ContractTransaction>;
  burn: (tokenId: number) => Promise<ContractTransaction>;
  transfer: (recipient: string, tokenId: number) => Promise<ContractTransaction>;
  transferFrom: (from: string, to: string, tokenId: number) => Promise<ContractTransaction>;
  approve: (spender: string, tokenId: number) => Promise<ContractTransaction>;
  updateAssetMetadata: (tokenId: number, newMetadata: AssetMetadata) => Promise<ContractTransaction>;
  setIdentityRegistry: (identityRegistry: string) => Promise<ContractTransaction>;
  setCompliance: (compliance: string) => Promise<ContractTransaction>;
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  decimals: () => Promise<number>;
  totalSupply: () => Promise<BigNumber>;
  balanceOf: (account: string) => Promise<BigNumber>;
  ownerOf: (tokenId: number) => Promise<string>;
  getAssetMetadata: (tokenId: number) => Promise<AssetMetadata>;
  tokenURI: (tokenId: number) => Promise<string>;
  royaltyInfo: (tokenId: number, salePrice: BigNumber) => Promise<[string, BigNumber]>;
}

export class SceneCapitalSDK {
  private provider: Provider;
  private signer?: Signer;
  private ipAssetFactory: IPAssetFactoryContract;
  private royaltyManager: RoyaltyManagerContract;
  private marketplace: MarketplaceContract;
  private governance?: GovernanceContract;
  private ipAssetToken?: IPAssetTokenContract;

  constructor(
    provider: Provider,
    signer?: Signer,
    contracts?: {
      ipAssetFactoryAddress?: string;
      royaltyManagerAddress?: string;
      marketplaceAddress?: string;
      governanceAddress?: string;
    }
  ) {
    this.provider = provider;
    this.signer = signer;

    if (contracts?.ipAssetFactoryAddress) {
      this.ipAssetFactory = new ethers.Contract(
        contracts.ipAssetFactoryAddress,
        IPAssetFactoryABI,
        signer || provider
      ) as IPAssetFactoryContract;
    } else {
      throw new Error('IPAssetFactory address is required');
    }

    if (contracts?.royaltyManagerAddress) {
      this.royaltyManager = new ethers.Contract(
        contracts.royaltyManagerAddress,
        RoyaltyManagerABI,
        signer || provider
      ) as RoyaltyManagerContract;
    } else {
      throw new Error('RoyaltyManager address is required');
    }

    if (contracts?.marketplaceAddress) {
      this.marketplace = new ethers.Contract(
        contracts.marketplaceAddress,
        MarketplaceABI,
        signer || provider
      ) as MarketplaceContract;
    } else {
      throw new Error('Marketplace address is required');
    }

    if (contracts?.governanceAddress) {
      this.governance = new ethers.Contract(
        contracts.governanceAddress,
        GovernanceABI,
        signer || provider
      ) as GovernanceContract;
    }
  }

  // IPAssetFactory Methods
  async createIPAsset(
    name: string,
    symbol: string,
    royaltyReceiver: string,
    royaltyPercentage: number,
    metadata: AssetMetadata,
    royaltyShares: RoyaltyShare[]
  ): Promise<{ assetAddress: string; tokenId: number }> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(royaltyReceiver)) throw new Error('Invalid royalty receiver address');
    if (royaltyPercentage > 1000) throw new Error('Royalty percentage cannot exceed 10%');
    if (!name || !symbol) throw new Error('Name and symbol cannot be empty');
    if (!metadata.title || !metadata.assetType) throw new Error('Metadata title and asset type are required');

    const tx = await this.ipAssetFactory.createIPAsset(
      name,
      symbol,
      royaltyReceiver,
      royaltyPercentage,
      metadata,
      royaltyShares
    );

    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'AssetCreated');

    if (!event || !event.args) throw new Error('AssetCreated event not found');

    return {
      assetAddress: event.args.assetAddress,
      tokenId: event.args.tokenId.toNumber()
    };
  }

  async batchCreateIPAssets(
    names: string[],
    symbols: string[],
    royaltyReceivers: string[],
    royaltyPercentages: number[],
    metadatas: AssetMetadata[],
    royaltyShares: RoyaltyShare[][]
  ): Promise<Array<{ assetAddress: string; tokenId: number }>> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (
      names.length !== symbols.length ||
      symbols.length !== royaltyReceivers.length ||
      royaltyReceivers.length !== royaltyPercentages.length ||
      royaltyPercentages.length !== metadatas.length ||
      metadatas.length !== royaltyShares.length
    ) {
      throw new Error('Array lengths must match');
    }

    const tx = await this.ipAssetFactory.batchCreateIPAssets(
      names,
      symbols,
      royaltyReceivers,
      royaltyPercentages,
      metadatas,
      royaltyShares
    );

    const receipt = await tx.wait();
    const events = receipt.events?.filter((e: any) => e.event === 'AssetCreated');

    if (!events) throw new Error('AssetCreated events not found');

    return events.map((event: any) => {
      if (!event.args) throw new Error('Event args not found');
      return {
      assetAddress: event.args.assetAddress,
      tokenId: event.args.tokenId.toNumber()
    });
  }

  async getAllDeployedAssets(): Promise<string[]> {
    return this.ipAssetFactory.getAllDeployedAssets();
  }

  async getAssetDetails(assetAddress: string): Promise<AssetDetails> {
    if (!ethers.utils.isAddress(assetAddress)) throw new Error('Invalid asset address');
    const details = await this.ipAssetFactory.getAssetDetails(assetAddress);
    return { name: details.name, symbol: details.symbol, creator: details.creator, tokenId: details.tokenId };
  }

  async getAssetMetadata(assetAddress: string): Promise<AssetMetadata> {
    if (!ethers.utils.isAddress(assetAddress)) throw new Error('Invalid asset address');
    return this.ipAssetFactory.getAssetMetadata(assetAddress);
  }

  async updateImplementation(newImplementation: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(newImplementation)) throw new Error('Invalid implementation address');
    const tx = await this.ipAssetFactory.updateImplementation(newImplementation);
    await tx.wait();
  }

  async updateIdentityRegistry(newIdentityRegistry: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(newIdentityRegistry)) throw new Error('Invalid identity registry address');
    const tx = await this.ipAssetFactory.updateIdentityRegistry(newIdentityRegistry);
    await tx.wait();
  }

  async updateCompliance(newCompliance: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(newCompliance)) throw new Error('Invalid compliance address');
    const tx = await this.ipAssetFactory.updateCompliance(newCompliance);
    await tx.wait();
  }

  async updateRoyaltyManager(newRoyaltyManager: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(newRoyaltyManager)) throw new Error('Invalid royalty manager address');
    const tx = await this.ipAssetFactory.updateRoyaltyManager(newRoyaltyManager);
    await tx.wait();
  }

  async updateMarketplace(newMarketplace: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(newMarketplace)) throw new Error('Invalid marketplace address');
    const tx = await this.ipAssetFactory.updateMarketplace(newMarketplace);
    await tx.wait();
  }

  async withdrawFactoryFunds(token: string, recipient: string, amount: BigNumber): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(recipient)) throw new Error('Invalid recipient address');
    if (amount.lte(0)) throw new Error('Amount must be greater than 0');
    const tx = await this.ipAssetFactory.withdrawFunds(token, recipient, amount);
    await tx.wait();
  }

  // RoyaltyManager Methods
  async createRoyaltyPool(assetId: number, initialShares: RoyaltyShare[]): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (assetId < 0) throw new Error('Invalid asset ID');
    if (initialShares.length === 0) throw new Error('No payees provided');
    const tx = await this.royaltyManager.createRoyaltyPool(assetId, initialShares);
    await tx.wait();
  }

  async updateRoyaltyShares(assetId: number, newShares: RoyaltyShare[]): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (assetId < 0) throw new Error('Invalid asset ID');
    if (newShares.length === 0) throw new Error('No payees provided');
    const tx = await this.royaltyManager.updateRoyaltyShares(assetId, newShares);
    await tx.wait();
  }

  async distributeRoyalties(assetId: number, token: string, amount: BigNumber): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (assetId < 0) throw new Error('Invalid asset ID');
    if (!ethers.utils.isAddress(token)) throw new Error('Invalid token address');
    if (amount.lte(0)) throw new Error('Amount must be greater than 0');
    const tx = await this.royaltyManager.distributeRoyalties(assetId, token, amount);
    await tx.wait();
  }

  async distributeNativeRoyalties(assetId: number, amount: BigNumber): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (assetId < 0) throw new Error('Invalid asset ID');
    if (amount.lte(0)) throw new Error('Amount must be greater than 0');
    const tx = await this.royaltyManager.distributeNativeRoyalties(assetId, amount, { value: amount });
    await tx.wait();
  }

  async batchDistributeRoyalties(
    assetIds: number[],
    tokens: string[],
    amounts: BigNumber[]
  ): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (
      assetIds.length !== tokens.length ||
      tokens.length !== amounts.length
    ) {
      throw new Error('Array lengths must match');
    }
    const tx = await this.royaltyManager.batchDistributeRoyalties(assetIds, tokens, amounts);
    await tx.wait();
  }

  async addSupportedToken(token: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(token)) throw new Error('Invalid token address');
    const tx = await this.royaltyManager.addSupportedToken(token);
    await tx.wait();
  }

  async removeSupportedToken(token: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(token)) throw new Error('Invalid token address');
    const tx = await this.royaltyManager.removeSupportedToken(token);
    await tx.wait();
  }

  async withdrawRoyaltyFunds(token: string, recipient: string, amount: BigNumber): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(recipient)) throw new Error('Invalid recipient address');
    if (amount.lte(0)) throw new Error('Amount must be greater than 0');
    const tx = await this.royaltyManager.withdrawFunds(token, recipient, amount);
    await tx.wait();
  }

  async getRoyaltyShares(assetId: number, payee: string): Promise<BigNumber> {
    if (assetId < 0) throw new Error('Invalid asset ID');
    if (!ethers.utils.isAddress(payee)) throw new Error('Invalid payee address');
    return this.royaltyManager.getRoyaltyShares(assetId, payee);
  }

  async getRoyaltyPoolInfo(assetId: number): Promise<RoyaltyPoolInfo> {
    if (assetId < 0) throw new Error('Invalid asset ID');
    return this.royaltyManager.getRoyaltyPoolInfo(assetId);
  }

  async getReleasedAmount(assetId: number, payee: string, token: string): Promise<BigNumber> {
    if (assetId < 0) throw new Error('Invalid asset ID');
    if (!ethers.utils.isAddress(payee)) throw new Error('Invalid payee address');
    if (!ethers.utils.isAddress(token)) throw new Error('Invalid token address');
    return this.royaltyManager.getReleasedAmount(assetId, payee, token);
  }

  async getAllRoyaltyPools(): Promise<number[]> {
    return this.royaltyManager.getAllRoyaltyPools();
  }

  async isPoolActive(assetId: number): Promise<boolean> {
    if (assetId < 0) throw new Error('Invalid asset ID');
    return this.royaltyManager.isPoolActive(assetId);
  }

  // Marketplace Methods
  async createListing(
    assetAddress: string,
    tokenId: number,
    price: BigNumber,
    paymentToken: string,
    isERC3643: boolean
  ): Promise<number> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(assetAddress)) throw new Error('Invalid asset address');
    if (tokenId < 0) throw new Error('Invalid token ID');
    if (price.lte(0)) throw new Error('Price must be greater than 0');
    if (!ethers.utils.isAddress(paymentToken) && paymentToken !== ethers.constants.AddressZero) {
      throw new Error('Invalid payment token address');
    }

    const tx = await this.marketplace.createListing(assetAddress, tokenId, paymentToken, price, isERC3643);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'ListingCreated');

    if (!event || !event.args) throw new Error('ListingCreated event not found');

    return event.args.listingId.toNumber();
  }

  async batchCreateListing(
    assetAddresses: string[],
    tokenIds: number[],
    prices: BigNumber[],
    paymentTokens: string[],
    isERC3643s: boolean[]
  ): Promise<number[]> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (
      assetAddresses.length !== tokenIds.length ||
      tokenIds.length !== prices.length ||
      prices.length !== paymentTokens.length ||
      paymentTokens.length !== isERC3643s.length
    ) {
      throw new Error('Array lengths must match');
    }

    const tx = await this.marketplace.batchCreateListing(assetAddresses, tokenIds, paymentTokens, prices, isERC3643s);
    const receipt = await tx.wait();
    const events = receipt.events?.filter((e: any) => e.event === 'ListingCreated');

    if (!events) throw new Error('ListingCreated events not found');

    return events.map((event: any) => event.args.listingId.toNumber());
  }

  async updateListing(listingId: number, newPrice: BigNumber): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (listingId < 0) throw new Error('Invalid listing ID');
    if (newPrice.lte(0)) throw new Error('Price must be greater than 0');
    const tx = await this.marketplace.updateListing(listingId, newPrice);
    await tx.wait();
  }

  async cancelListing(listingId: number): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (listingId < 0) throw new Error('Invalid listing ID');
    const tx = await this.marketplace.cancelListing(listingId);
    await tx.wait();
  }

  async batchCancelListing(listingIds: number[]): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (listingIds.some(id => id < 0)) throw new Error('Invalid listing ID');
    const tx = await this.marketplace.batchCancelListing(listingIds);
    await tx.wait();
  }

  async makeOffer(listingId: number, amount: BigNumber, duration: number): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (listingId < 0) throw new Error('Invalid listing ID');
    if (amount.lte(0)) throw new Error('Amount must be greater than 0');
    if (duration <= 0 || duration > 30 * 24 * 60 * 60) throw new Error('Invalid duration');

    const listing = await this.marketplace.getListingDetails(listingId);
    const isETH = listing.paymentToken === ethers.constants.AddressZero;

    const tx = await this.marketplace.makeOffer(listingId, amount, duration);
    await tx.wait();
  }

  async acceptOffer(listingId: number, buyer: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (listingId < 0) throw new Error('Invalid listing ID');
    if (!ethers.utils.isAddress(buyer)) throw new Error('Invalid buyer address');
    const tx = await this.marketplace.acceptOffer(listingId, buyer);
    await tx.wait();
  }

  async cancelOffer(listingId: number): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (listingId < 0) throw new Error('Invalid listing ID');
    const tx = await this.marketplace.cancelOffer(listingId);
    await tx.wait();
  }

  async buyNow(listingId: number): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (listingId < 0) throw new Error('Invalid listing ID');

    const listing = await this.marketplace.getListingDetails(listingId);
    const isETH = listing.paymentToken === ethers.constants.AddressZero;

    const tx = await this.marketplace.buyNow(listingId);
    await tx.wait();
  }

  async batchBuyNow(listingIds: number[]): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (listingIds.some(id => id < 0)) throw new Error('Invalid listing ID');

    let totalETHRequired = ethers.BigNumber.from(0);
    for (const listingId of listingIds) {
      const listing = await this.marketplace.getListingDetails(listingId);
      if (listing.paymentToken === ethers.constants.AddressZero) {
        totalETHRequired = totalETHRequired.add(listing.price);
      }
    }

    const tx = await this.marketplace.batchBuyNow(listingIds, { value: totalETHRequired });
    await tx.wait();
  }

  async addPaymentToken(token: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(token) && token !== ethers.constants.AddressZero) {
      throw new Error('Invalid token address');
    }
    const tx = await this.marketplace.addPaymentToken(token);
    await tx.wait();
  }

  async removePaymentToken(token: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(token) && token !== ethers.constants.AddressZero) {
      throw new Error('Invalid token address');
    }
    const tx = await this.marketplace.removePaymentToken(token);
    await tx.wait();
  }

  async updatePlatformFee(newFeeRate: number): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (newFeeRate > 1000) throw new Error('Fee rate cannot exceed 10%');
    const tx = await this.marketplace.updatePlatformFee(newFeeRate);
    await tx.wait();
  }

  async updateFeeCollector(newFeeCollector: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(newFeeCollector)) throw new Error('Invalid fee collector address');
    const tx = await this.marketplace.updateFeeCollector(newFeeCollector);
    await tx.wait();
  }

  async setMarketplaceIdentityRegistry(identityRegistry: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(identityRegistry)) throw new Error('Invalid identity registry address');
    const tx = await this.marketplace.setIdentityRegistry(identityRegistry);
    await tx.wait();
  }

  async setMarketplaceCompliance(compliance: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(compliance)) throw new Error('Invalid compliance address');
    const tx = await this.marketplace.setCompliance(compliance);
    await tx.wait();
  }

  async withdrawMarketplaceFunds(token: string, recipient: string, amount: BigNumber): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(recipient)) throw new Error('Invalid recipient address');
    if (amount.lte(0)) throw new Error('Amount must be greater than 0');
    const tx = await this.marketplace.withdrawFunds(token, recipient, amount);
    await tx.wait();
  }

  async getListingDetails(listingId: number): Promise<Listing> {
    if (listingId < 0) throw new Error('Invalid listing ID');
    return this.marketplace.getListingDetails(listingId);
  }

  async getOfferDetails(listingId: number, buyer: string): Promise<Offer> {
    if (listingId < 0) throw new Error('Invalid listing ID');
    if (!ethers.utils.isAddress(buyer)) throw new Error('Invalid buyer address');
    return this.marketplace.getOfferDetails(listingId, buyer);
  }

  async getAllActiveListings(): Promise<number[]> {
    return this.marketplace.getAllActiveListings();
  }

  async isListingActive(listingId: number): Promise<boolean> {
    if (listingId < 0) throw new Error('Invalid listing ID');
    return this.marketplace.isListingActive(listingId);
  }

  // Governance Methods
  async propose(
    targets: string[],
    values: BigNumber[],
    calldatas: string[],
    description: string
  ): Promise<number> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (
      targets.length !== values.length ||
      values.length !== calldatas.length ||
      targets.length === 0
    ) {
      throw new Error('Invalid proposal parameters');
    }

    const tx = await this.governance.propose(targets, values, calldatas, description);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'ProposalCreated');

    if (!event) throw new Error('ProposalCreated event not found');

    return event.args.proposalId.toNumber();
  }

  async castVote(proposalId: number, support: number): Promise<BigNumber> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (proposalId < 0) throw new Error('Invalid proposal ID');
    if (support < 0 || support > 2) throw new Error('Invalid support value');

    const tx = await this.governance.castVote(proposalId, support);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'VoteCast');

    if (!event || !event.args) throw new Error('VoteCast event not found');

    return event.args.weight;
  }

  async castVoteWithReason(proposalId: number, support: number, reason: string): Promise<BigNumber> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (proposalId < 0) throw new Error('Invalid proposal ID');
    if (support < 0 || support > 2) throw new Error('Invalid support value');

    const tx = await this.governance.castVoteWithReason(proposalId, support, reason);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'VoteCast');

    if (!event || !event.args) throw new Error('VoteCast event not found');

    return event.args.weight;
  }

  async execute(
    targets: string[],
    values: BigNumber[],
    calldatas: string[],
    descriptionHash: string
  ): Promise<number> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (
      targets.length !== values.length ||
      values.length !== calldatas.length ||
      targets.length === 0
    ) {
      throw new Error('Invalid proposal parameters');
    }

    const tx = await this.governance.execute(targets, values, calldatas, descriptionHash);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'ProposalExecuted');

    if (!event || !event.args) throw new Error('ProposalExecuted event not found');

    return event.args.proposalId.toNumber();
  }

  async cancel(
    targets: string[],
    values: BigNumber[],
    calldatas: string[],
    descriptionHash: string
  ): Promise<number> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (
      targets.length !== values.length ||
      values.length !== calldatas.length ||
      targets.length === 0
    ) {
      throw new Error('Invalid proposal parameters');
    }

    const tx = await this.governance.cancel(targets, values, calldatas, descriptionHash);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'ProposalCanceled');

    if (!event || !event.args) throw new Error('ProposalCanceled event not found');

    return event.args.proposalId.toNumber();
  }

  async updateGovernanceParameters(
    newVotingDelay: number,
    newVotingPeriod: number,
    newQuorumPercentage: number,
    newProposalThreshold: number
  ): Promise<void> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (newQuorumPercentage > 100) throw new Error('Quorum percentage too high');
    if (newVotingPeriod <= 0) throw new Error('Invalid voting period');
    if (newProposalThreshold < 0) throw new Error('Invalid proposal threshold');

    const tx = await this.governance.updateGovernanceParameters(
      newVotingDelay,
      newVotingPeriod,
      newQuorumPercentage,
      newProposalThreshold
    );
    await tx.wait();
  }

  async withdrawGovernanceFunds(token: string, recipient: string, amount: BigNumber): Promise<void> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(recipient)) throw new Error('Invalid recipient address');
    if (amount.lte(0)) throw new Error('Amount must be greater than 0');
    const tx = await this.governance.withdrawFunds(token, recipient, amount);
    await tx.wait();
  }

  async pauseGovernance(): Promise<void> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    const tx = await this.governance.pause();
    await tx.wait();
  }

  async unpauseGovernance(): Promise<void> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!this.signer) throw new Error('Signer required for this operation');
    const tx = await this.governance.unpause();
    await tx.wait();
  }

  async getVotingDelay(): Promise<BigNumber> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    return this.governance.votingDelay();
  }

  async getVotingPeriod(): Promise<BigNumber> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    return this.governance.votingPeriod();
  }

  async getQuorum(blockNumber: number): Promise<BigNumber> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (blockNumber < 0) throw new Error('Invalid block number');
    return this.governance.quorum(blockNumber);
  }

  async getProposalState(proposalId: number): Promise<ProposalState> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (proposalId < 0) throw new Error('Invalid proposal ID');
    return this.governance.state(proposalId);
  }

  async getProposalThreshold(): Promise<BigNumber> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    return this.governance.proposalThreshold();
  }

  async getProposalDetails(proposalId: number): Promise<ProposalDetails> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (proposalId < 0) throw new Error('Invalid proposal ID');
    return this.governance.getProposalDetails(proposalId);
  }

  async getAllActiveProposals(): Promise<number[]> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    return this.governance.getAllActiveProposals();
  }

  async isVoterEligible(voter: string): Promise<boolean> {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    if (!ethers.utils.isAddress(voter)) throw new Error('Invalid voter address');
    return this.governance.isVoterEligible(voter);
  }

  // IPAssetToken Methods
  async setIPAssetTokenContract(assetAddress: string): Promise<void> {
    if (!ethers.utils.isAddress(assetAddress)) throw new Error('Invalid asset address');
    this.ipAssetToken = new ethers.Contract(
      assetAddress,
      IPAssetTokenABI,
      this.signer || this.provider
    ) as IPAssetTokenContract;
  }

  async mintAsset(
    to: string,
    uri: string,
    royaltyFraction: number,
    metadata: AssetMetadata
  ): Promise<number> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(to)) throw new Error('Invalid recipient address');
    if (!uri) throw new Error('URI cannot be empty');
    if (royaltyFraction < 0) throw new Error('Invalid royalty fraction');

    const tx = await this.ipAssetToken.mintAsset(to, uri, royaltyFraction, metadata);
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'Mint');

    if (!event || !event.args) throw new Error('Mint event not found');

    return event.args.tokenId.toNumber();
  }

  async burn(tokenId: number): Promise<void> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (tokenId < 0) throw new Error('Invalid token ID');
    const tx = await this.ipAssetToken.burn(tokenId);
    await tx.wait();
  }

  async transfer(recipient: string, tokenId: number): Promise<void> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(recipient)) throw new Error('Invalid recipient address');
    if (tokenId < 0) throw new Error('Invalid token ID');
    const tx = await this.ipAssetToken.transfer(recipient, tokenId);
    await tx.wait();
  }

  async transferFrom(from: string, to: string, tokenId: number): Promise<void> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(from) || !ethers.utils.isAddress(to)) {
      throw new Error('Invalid from or to address');
    }
    if (tokenId < 0) throw new Error('Invalid token ID');
    const tx = await this.ipAssetToken.transferFrom(from, to, tokenId);
    await tx.wait();
  }

  async approve(spender: string, tokenId: number): Promise<void> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(spender)) throw new Error('Invalid spender address');
    if (tokenId < 0) throw new Error('Invalid token ID');
    const tx = await this.ipAssetToken.approve(spender, tokenId);
    await tx.wait();
  }

  async updateAssetMetadata(tokenId: number, newMetadata: AssetMetadata): Promise<void> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (tokenId < 0) throw new Error('Invalid token ID');
    if (!newMetadata.title || !newMetadata.assetType) throw new Error('Metadata title and asset type are required');
    const tx = await this.ipAssetToken.updateAssetMetadata(tokenId, newMetadata);
    await tx.wait();
  }

  async setIPAssetIdentityRegistry(identityRegistry: string): Promise<void> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(identityRegistry)) throw new Error('Invalid identity registry address');
    const tx = await this.ipAssetToken.setIdentityRegistry(identityRegistry);
    await tx.wait();
  }

  async setIPAssetCompliance(compliance: string): Promise<void> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(compliance)) throw new Error('Invalid compliance address');
    const tx = await this.ipAssetToken.setCompliance(compliance);
    await tx.wait();
  }

  async getIPAssetName(): Promise<string> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    return this.ipAssetToken.name();
  }

  async getIPAssetSymbol(): Promise<string> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    return this.ipAssetToken.symbol();
  }

  async getIPAssetDecimals(): Promise<number> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    return this.ipAssetToken.decimals();
  }

  async getIPAssetTotalSupply(): Promise<BigNumber> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    return this.ipAssetToken.totalSupply();
  }

  async getIPAssetBalanceOf(account: string): Promise<BigNumber> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (!ethers.utils.isAddress(account)) throw new Error('Invalid account address');
    return this.ipAssetToken.balanceOf(account);
  }

  async getIPAssetOwnerOf(tokenId: number): Promise<string> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (tokenId < 0) throw new Error('Invalid token ID');
    return this.ipAssetToken.ownerOf(tokenId);
  }

  async getIPAssetMetadata(tokenId: number): Promise<AssetMetadata> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (tokenId < 0) throw new Error('Invalid token ID');
    return this.ipAssetToken.getAssetMetadata(tokenId);
  }

  async getIPAssetTokenURI(tokenId: number): Promise<string> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (tokenId < 0) throw new Error('Invalid token ID');
    return this.ipAssetToken.tokenURI(tokenId);
  }

  async getIPAssetRoyaltyInfo(tokenId: number, salePrice: BigNumber): Promise<{ receiver: string; royaltyAmount: BigNumber }> {
    if (!this.ipAssetToken) throw new Error('IPAssetToken contract not initialized');
    if (tokenId < 0) throw new Error('Invalid token ID');
    if (salePrice.lte(0)) throw new Error('Invalid sale price');
    const [receiver, royaltyAmount] = await this.ipAssetToken.royaltyInfo(tokenId, salePrice);
    return { receiver, royaltyAmount };
  }

  // Utility Methods
  async isAssetCompatible(assetAddress: string): Promise<boolean> {
    if (!ethers.utils.isAddress(assetAddress)) throw new Error('Invalid asset address');
    return this.ipAssetFactory.isAssetCompatible(assetAddress);
  }

  async isVerifiedUser(userAddress: string): Promise<boolean> {
    if (!ethers.utils.isAddress(userAddress)) throw new Error('Invalid user address');
    const identityRegistryAddress = await this.ipAssetFactory.identityRegistry();
    const registry = new ethers.Contract(
      identityRegistryAddress,
      IdentityRegistryABI,
      this.provider
    );
    return registry.isVerified(userAddress);
  }

  async registerIdentity(userAddress: string, identity: string): Promise<void> {
    if (!this.signer) throw new Error('Signer required for this operation');
    if (!ethers.utils.isAddress(userAddress)) throw new Error('Invalid user address');
    if (!identity) throw new Error('Identity cannot be empty');
    const identityRegistryAddress = await this.ipAssetFactory.identityRegistry();
    const registry = new ethers.Contract(
      identityRegistryAddress,
      IdentityRegistryABI,
      this.signer
    );
    const tx = await registry.registerIdentity(userAddress, ethers.utils.formatBytes32String(identity));
    await tx.wait();
  }

  // Event Listeners
  listenForAssetCreated(
    callback: (assetAddress: string, name: string, symbol: string, creator: string, tokenId: number) => void
  ): () => void {
    const filter = this.ipAssetFactory.filters.AssetCreated();
    this.ipAssetFactory.on(filter, (assetAddress, name, symbol, creator, tokenId) => {
      callback(assetAddress, name, symbol, creator, tokenId.toNumber());
    });
    return () => this.ipAssetFactory.removeAllListeners(filter);
  }

  listenForRoyaltyDistributed(
    callback: (assetId: number, token: string, amount: BigNumber) => void
  ): () => void {
    const filter = this.royaltyManager.filters.RoyaltyDistributed();
    this.royaltyManager.on(filter, (assetId, token, amount) => {
      callback(assetId.toNumber(), token, amount);
    });
    return () => this.royaltyManager.removeAllListeners(filter);
  }

  listenForSale(
    callback: (listingId: number, seller: string, buyer: string, price: BigNumber, paymentToken: string) => void
  ): () => void {
    const filter = this.marketplace.filters.Sale();
    this.marketplace.on(filter, (listingId, seller, buyer, price, paymentToken) => {
      callback(listingId.toNumber(), seller, buyer, price, paymentToken);
    });
    return () => this.marketplace.removeAllListeners(filter);
  }

  listenForProposalCreated(
    callback: (proposalId: number, proposer: string, targets: string[], values: BigNumber[], description: string) => void
  ): () => void {
    if (!this.governance) throw new Error('Governance contract not initialized');
    if (!this.governance.filters) throw new Error('Governance filters not available');
    const filter = this.governance.filters.ProposalCreated();
    this.governance.on(filter, (proposalId, proposer, targets, values, description) => {
      callback(proposalId.toNumber(), proposer, targets, values, description);
    });
    return () => this.governance.removeAllListeners(filter);
  }
}