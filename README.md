# Scene Capital - IP Licensing & Ownership Platform

Scene Capital is a pioneering Web3 platform that revolutionizes IP licensing and ownership through blockchain technology. The platform connects creators, investors, and fans in a decentralized ecosystem for creative works.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [User Flows](#user-flows)
  - [Investor Flow](#investor-flow)
  - [Creator Flow](#creator-flow)
- [Technical Architecture](#technical-architecture)
- [Smart Contract Integration](#smart-contract-integration)
- [Network Configuration](#network-configuration)

## Overview

Scene Capital enables:
- Fractional ownership of creative IP assets
- Transparent licensing and royalty distribution
- Direct connection between creators and investors
- Automated revenue sharing through smart contracts

## Features

### Core Features
- Web3 wallet integration (MetaMask)
- Pharos Network support
- Real-time portfolio tracking
- Automated royalty distribution
- IP tokenization system
- Marketplace for trading IP tokens

### Dashboard Features
- Portfolio value tracking
- Investment performance metrics
- Project management tools
- Licensing deal management
- Transaction history
- Network switching capability

## User Flows

### Investor Flow

1. **Initial Access**
   - Click "Invest in IP" on landing page
   - Connect MetaMask wallet through modal
   - Automatically redirected to investor dashboard

2. **Wallet Connection**
   - MetaMask connection prompt
   - Pharos Network addition (Chain ID: 0xC352)
   - Wallet address display and copy feature

3. **Investor Dashboard**
   - View portfolio value ($24,563.00)
   - Track investment performance
   - Monitor royalty income
   - View tokenized IP holdings

4. **Investment Process**
   - Browse available IP projects
   - View detailed project information
   - Perform due diligence
   - Make investment through smart contracts
   - Receive tokenized ownership shares

5. **Portfolio Management**
   - Track individual investments
   - Monitor ROI and performance
   - View royalty distributions
   - Trade IP tokens on marketplace

### Creator Flow

1. **Initial Access**
   - Click "Submit Your Project" on landing page
   - Connect MetaMask wallet
   - Redirected to creator dashboard

2. **Project Submission**
   - Fill project details
   - Upload creative assets
   - Set licensing terms
   - Define ownership structure
   - Configure revenue distribution

3. **Creator Dashboard**
   - Project management tools
   - Funding progress tracking
   - Royalty income monitoring
   - Licensing deal management

4. **IP Tokenization Process**
   - Project verification
   - Smart contract deployment
   - Token distribution setup
   - Secondary market configuration

5. **Revenue Management**
   - Track licensing deals
   - Monitor royalty payments
   - Manage token distributions
   - View transaction history

## Technical Architecture

### Frontend Stack
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn/ui Components

### Web3 Integration
- MetaMask Wallet Connection
- Pharos Network Support
- Smart Contract Interaction
- Token Management

### Key Components
1. **WalletConnectModal**
   ```typescript
   - Handles wallet connection
   - Network switching
   - Error handling
   - Redirect management
   ```

2. **NetworkSwitch**
   ```typescript
   - Manages network selection
   - Displays connection status
   - Handles network errors
   ```

3. **Dashboard Layout**
   ```typescript
   - Responsive design
   - Tab-based navigation
   - Portfolio value display
   - Dynamic content loading
   ```

## Smart Contract Integration

### Network Configuration
```javascript
{
  chainId: "0xC352",
  chainName: "Pharos Testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: ["https://pharos-testnet.rpc.caldera.xyz/http"],
  blockExplorerUrls: ["https://pharos-testnet.caldera.xyz/"]
}
```

### Key Smart Contracts
1. **IP Tokenization Contract**
   - Handles token creation
   - Manages ownership rights
   - Controls token transfers

2. **Royalty Distribution Contract**
   - Automated payments
   - Revenue sharing
   - Token holder distributions

3. **Marketplace Contract**
   - Token trading
   - Price discovery
   - Transaction management

## Security Features

1. **Wallet Security**
   - Secure wallet connection
   - Transaction signing
   - Network validation

2. **Data Protection**
   - Encrypted storage
   - Secure API calls
   - Protected user information

3. **Smart Contract Safety**
   - Audited contracts
   - Fail-safe mechanisms
   - Emergency stops

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/your-username/scene-capital.git
cd scene-capital
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Run development server
```bash
npm run dev
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 