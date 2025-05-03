"use client";

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId, usePublicClient } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { Address, Hash } from 'viem';

// ERC20 ABI with just the functions we need
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  }
] as const;

// Simple ERC721 ABI with just the functions we need
const ERC721_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }, { name: 'index', type: 'uint256' }],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  }
] as const;

// Token interface
export interface Token {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  value: string;
  change: string;
  isPositive: boolean;
  logo: string;
  decimals: number;
  address?: Address;
}

// Transaction interface
export interface Transaction {
  id: string;
  hash: Hash;
  type: 'send' | 'receive' | 'swap';
  amount: string;
  token: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  address: string;
  blockNumber?: bigint;
}

// NFT interface
export interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  tokenId: string;
  contractAddress: Address;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

// Price data interface
interface PriceData {
  [symbol: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

// Common ERC20 token addresses (Ethereum mainnet)
const TOKEN_ADDRESSES: Record<string, { address: Address; logo: string; decimals: number }> = {
  USDC: { 
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 
    logo: '/logos/usdc.svg',
    decimals: 6
  },
  USDT: { 
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', 
    logo: '/logos/usdt.svg',
    decimals: 6
  },
  DAI: { 
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', 
    logo: '/logos/dai.svg',
    decimals: 18
  },
  WETH: { 
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 
    logo: '/logos/weth.svg',
    decimals: 18
  },
  SCENE: { 
    address: '0x0000000000000000000000000000000000000000', // Replace with actual token address when available
    logo: '/logos/scene-token.svg',
    decimals: 18
  }
};

export function useBlockchainData() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  
  const [tokens, setTokens] = useState<Token[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isTokensLoading, setIsTokensLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [isNftsLoading, setIsNftsLoading] = useState(true);
  const [tokensError, setTokensError] = useState<Error | null>(null);
  const [transactionsError, setTransactionsError] = useState<Error | null>(null);
  const [nftsError, setNftsError] = useState<Error | null>(null);
  const [priceData, setPriceData] = useState<Record<string, any>>({});

  // Fetch native token balance (ETH, etc.)
  const { data: nativeBalance } = useBalance({
    address,
  });

  // Fetch price data from CoinGecko
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,dai,tether&vs_currencies=usd&include_24hr_change=true'
        );
        
        if (response.ok) {
          const data = await response.json();
          setPriceData({
            ETH: data.ethereum,
            USDC: data['usd-coin'],
            DAI: data.dai,
            USDT: data.tether,
            // Add SCENE token when available
            SCENE: { usd: 1.5, usd_24h_change: 2.3 } // Placeholder until real data is available
          });
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };

    fetchPriceData();
  }, []);

  // Fetch token balances
  useEffect(() => {
    const fetchTokens = async () => {
      if (!isConnected || !address) {
        setTokens([]);
        setIsTokensLoading(false);
        setTokensError(null);
        return;
      }
      
      if (!publicClient) {
        setTokensError(new Error('Public client is not available'));
        setIsTokensLoading(false);
        return;
      }

      setIsTokensLoading(true);
      setTokensError(null);
      
      try {
        const tokenPromises = Object.entries(TOKEN_ADDRESSES).map(async ([symbol, tokenInfo]) => {
          try {
            // Skip tokens with placeholder addresses
            if (tokenInfo.address === '0x0000000000000000000000000000000000000000') {
              return null;
            }
            
            const balance = await publicClient.readContract({
              address: tokenInfo.address,
              abi: ERC20_ABI,
              functionName: 'balanceOf',
              args: [address],
            }) as bigint;
            
            const formattedBalance = formatUnits(balance, tokenInfo.decimals);
            const price = priceData[symbol]?.usd || 0;
            const change = priceData[symbol]?.usd_24h_change || 0;
            const value = (parseFloat(formattedBalance) * price).toFixed(2);
            
            return {
              id: symbol.toLowerCase(),
              name: symbol,
              symbol: symbol,
              balance: parseFloat(formattedBalance).toFixed(
                symbol === 'USDC' || symbol === 'USDT' ? 2 : 4
              ),
              value: value,
              change: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
              isPositive: change >= 0,
              logo: tokenInfo.logo,
              decimals: tokenInfo.decimals,
              address: tokenInfo.address
            } as Token;
          } catch (error) {
            console.error(`Error fetching balance for ${symbol}:`, error);
            return null;
          }
        });

        const tokenResults = await Promise.all(tokenPromises);
        const validTokens = tokenResults.filter(token => token !== null) as Token[];
        
        // Add native token (ETH, etc.)
        if (nativeBalance) {
          const nativeSymbol = nativeBalance.symbol;
          const nativePrice = priceData[nativeSymbol]?.usd || 0;
          const nativeChange = priceData[nativeSymbol]?.usd_24h_change || 0;
          const formattedBalance = formatEther(nativeBalance.value);
          const value = (parseFloat(formattedBalance) * nativePrice).toFixed(2);
          
          validTokens.unshift({
            id: nativeSymbol.toLowerCase(),
            name: nativeSymbol === 'ETH' ? 'Ethereum' : nativeSymbol,
            symbol: nativeSymbol,
            balance: parseFloat(formattedBalance).toFixed(4),
            value: value,
            change: `${nativeChange >= 0 ? '+' : ''}${nativeChange.toFixed(1)}%`,
            isPositive: nativeChange >= 0,
            logo: `/logos/${nativeSymbol.toLowerCase()}.svg`,
            decimals: 18
          });
        }
        
        setTokens(validTokens);
      } catch (error) {
        console.error('Error fetching token balances:', error);
        setTokensError(error instanceof Error ? error : new Error('Failed to fetch token balances'));
      } finally {
        setIsTokensLoading(false);
      }
    };

    fetchTokens();
  }, [isConnected, address, publicClient, nativeBalance, priceData]);

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected || !address || !publicClient) {
        setTransactions([]);
        setIsTransactionsLoading(false);
        setTransactionsError(null);
        return;
      }

      setIsTransactionsLoading(true);
      setTransactionsError(null);
      
      try {
        // Get the latest block number
        const blockNumber = await publicClient.getBlockNumber();
        
        // Fetch the last 10 blocks for transactions
        const blocksToFetch = 10;
        const startBlock = blockNumber - BigInt(blocksToFetch);
        
        const txPromises = [];
        
        for (let i = 0; i < blocksToFetch; i++) {
          const currentBlock = startBlock + BigInt(i);
          txPromises.push(
            publicClient.getBlock({
              blockNumber: currentBlock,
              includeTransactions: true,
            })
          );
        }
        
        const blocks = await Promise.all(txPromises);
        
        // Filter transactions related to the user's address
        const userTransactions: Transaction[] = [];
        
        blocks.forEach(block => {
          if (!block.transactions) return;
          
          if (Array.isArray(block.transactions)) {
            block.transactions.forEach(tx => {
              if (typeof tx === 'string') return; // Skip if transaction is just a hash
              
              const isSender = tx.from.toLowerCase() === address.toLowerCase();
              const isReceiver = tx.to?.toLowerCase() === address.toLowerCase();
              
              if (isSender || isReceiver) {
                const txType = isSender ? 'send' : 'receive';
                
                userTransactions.push({
                  id: tx.hash,
                  hash: tx.hash,
                  type: txType,
                  amount: formatEther(tx.value),
                  token: 'ETH', // Assuming ETH for now, would need token detection for ERC20
                  timestamp: Number(block.timestamp) * 1000, // Convert to milliseconds
                  status: 'completed',
                  address: isSender ? (tx.to as string) : tx.from,
                  blockNumber: block.number
                });
              }
            });
          }
        });

        // Sort transactions by timestamp (newest first)
        userTransactions.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp);

        setTransactions(userTransactions);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setTransactionsError(error instanceof Error ? error : new Error('Failed to fetch transaction history'));
      } finally {
        setIsTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [isConnected, address, publicClient, chainId]);

  // Fetch NFTs
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!isConnected || !address || !publicClient) {
        setNfts([]);
        setIsNftsLoading(false);
        setNftsError(null);
        return;
      }

      setIsNftsLoading(true);
      setNftsError(null);
      
      try {
        // In a real-world implementation, you would use an NFT indexing API like Alchemy, Moralis, or OpenSea API
        // For this example, we'll use a simplified approach with known NFT contracts
        
        // Sample NFT contract addresses (replace with actual contracts in production)
        const nftContracts = [
          // Example NFT contracts - replace with real ones
          '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', // BAYC
          '0x60e4d786628fea6478f785a6d7e704777c86a7c6', // Mutant Ape Yacht Club
          '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', // Doodles
        ];

        // ERC-721 ABI for NFT metadata
        const ERC721_ABI = [
          {
            inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
            name: 'tokenURI',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'name',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'owner', type: 'address' }, { internalType: 'uint256', name: 'index', type: 'uint256' }],
            name: 'tokenOfOwnerByIndex',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const;

        // Fetch NFTs from each contract
        const nftPromises = nftContracts.map(async (contractAddress) => {
          try {
            // Check if user has any NFTs from this contract
            const balance = await publicClient.readContract({
              address: contractAddress as Address,
              abi: ERC721_ABI,
              functionName: 'balanceOf',
              args: [address],
            }) as bigint;

            if (balance <= BigInt(0)) return [];

            // Get collection name
            const collectionName = await publicClient.readContract({
              address: contractAddress as Address,
              abi: ERC721_ABI,
              functionName: 'name',
              args: [],
            }) as string;

            // Get token IDs owned by the user
            const tokenIdPromises = [];
            for (let i = 0; i < Number(balance) && i < 5; i++) { // Limit to 5 NFTs per collection
              tokenIdPromises.push(
                publicClient.readContract({
                  address: contractAddress as Address,
                  abi: ERC721_ABI,
                  functionName: 'tokenOfOwnerByIndex',
                  args: [address, BigInt(i)],
                }).catch(() => null) // Skip if tokenOfOwnerByIndex is not supported
              );
            }

            const tokenIds = (await Promise.all(tokenIdPromises)).filter(id => id !== null) as bigint[];

            // Create NFT objects
            return tokenIds.map(tokenId => {
              const tokenIdStr = tokenId.toString();
              return {
                id: `${contractAddress}-${tokenIdStr}`,
                name: `${collectionName} #${tokenIdStr}`,
                collection: collectionName,
                // Use placeholder images or IPFS gateway for real metadata
                image: `/images/nfts/placeholder-${Math.floor(Math.random() * 5) + 1}.jpg`,
                tokenId: tokenIdStr,
                contractAddress: contractAddress as Address,
              };
            });
          } catch (error) {
            console.error(`Error fetching NFTs from ${contractAddress}:`, error);
            return [];
          }
        });

        const nftResults = await Promise.all(nftPromises);
        const allNfts = nftResults.flat();
        
        setNfts(allNfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setNftsError(error instanceof Error ? error : new Error('Failed to fetch NFTs'));
      } finally {
        setIsNftsLoading(false);
      }
    };

    fetchNFTs();
  }, [isConnected, address, publicClient]);
  
  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isConnected || !address || !publicClient) {
        setTransactions([]);
        setIsTransactionsLoading(false);
        setTransactionsError(null);
        return;
      }

      setIsTransactionsLoading(true);
      setTransactionsError(null);

      try {
        // Get the latest block number
        const latestBlock = await publicClient.getBlockNumber();
        const startBlock = latestBlock - BigInt(100); // Look back 100 blocks
        const blocksToFetch = 100;
        
        // Prepare promises for fetching blocks
        const txPromises = [];
        
        for (let i = 0; i < blocksToFetch; i++) {
          const currentBlock = startBlock + BigInt(i);
          txPromises.push(
            publicClient.getBlock({
              blockNumber: currentBlock,
              includeTransactions: true,
            })
          );
        }
        
        const blocks = await Promise.all(txPromises);
        
        // Filter transactions related to the user's address
        const userTransactions: Transaction[] = [];
        
        blocks.forEach(block => {
          if (!block.transactions) return;
          
          if (Array.isArray(block.transactions)) {
            block.transactions.forEach(tx => {
              if (typeof tx === 'string') return; // Skip if transaction is just a hash
              
              const isSender = tx.from.toLowerCase() === address.toLowerCase();
              const isReceiver = tx.to?.toLowerCase() === address.toLowerCase();
              
              if (isSender || isReceiver) {
                const txType = isSender ? 'send' : 'receive';
                
                userTransactions.push({
                  id: tx.hash,
                  hash: tx.hash,
                  type: txType,
                  amount: formatEther(tx.value),
                  token: 'ETH', // Assuming ETH for now, would need token detection for ERC20
                  timestamp: Number(block.timestamp) * 1000, // Convert to milliseconds
                  status: 'completed',
                  address: isSender ? (tx.to as string) : tx.from,
                  blockNumber: block.number
                });
              }
            });
          }
        });

        // Sort transactions by timestamp (newest first)
        userTransactions.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp);

        setTransactions(userTransactions);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setTransactionsError(error instanceof Error ? error : new Error('Failed to fetch transaction history'));
      } finally {
        setIsTransactionsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [isConnected, address, publicClient, chainId]);
  
  // Fetch NFTs
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!isConnected || !address || !publicClient) {
        setNfts([]);
        setIsNftsLoading(false);
        setNftsError(null);
        return;
      }

      setIsNftsLoading(true);
      setNftsError(null);
      
      try {
        // In a real-world implementation, you would use an NFT indexing API like Alchemy, Moralis, or OpenSea API
        // For this example, we'll use a few dummy NFT contract addresses
        const nftContractAddresses = [
          '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', // BAYC
          '0x60e4d786628fea6478f785a6d7e704777c86a7c6', // MAYC
          '0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258', // Otherdeed
        ];
        
        const nftPromises = nftContractAddresses.map(async (contractAddress) => {
          try {
            // Get collection name
            let collectionName = "Unknown Collection";
            try {
              const nameResult = await publicClient.readContract({
                address: contractAddress as Address,
                abi: ERC721_ABI,
                functionName: 'name',
              });
              
              if (typeof nameResult === 'string') {
                collectionName = nameResult;
              }
            } catch (error) {
              console.error(`Error fetching collection name for ${contractAddress}:`, error);
            }
            
            // Get user's balance of this NFT
            const balance = await publicClient.readContract({
              address: contractAddress as Address,
              abi: ERC721_ABI,
              functionName: 'balanceOf',
              args: [address],
            });
            
            if (balance === BigInt(0)) {
              return [];
            }

            // Get token IDs owned by the user
            const tokenIdPromises = [];
            for (let i = 0; i < Number(balance) && i < 5; i++) { // Limit to 5 NFTs per collection
              tokenIdPromises.push(
                publicClient.readContract({
                  address: contractAddress as Address,
                  abi: ERC721_ABI,
                  functionName: 'tokenOfOwnerByIndex',
                  args: [address, BigInt(i)],
                }).catch(() => null) // Skip if tokenOfOwnerByIndex is not supported
              );
            }

            const tokenIds = (await Promise.all(tokenIdPromises)).filter(id => id !== null) as bigint[];

            // Create NFT objects
            return tokenIds.map(tokenId => {
              const tokenIdStr = tokenId.toString();
              return {
                id: `${contractAddress}-${tokenIdStr}`,
                name: `${collectionName} #${tokenIdStr}`,
                collection: collectionName,
                // Use placeholder images or IPFS gateway for real metadata
                image: `/images/nfts/placeholder-${Math.floor(Math.random() * 5) + 1}.jpg`,
                tokenId: tokenIdStr,
                contractAddress: contractAddress as Address,
              };
            });
          } catch (error) {
            console.error(`Error fetching NFTs from ${contractAddress}:`, error);
            return [];
          }
        });

        const nftResults = await Promise.all(nftPromises);
        const allNfts = nftResults.flat();
        
        setNfts(allNfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setNftsError(error instanceof Error ? error : new Error('Failed to fetch NFTs'));
      } finally {
        setIsNftsLoading(false);
      }
    };

    fetchNFTs();
  }, [isConnected, address, publicClient, chainId]);

  // Functions to refresh data
  const refreshTokens = () => {
    setIsTokensLoading(true);
    setTokensError(null);
  };
  
  const refreshTransactions = () => {
    setIsTransactionsLoading(true);
    setTransactionsError(null);
  };
  
  const refreshNfts = () => {
    setIsNftsLoading(true);
    setNftsError(null);
  };

  return {
    tokens,
    transactions,
    nfts,
    isTokensLoading,
    isTransactionsLoading,
    isNftsLoading,
    tokensError,
    transactionsError,
    nftsError,
    refreshTokens,
    refreshTransactions,
    refreshNfts
  };
}
