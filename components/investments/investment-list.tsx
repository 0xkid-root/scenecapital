"use client";

import { useState } from 'react';
import { useInvestment } from '../../hooks/use-investment';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { LoadingState } from '../ui/loading-state';
import { ErrorFallback } from '../ui/error-fallback';
import { Progress } from '../ui/progress';

interface InvestmentListProps {
  category?: string;
}

export function InvestmentList({ category }: InvestmentListProps = {}) {
  const {
    investments,
    isInvestmentsLoading,
    investmentsError,
    invest,
    isInvesting,
    refreshInvestments,
  } = useInvestment();
  
  // Filter investments by category if specified
  const filteredInvestments = category 
    ? investments.filter(inv => inv.category.toLowerCase() === category.toLowerCase())
    : investments;

  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleInvest = async (investmentId: string) => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setError(null);
    
    try {
      await invest(investmentId, investAmount);
      setInvestAmount('');
      setSelectedInvestment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invest');
    }
  };

  if (isInvestmentsLoading) {
    return <LoadingState text="Loading investment opportunities..." />;
  }

  if (investmentsError) {
    return (
      <ErrorFallback
        message={investmentsError.message}
        description="There was an error loading investment opportunities."
        onRetry={refreshInvestments}
      />
    );
  }

  if (investments.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">No Investment Opportunities</h2>
        <p className="text-gray-500 dark:text-gray-400">
          There are currently no active investment opportunities available.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Investment Opportunities</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map((investment) => (
          <Card key={investment.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{investment.name}</CardTitle>
              <CardDescription>{investment.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">APY</span>
                  <span className="font-medium text-green-600">{investment.apy}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                  <span className="font-medium">{investment.duration}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Min Investment</span>
                  <span className="font-medium">{investment.minInvestment} ETH</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Funding Progress</span>
                    <span>{investment.percentageFunded.toFixed(1)}%</span>
                  </div>
                  <Progress value={investment.percentageFunded} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{investment.currentFunding} ETH</span>
                    <span>{investment.totalFunding} ETH</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-3">
              {selectedInvestment === investment.id ? (
                <>
                  <div className="flex w-full space-x-2">
                    <Input
                      type="number"
                      placeholder={`Min: ${investment.minInvestment} ETH`}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      min={investment.minInvestment}
                      step="0.01"
                    />
                    <Button 
                      onClick={() => handleInvest(investment.id)}
                      disabled={isInvesting}
                    >
                      {isInvesting ? 'Investing...' : 'Confirm'}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedInvestment(null)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setSelectedInvestment(investment.id)}
                  className="w-full"
                  disabled={!investment.isActive}
                >
                  {investment.isActive ? 'Invest Now' : 'Closed'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
