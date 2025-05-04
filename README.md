

# Scene Capital 🎬

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://scenecapital.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/0xkid-root/scenecapital)
[![Network](https://img.shields.io/badge/Network-Pharos%20Testnet-purple)](https://pharos-testnet.caldera.xyz/)

> A Web3 platform revolutionizing IP licensing and ownership on the Pharos Network

## 🚀 Project Summary

Scene Capital is designed for the Pharos Blockchain Hackathon, leveraging the Pharos Network to transform intellectual property (IP) management. Through fractional IP ownership and automated royalty distribution via smart contracts, we're building a decentralized ecosystem connecting creators, investors, and fans.

## 🎯 Hackathon Objectives

- 🔄 Showcase Pharos Network's scalability and security for IP tokenization
- 🎨 Deliver a user-friendly platform for tokenized IP asset management
- 💰 Implement automated, decentralized royalty distribution

## ✨ Core Features

- 🎨 **Fractional IP Ownership** — Buy fractional shares of creative IP
- 🔗 **Transparent Licensing** — Trustless agreements, verified on-chain
- 💸 **Automated Royalties** — Fair payments through smart contracts
- 🤝 **Direct Connections** — Eliminate intermediaries
- 🔐 **Pharos Integration** — Secured on Pharos Testnet

## 👥 Target Users

| User Type | Description |
|-----------|-------------|
| Creators | Artists, musicians, filmmakers, writers |
| Investors | Individuals and institutions exploring IP assets |
| Licensees | Businesses seeking content licensing |
| Fans | Supporters backing favorite creators |

## 🛠 Technical Architecture

### Frontend
- ⚛️ Framework: Next.js 13 (App Router)
- 📝 Language: TypeScript
- 🎨 Styling: Tailwind CSS
- ✨ Animation: Framer Motion
- 🎯 UI Library: Shadcn/ui
- 🔄 State: React Hooks, Context API

### Backend
- 🔌 API: Next.js RESTful Routes
- 🗄️ Database: MongoDB Atlas
- 🔑 Auth: JWT + Cookie storage
- ✅ Validation: Express-validator

### Blockchain Integration
```json
{
  "chainId": "0xC352",
  "chainName": "Pharos Testnet",
  "nativeCurrency": {
    "name": "Pharos",
    "symbol": "pharos",
    "decimals": 18
  },
  "rpcUrls": ["https://pharos-testnet.rpc.caldera.xyz/http"],
  "blockExplorerUrls": ["https://pharos-testnet.caldera.xyz/"]
}
```

### Deployment
- 🌐 Frontend/API: Vercel
- 📊 Smart Contracts: Pharos Testnet
- 💾 Database: MongoDB Atlas

## 📊 Platform Features

### Investor Dashboard
- 💰 Track portfolio value ($50,000+)
- 📈 View performance metrics (+10% gain/month)
- 📊 Asset distribution & ROI visualization
- 🔍 Transaction history

### Creator Dashboard
- 🎨 Project creation & tracking
- 📊 Funding progress monitoring
- 🔄 IP tokenization management

### Order Management
- 📈 Market/Limit orders
- 🔄 Status tracking
- ✅ Transaction verification

### Licensing System
- 📝 Smart agreement creation
- 💰 Royalty management
- 🌍 Territory definition
- 📊 Status monitoring

## 🔒 Security Features

- 👛 Wallet: Secure MetaMask integration
- 🔐 Data: Encrypted storage
- ✅ Smart Contracts: Audited with fail-safes

## 🚀 Getting Started

```bash
# Clone repository
git clone https://github.com/0xkid-root/scenecapital.git
cd scenecapital

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Configure Pharos RPC and MongoDB URI

# Development
npm run dev

# Production
npm run build
npm run start
```

## ⚡ Pharos Network Benefits

- 🚀 **Scalability**: High-volume IP transaction handling
- 🔒 **Security**: Tamper-proof contract execution
- ⚡ **Speed**: Fast confirmations for real-time operations

## 🏆 Hackathon Deliverables

- ✅ [Live Demo](https://scenecapital.vercel.app)
- ✅ [Source Code](https://github.com/0xkid-root/scenecapital)
- ✅ Contracts on Pharos Testnet
- ✅ Pitch Deck
