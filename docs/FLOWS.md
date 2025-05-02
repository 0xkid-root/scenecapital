# Scene Capital - User Flow Documentation

## Investor Flow

### 1. Landing Page to Investment
1. **Initial Landing**
   - User arrives at Scene Capital homepage
   - Views project overview and features
   - Clicks "Invest in IP" button

2. **Wallet Connection**
   - WalletConnectModal appears with Scene.Capital branding
   - User prompted to connect MetaMask
   - System checks for MetaMask installation
   - If not installed, shows installation prompt
   - If installed, requests wallet connection

3. **Network Configuration**
   - Automatic detection of current network
   - If not on Pharos Network:
     - Prompts to add Pharos Network
     - Configures network parameters:
       ```javascript
       {
         chainId: "0xC352",
         chainName: "Pharos Testnet",
         nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }
       }
       ```
   - Handles network switching errors

4. **Dashboard Access**
   - Automatic redirect to `/dashboard?tab=investor`
   - Displays portfolio overview
   - Shows current IP Portfolio Value
   - Presents investment opportunities

### 2. Investment Dashboard Features

1. **Portfolio Overview**
   - Total portfolio value display
   - Performance metrics
   - ROI calculations
   - Asset distribution chart

2. **Investment Opportunities**
   - Curated IP projects listing
   - Filtering and sorting options
   - Detailed project information
   - Investment terms and conditions

3. **Transaction Management**
   - Investment history
   - Pending transactions
   - Transaction status tracking
   - Gas fee estimates

4. **Asset Management**
   - Tokenized IP holdings
   - Token transfer capabilities
   - Secondary market access
   - Portfolio rebalancing tools

### 3. Investment Process

1. **Project Selection**
   - Browse available projects
   - View detailed metrics:
     - Expected returns
     - Project timeline
     - Team information
     - Market analysis

2. **Due Diligence**
   - Access to project documentation
   - Legal verification status
   - Team credentials
   - Market potential analysis

3. **Investment Execution**
   - Select investment amount
   - Review terms and conditions
   - Confirm transaction details
   - Sign transaction with MetaMask

4. **Post-Investment**
   - Receive confirmation
   - View token allocation
   - Access project updates
   - Monitor performance

## Creator Flow

### 1. Project Submission

1. **Initial Access**
   - Click "Submit Your Project" on landing page
   - Connect wallet through WalletConnectModal
   - Redirect to creator dashboard

2. **Project Setup**
   - Fill basic information:
     - Project title
     - Category selection
     - Description
     - Team information

3. **Asset Upload**
   - Creative content upload
   - Documentation submission
   - Preview functionality
   - Version control

4. **Terms Configuration**
   - Set ownership structure
   - Define licensing terms
   - Configure royalty splits
   - Set investment parameters

### 2. Creator Dashboard Features

1. **Project Management**
   ```typescript
   interface ProjectManagement {
     status: 'draft' | 'pending' | 'active' | 'funded';
     fundingProgress: number;
     totalInvestors: number;
     currentValuation: number;
   }
   ```

2. **Revenue Tracking**
   - Real-time royalty monitoring
   - Payment history
   - Revenue projections
   - Distribution logs

3. **Licensing Control**
   - Active licenses overview
   - License request management
   - Terms modification
   - Usage tracking

4. **Investor Relations**
   - Investor communications
   - Update broadcasting
   - Q&A management
   - Voting system

### 3. IP Tokenization Process

1. **Verification Stage**
   - Legal documentation review
   - Ownership verification
   - Compliance checking
   - Terms validation

2. **Smart Contract Deployment**
   ```solidity
   contract IPToken {
     string public projectName;
     uint256 public totalSupply;
     mapping(address => uint256) public balances;
     mapping(address => uint256) public royaltyShares;
   }
   ```

3. **Token Distribution**
   - Initial token allocation
   - Vesting schedules
   - Lock-up periods
   - Reserve management

4. **Market Activation**
   - Secondary market listing
   - Price discovery mechanism
   - Trading parameters
   - Liquidity provision

### 4. Revenue Management

1. **Royalty Collection**
   - Automated collection
   - Multi-currency support
   - Payment verification
   - Distribution triggers

2. **Distribution System**
   - Smart contract automation
   - Token holder payments
   - Fee calculations
   - Tax reporting

3. **Financial Reporting**
   - Revenue analytics
   - Performance metrics
   - Tax documentation
   - Audit trails

4. **Treasury Management**
   - Fund allocation
   - Reserve management
   - Investment strategies
   - Risk mitigation

## Security Considerations

1. **Transaction Security**
   - Multi-signature requirements
   - Transaction limits
   - Cooling periods
   - Fraud detection

2. **Data Protection**
   - Encrypted storage
   - Access controls
   - Audit logging
   - Backup systems

3. **Smart Contract Safety**
   - Automated testing
   - Security audits
   - Emergency procedures
   - Upgrade mechanisms

## Error Handling

1. **Connection Issues**
   ```typescript
   try {
     // Wallet connection logic
   } catch (error) {
     if (error.code === 4001) {
       // User rejected request
     } else if (error.code === 4902) {
       // Network configuration error
     }
   }
   ```

2. **Transaction Failures**
   - Retry mechanisms
   - Error notifications
   - Recovery procedures
   - Support contact

3. **Network Issues**
   - Automatic reconnection
   - State persistence
   - Fallback options
   - Status updates 