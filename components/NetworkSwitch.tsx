"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Network } from 'lucide-react';

const PHAROS_DEVNET_CHAIN_ID = '0xC352'; // 50002 in hex
const PHAROS_NETWORK = {
  chainId: PHAROS_DEVNET_CHAIN_ID,
  chainName: 'Pharos Devnet',
  rpcUrls: ['https://devnet.dplabs-internal.com'],
  nativeCurrency: { 
    name: 'Pharos', 
    symbol: 'pharos', 
    decimals: 18 
  },
  blockExplorerUrls: ['https://pharosscan.xyz']
};

export function NetworkSwitch() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPharosNetwork = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // First try to switch to the network if it exists
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: PHAROS_DEVNET_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [PHAROS_NETWORK],
          });
        } catch (addError: any) {
          setError(addError.message);
        }
      } else {
        setError(switchError.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      onClick={addPharosNetwork}
      disabled={isConnecting}
      variant="outline"
      size="sm"
      className="ml-4 bg-navy-800 border-navy-700 hover:bg-navy-700 text-white"
    >
      <Network className="w-4 h-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'pharos testnet'}
      {error && (
        <span className="text-red-500 text-xs ml-2">{error}</span>
      )}
    </Button>
  );
} 