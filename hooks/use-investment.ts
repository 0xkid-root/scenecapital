"use client";

import { useState, useEffect } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { formatEther, formatUnits, parseEther, parseUnits } from 'viem';
import { ethers } from 'ethers';
import { InvestmentPoolABI, INVESTMENT_POOL_ADDRESSES } from '../src/contracts/investment-pool';

// Investment interface
export interface Investment {
  id: string;
  name: string;
  description: string;
  totalFunding: string;
  currentFunding: string;
  minInvestment: string;
  apy: number;
  duration: string;
  durationDays: number;
  isActive: boolean;
  paymentToken: string;
  createdAt: string;
  percentageFunded: number;
  category: string; // Added category property
}

// User Investment interface
export interface UserInvestment {
  id: string;
  investmentId: string;
  amount: string;
  timestamp: string;
  maturityDate: string;
  isActive: boolean;
  rewardsClaimed: boolean;
  timeRemaining: string;
  estimatedReward: string;
}

export function useInvestment() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // State variables
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const [isInvestmentsLoading, setIsInvestmentsLoading] = useState(false);
  const [isUserInvestmentsLoading, setIsUserInvestmentsLoading] = useState(false);
  const [investmentsError, setInvestmentsError] = useState<Error | null>(null);
  const [userInvestmentsError, setUserInvestmentsError] = useState<Error | null>(null);
  const [supportedTokens, setSupportedTokens] = useState<string[]>([]);
  const [isSupportedTokensLoading, setIsSupportedTokensLoading] = useState(false);
  const [supportedTokensError, setSupportedTokensError] = useState<Error | null>(null);
  const [isInvesting, setIsInvesting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);

  // Get contract address based on current chain
  const getContractAddress = (): `0x${string}` | null => {
    return INVESTMENT_POOL_ADDRESSES[chainId] || null;
  };

  // Format duration from seconds to human-readable format
  const formatDuration = (durationInSeconds: bigint): { formatted: string, days: number } => {
    const seconds = Number(durationInSeconds);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    
    let formatted = '';
    if (days > 0) {
      formatted += `${days} day${days !== 1 ? 's' : ''}`;
    }
    if (hours > 0 || days === 0) {
      if (days > 0) formatted += ' ';
      formatted += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    return { formatted, days };
  };

  // Format time remaining
  const formatTimeRemaining = (maturityTimestamp: bigint): string => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (maturityTimestamp <= now) return 'Matured';
    
    const remainingSeconds = Number(maturityTimestamp - now);
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    }
    return `${hours}h remaining`;
  };

  // Calculate estimated rewards
  const calculateRewards = (amount: bigint, apy: bigint, duration: bigint): bigint => {
    // APY is in basis points (1% = 100)
    // Convert to decimal by dividing by 10000
    // Calculate rewards: amount * (apy / 10000) * (duration / 365 days)
    const yearInSeconds = BigInt(365 * 24 * 60 * 60);
    return (amount * apy * duration) / (BigInt(10000) * yearInSeconds);
  };

  // Fetch available investments
  const fetchInvestments = async () => {
    if (!publicClient) return;

    const contractAddress = getContractAddress();
    if (!contractAddress) {
      setInvestmentsError(new Error('Contract not deployed on this network'));
      return;
    }

    setIsInvestmentsLoading(true);
    setInvestmentsError(null);

    try {
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: InvestmentPoolABI,
        functionName: 'getAvailableInvestments',
      });

      const formattedInvestments = (result as any[]).map((investment) => {
        const durationInfo = formatDuration(investment.duration);
        const totalFundingEther = formatEther(investment.totalFunding);
        const currentFundingEther = formatEther(investment.currentFunding);
        const minInvestmentEther = formatEther(investment.minInvestment);
        const percentageFunded = Number(investment.currentFunding) * 100 / Number(investment.totalFunding);

        return {
          id: investment.id.toString(),
          name: investment.name,
          description: investment.description,
          totalFunding: totalFundingEther,
          currentFunding: currentFundingEther,
          minInvestment: minInvestmentEther,
          apy: Number(investment.apy) / 100, // Convert basis points to percentage
          duration: durationInfo.formatted,
          durationDays: durationInfo.days,
          isActive: investment.isActive,
          paymentToken: investment.paymentToken,
          createdAt: new Date(Number(investment.createdAt) * 1000).toLocaleDateString(),
          percentageFunded: percentageFunded,
          // Assign a category based on investment ID for demo purposes
          category: ['film', 'music', 'gaming'][Number(investment.id) % 3]
        };
      });

      setInvestments(formattedInvestments);
    } catch (error) {
      console.error('Error fetching investments:', error);
      setInvestmentsError(error instanceof Error ? error : new Error('Failed to fetch investments'));
    } finally {
      setIsInvestmentsLoading(false);
    }
  };

  // Fetch user investments
  const fetchUserInvestments = async () => {
    if (!publicClient || !address || !isConnected) return;

    const contractAddress = getContractAddress();
    if (!contractAddress) {
      setUserInvestmentsError(new Error('Contract not deployed on this network'));
      return;
    }

    setIsUserInvestmentsLoading(true);
    setUserInvestmentsError(null);

    try {
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: InvestmentPoolABI,
        functionName: 'getUserInvestments',
        args: [address],
      });

      const formattedUserInvestments = await Promise.all((result as any[]).map(async (investment) => {
        // Get investment details to calculate rewards
        const investmentDetails = await publicClient.readContract({
          address: contractAddress,
          abi: InvestmentPoolABI,
          functionName: 'getInvestmentDetails',
          args: [investment.investmentId],
        });

        const estimatedReward = calculateRewards(
          investment.amount,
          (investmentDetails as any).apy,
          (investmentDetails as any).duration
        );

        return {
          id: `${investment.investmentId.toString()}-${address}`,
          investmentId: investment.investmentId.toString(),
          amount: formatEther(investment.amount),
          timestamp: new Date(Number(investment.timestamp) * 1000).toLocaleDateString(),
          maturityDate: new Date(Number(investment.maturityDate) * 1000).toLocaleDateString(),
          isActive: investment.isActive,
          rewardsClaimed: investment.rewardsClaimed,
          timeRemaining: formatTimeRemaining(investment.maturityDate),
          estimatedReward: formatEther(estimatedReward)
        };
      }));

      setUserInvestments(formattedUserInvestments);
    } catch (error) {
      console.error('Error fetching user investments:', error);
      setUserInvestmentsError(error instanceof Error ? error : new Error('Failed to fetch user investments'));
    } finally {
      setIsUserInvestmentsLoading(false);
    }
  };

  // Fetch supported tokens
  const fetchSupportedTokens = async () => {
    if (!publicClient) return;

    const contractAddress = getContractAddress();
    if (!contractAddress) {
      setSupportedTokensError(new Error('Contract not deployed on this network'));
      return;
    }

    setIsSupportedTokensLoading(true);
    setSupportedTokensError(null);

    try {
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: InvestmentPoolABI,
        functionName: 'getSupportedTokens',
      });

      setSupportedTokens(result as string[]);
    } catch (error) {
      console.error('Error fetching supported tokens:', error);
      setSupportedTokensError(error instanceof Error ? error : new Error('Failed to fetch supported tokens'));
    } finally {
      setIsSupportedTokensLoading(false);
    }
  };

  // Invest in an opportunity
  const invest = async (investmentId: string, amount: string, isNativeCurrency: boolean = false) => {
    if (!walletClient || !address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    const contractAddress = getContractAddress();
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }

    setIsInvesting(true);

    try {
      const amountBigInt = parseEther(amount);
      
      // Get investment details to check if it's a native currency investment
      const investmentDetails = await publicClient?.readContract({
        address: contractAddress,
        abi: InvestmentPoolABI,
        functionName: 'getInvestmentDetails',
        args: [BigInt(investmentId)],
      });
      
      // Check if it's a native currency investment
      const isNative = isNativeCurrency || (investmentDetails as any).paymentToken === ethers.constants.AddressZero;
      
      // If it's an ERC20 token, we need to approve the contract first
      if (!isNative) {
        const tokenAddress = (investmentDetails as any).paymentToken;
        
        // Approve the contract to spend tokens
        const erc20ABI = [
          'function approve(address spender, uint256 amount) returns (bool)',
          'function allowance(address owner, address spender) view returns (uint256)',
        ];
        
        // Check current allowance
        const allowanceResult = await publicClient?.readContract({
          address: tokenAddress,
          abi: erc20ABI,
          functionName: 'allowance',
          args: [address, contractAddress],
        });
        
        // If allowance is less than amount, approve
        const allowance = allowanceResult as bigint || BigInt(0);
        if (allowance < amountBigInt) {
          const approveTx = await walletClient.writeContract({
            address: tokenAddress,
            abi: erc20ABI,
            functionName: 'approve',
            args: [contractAddress, amountBigInt],
          });
          
          // Wait for approval transaction to be mined
          const approvalReceipt = await publicClient?.waitForTransactionReceipt({ hash: approveTx });
          if (approvalReceipt && approvalReceipt.status !== 'success') {
            throw new Error('Token approval failed');
          }
        }
      }
      
      // Prepare transaction options
      const options: { value?: bigint } = {};
      if (isNative) {
        options.value = amountBigInt;
      }
      
      // Invest
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: InvestmentPoolABI,
        functionName: 'invest',
        args: [BigInt(investmentId), amountBigInt],
        ...options,
      });
      
      // Wait for transaction to be mined
      if (!publicClient) {
        throw new Error('Public client is not available');
      }
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status !== 'success') {
        throw new Error('Investment transaction failed');
      }
      
      // Refresh data
      await Promise.all([fetchInvestments(), fetchUserInvestments()]);
      
      return receipt;
    } catch (error) {
      console.error('Error investing:', error);
      throw error;
    } finally {
      setIsInvesting(false);
    }
  };

  // Withdraw an investment
  const withdrawInvestment = async (investmentId: string) => {
    if (!walletClient || !address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    const contractAddress = getContractAddress();
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }

    setIsWithdrawing(true);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: InvestmentPoolABI,
        functionName: 'withdrawInvestment',
        args: [BigInt(investmentId)],
      });
      
      // Wait for transaction to be mined
      if (!publicClient) {
        throw new Error('Public client is not available');
      }
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status !== 'success') {
        throw new Error('Withdrawal transaction failed');
      }
      
      // Refresh data
      await Promise.all([fetchInvestments(), fetchUserInvestments()]);
      
      return receipt;
    } catch (error) {
      console.error('Error withdrawing investment:', error);
      throw error;
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Claim rewards
  const claimRewards = async (investmentId: string) => {
    if (!walletClient || !address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    const contractAddress = getContractAddress();
    if (!contractAddress) {
      throw new Error('Contract not deployed on this network');
    }

    setIsClaimingRewards(true);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: InvestmentPoolABI,
        functionName: 'claimRewards',
        args: [BigInt(investmentId)],
      });
      
      // Wait for transaction to be mined
      if (!publicClient) {
        throw new Error('Public client is not available');
      }
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status !== 'success') {
        throw new Error('Claim rewards transaction failed');
      }
      
      // Refresh data
      await fetchUserInvestments();
      
      return receipt;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      throw error;
    } finally {
      setIsClaimingRewards(false);
    }
  };

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    if (isConnected && publicClient) {
      fetchInvestments();
      fetchSupportedTokens();
    }
  }, [isConnected, publicClient, chainId]);

  // Fetch user investments when address changes
  useEffect(() => {
    if (isConnected && publicClient && address) {
      fetchUserInvestments();
    }
  }, [isConnected, publicClient, address, chainId]);

  return {
    // Data
    investments,
    userInvestments,
    supportedTokens,
    
    // Loading states
    isInvestmentsLoading,
    isUserInvestmentsLoading,
    isSupportedTokensLoading,
    isInvesting,
    isWithdrawing,
    isClaimingRewards,
    
    // Errors
    investmentsError,
    userInvestmentsError,
    supportedTokensError,
    
    // Actions
    invest,
    withdrawInvestment,
    claimRewards,
    
    // Refresh functions
    refreshInvestments: fetchInvestments,
    refreshUserInvestments: fetchUserInvestments,
    refreshSupportedTokens: fetchSupportedTokens,
  };
}
