"use client";

import { useState } from 'react';
import { useInvestment } from '../../hooks/use-investment';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { LoadingState } from '../ui/loading-state';
import { ErrorFallback } from '../ui/error-fallback';
import { Badge } from '../ui/badge';
import { Clock, Coins, ArrowDownCircle, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function UserInvestments() {
  const {
    userInvestments,
    isUserInvestmentsLoading,
    userInvestmentsError,
    withdrawInvestment,
    claimRewards,
    isWithdrawing,
    isClaimingRewards,
    refreshUserInvestments,
  } = useInvestment();

  const [activeTab, setActiveTab] = useState<string>("active");
  const [processingInvestmentId, setProcessingInvestmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filter investments based on active tab
  const filteredInvestments = userInvestments.filter(investment => {
    if (activeTab === "active") return investment.isActive;
    if (activeTab === "matured") return !investment.isActive || investment.timeRemaining === 'Matured';
    return true; // "all" tab
  });

  const handleWithdraw = async (investmentId: string) => {
    setError(null);
    setProcessingInvestmentId(investmentId);
    
    try {
      await withdrawInvestment(investmentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw investment');
    } finally {
      setProcessingInvestmentId(null);
    }
  };

  const handleClaimRewards = async (investmentId: string) => {
    setError(null);
    setProcessingInvestmentId(investmentId);
    
    try {
      await claimRewards(investmentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim rewards');
    } finally {
      setProcessingInvestmentId(null);
    }
  };

  if (isUserInvestmentsLoading) {
    return <LoadingState text="Loading your investments..." />;
  }

  if (userInvestmentsError) {
    return (
      <ErrorFallback
        message={userInvestmentsError.message}
        description="There was an error loading your investments."
        onRetry={refreshUserInvestments}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Investments</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="matured">Matured</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredInvestments.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === "active" 
                  ? "You don't have any active investments." 
                  : activeTab === "matured" 
                    ? "You don't have any matured investments."
                    : "You don't have any investments yet."}
              </p>
              {activeTab === "active" && (
                <Button className="mt-4" variant="outline" onClick={() => window.location.href = '/investments'}>
                  Explore Investment Opportunities
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvestments.map((investment) => {
                const isMatured = investment.timeRemaining === 'Matured';
                const isProcessing = processingInvestmentId === investment.investmentId;
                
                return (
                  <Card key={investment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Investment #{investment.investmentId}</CardTitle>
                        <Badge variant={investment.isActive ? "default" : "secondary"}>
                          {investment.isActive ? "Active" : "Completed"}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {investment.timeRemaining}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Amount Invested</span>
                          <span className="font-medium">{investment.amount} ETH</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Reward</span>
                          <span className="font-medium text-green-600">{investment.estimatedReward} ETH</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Investment Date</span>
                          <span className="font-medium">{investment.timestamp}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Maturity Date</span>
                          <span className="font-medium">{investment.maturityDate}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col space-y-3">
                      {investment.isActive && isMatured && (
                        <>
                          <Button 
                            onClick={() => handleWithdraw(investment.investmentId)}
                            disabled={isProcessing || isWithdrawing}
                            className="w-full"
                          >
                            {isProcessing && isWithdrawing ? (
                              <LoadingState text="Withdrawing..." size="sm" />
                            ) : (
                              <>
                                <ArrowDownCircle className="mr-2 h-4 w-4" />
                                Withdraw Principal
                              </>
                            )}
                          </Button>
                          
                          {!investment.rewardsClaimed && (
                            <Button 
                              onClick={() => handleClaimRewards(investment.investmentId)}
                              disabled={isProcessing || isClaimingRewards}
                              variant="outline"
                              className="w-full"
                            >
                              {isProcessing && isClaimingRewards ? (
                                <LoadingState text="Claiming..." size="sm" />
                              ) : (
                                <>
                                  <Award className="mr-2 h-4 w-4" />
                                  Claim Rewards
                                </>
                              )}
                            </Button>
                          )}
                        </>
                      )}
                      
                      {!investment.isActive && (
                        <div className="text-center py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            This investment has been withdrawn
                          </p>
                        </div>
                      )}
                      
                      {investment.rewardsClaimed && (
                        <div className="text-center py-2 px-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center">
                            <Coins className="mr-2 h-4 w-4" />
                            Rewards claimed
                          </p>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
