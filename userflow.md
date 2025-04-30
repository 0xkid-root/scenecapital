# Fandora Platform Documentation

## System Overview
Fandora is a blockchain-based investment platform that enables users to invest in various projects using INR tokens. The platform facilitates company registration, project creation, and investment management through smart contracts.

## Core Components

### Smart Contracts
1. *FactoryCore Contract*
   - Manages company registration and project creation
   - Handles company details and status
   - Controls project lifecycle

2. *INR Token Contract*
   - ERC20-compliant stablecoin
   - Manages KYC verification
   - Handles reserve proofs and management

3. *XRC20Project Contract*
   - Project-specific token contract
   - Manages investment tokens
   - Handles dividend distribution

4. *OrderManager Contract*
   - Processes investment orders
   - Manages order lifecycle

5. *Escrow Contract*
   - Handles secure fund transfers
   - Manages transaction settlements

## User Flows

### 1. User Onboarding
mermaid
sequenceDiagram
    User->>Platform: Connect Wallet
    Platform->>Blockchain: Get Signer Address
    Platform->>INR Contract: Check KYC Status
    alt KYC Not Completed
        Platform->>User: Redirect to KYC Flow
        User->>Platform: Submit KYC Documents
        Platform->>INR Contract: Update KYC Status
    end


### 2. Company Registration
mermaid
sequenceDiagram
    Company->>Platform: Submit Registration
    Platform->>FactoryCore: createCompany(name, email, panNumber)
    FactoryCore-->>Platform: CompanyRegistered Event
    Platform->>Company: Display Success


### 3. Project Creation
mermaid
sequenceDiagram
    Company->>Platform: Create Project
    Platform->>FactoryCore: createProject(companyId, params)
    FactoryCore->>XRC20Project: Deploy Project Contract
    XRC20Project-->>FactoryCore: Project Created
    FactoryCore-->>Platform: Project Details


### 4. Investment Process
mermaid
sequenceDiagram
    Investor->>Platform: Select Project
    Platform->>OrderManager: placeOrder(amount)
    OrderManager->>INR Contract: Check Balance
    alt Sufficient Balance
        INR Contract->>Escrow: Transfer Funds
        Escrow-->>OrderManager: Confirm Transfer
        OrderManager-->>Platform: Order Placed
    else Insufficient Balance
        OrderManager-->>Platform: Error Message
    end


## Key Features

### 1. Wallet Integration
- Web3Provider integration for wallet connection
- Signer management for transaction signing
- Address validation and verification

### 2. KYC Management
- Batch KYC status updates
- KYC verification with permit functionality
- Whitelist management

### 3. Token Management
- INR token transfers and approvals
- Balance checking and allowance management
- Project token distribution

### 4. Project Management
- Project creation and configuration
- Token price and supply management
- Dividend distribution system

### 5. Order Processing
- Order placement and tracking
- Transaction status monitoring
- Order finalization and settlement

## Error Handling

### Common Error Scenarios
1. Insufficient Balance
2. KYC Not Completed
3. Invalid Project Parameters
4. Transaction Failures
5. Company Registration Conflicts

### Error Resolution Flow
mermaid
flowchart TD
    A[Error Detected] --> B{Error Type}
    B -->|Balance| C[Check INR Balance]
    B -->|KYC| D[Verify KYC Status]
    B -->|Transaction| E[Check Transaction Status]
    C --> F[Request INR Transfer]
    D --> G[Complete KYC Process]
    E --> H[Retry Transaction]


## Security Considerations

1. *Smart Contract Security*
   - Role-based access control
   - Function parameter validation
   - Event emission for tracking

2. *Transaction Security*
   - Escrow system for fund safety
   - Multi-step verification
   - Cancel delay implementation

3. *User Data Protection*
   - KYC data encryption
   - Secure wallet connection
   - Permission management

## Integration Guidelines

### Web3 Integration
typescript
// Initialize Blockchain instance
const provider = new ethers.providers.Web3Provider(window.ethereum)
const blockchain = new Blockchain(provider)

// Connect wallet
await provider.send("eth_requestAccounts", [])
const signer = provider.getSigner()


### Contract Interaction
typescript
// Company Registration
const result = await blockchain.createCompany(name, email, panNumber)

// Project Creation
const projectTx = await blockchain.createProject(companyId, projectParams)

// Place Investment Order
const orderResult = await blockchain.placeOrder(orderManagerAddress, amount)


## Best Practices

1. *Transaction Management*
   - Always wait for transaction confirmation
   - Implement proper error handling
   - Monitor gas costs

2. *State Management*
   - Keep UI in sync with blockchain state
   - Implement loading states
   - Cache relevant data

3. *User Experience*
   - Clear error messages
   - Transaction progress indicators
   - Confirmation dialogs

## Appendix

### Contract Addresses
- FactoryCore: 0x003bF0CAdFe545aE362056143e1D6106B6cf0876
- INR Token: 0x6c7D24C2a7e18800e31341863fcB37226d900DdF
- XRC20Project Template: 0x0229bde3E77ED7fAf36F79E36DA5f7B7e8754afc
- Order Manager: 0x4A20a98E6B19ce957013c6DCA11E7491dD532A25
- Escrow Template: 0x9F89883d3Ce564f714209daa24F46e6757c15460