import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, base, optimism, arbitrum } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

// Configure supported chains
const chains = [mainnet, sepolia, base, optimism, arbitrum] as const;

// Create wagmi config
export const config = createConfig({
  chains,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});
