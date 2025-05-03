"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Building, TrendingUp, Calendar, Coins, Clock, ArrowDownCircle, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useInvestment } from "@/hooks/use-investment";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorFallback } from "@/components/ui/error-fallback";

interface Investment {
  id: string;
  name: string;
  amount: number;
  returns: number;
  status: 'active' | 'completed';
  type: 'residential' | 'commercial' | 'retail';
  location: string;
  investmentDate: string;
}

const investments: Investment[] = [
  {
    id: '1',
    name: 'Urban Heights Development',
    amount: 25000,
    returns: 15.4,
    status: 'active',
    type: 'residential',
    location: 'Downtown Metro',
    investmentDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Tech Park Office Complex',
    amount: 15000,
    returns: 12.8,
    status: 'active',
    type: 'commercial',
    location: 'Innovation District',
    investmentDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Retail Plaza',
    amount: 10000,
    returns: 8.5,
    status: 'active',
    type: 'retail',
    location: 'City Center',
    investmentDate: '2024-03-10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export function InvestmentsList() {
  const [activeTab, setActiveTab] = useState<string>("traditional");
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Get blockchain investment data
  const {
    investments: blockchainInvestments,
    userInvestments,
    isInvestmentsLoading,
    isUserInvestmentsLoading,
    investmentsError,
    userInvestmentsError,
    invest,
    withdrawInvestment,
    claimRewards,
    isInvesting,
    isWithdrawing,
    isClaimingRewards,
    refreshInvestments,
    refreshUserInvestments,
  } = useInvestment();
  
  const [processingInvestmentId, setProcessingInvestmentId] = useState<string | null>(null);
  
  const handleInvest = async (investmentId: string) => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setError(null);
    setSelectedInvestment(investmentId);
    
    try {
      await invest(investmentId, investAmount);
      setInvestAmount('');
      setSelectedInvestment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invest');
    }
  };
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your Investments</h3>
      </div>
      
      <Tabs defaultValue="traditional" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="traditional">Traditional IP</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain IP</TabsTrigger>
          <TabsTrigger value="myinvestments">My Investments</TabsTrigger>
        </TabsList>
        
        {/* Traditional IP Investments */}
        <TabsContent value="traditional">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investments.map((investment) => (
              <motion.div 
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-5 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-base">{investment.name}</h4>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Building className="h-3.5 w-3.5 mr-1" />
                        <span>{investment.type} | {investment.location}</span>
                      </div>
                    </div>
                    <Badge variant={investment.status === 'active' ? "default" : "secondary"}>
                      {investment.status === 'active' ? 'Active' : 'Completed'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Investment</p>
                      <p className="font-medium">${investment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Returns</p>
                      <div className="flex items-center">
                        <p className="font-medium text-green-600">{investment.returns}%</p>
                        <TrendingUp className="h-3.5 w-3.5 ml-1 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <p className="font-medium">{new Date(investment.investmentDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        {/* Blockchain IP Investments */}
        <TabsContent value="blockchain">
          {isInvestmentsLoading ? (
            <LoadingState text="Loading investment opportunities..." />
          ) : investmentsError ? (
            <ErrorFallback
              message={investmentsError.message}
              description="There was an error loading investment opportunities."
              onRetry={refreshInvestments}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blockchainInvestments.map((investment) => (
                <Card key={investment.id} className="overflow-hidden">
                  <div className="p-6 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{investment.name}</h3>
                      <Badge>{investment.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{investment.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Funding Progress</span>
                          <span className="font-medium">{investment.percentageFunded}%</span>
                        </div>
                        <Progress value={investment.percentageFunded} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-medium">{investment.totalFunding} ETH</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">APY</p>
                          <div className="flex items-center">
                            <p className="font-medium text-green-600">{investment.apy}%</p>
                            <TrendingUp className="h-3.5 w-3.5 ml-1 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Min. Investment</p>
                          <p className="font-medium">{investment.minInvestment} ETH</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium">{investment.duration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 border-t">
                    {selectedInvestment === investment.id ? (
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={investAmount}
                            onChange={(e) => setInvestAmount(e.target.value)}
                            placeholder={`Min ${investment.minInvestment} ETH`}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleInvest(investment.id)}
                            disabled={isInvesting}
                            size="sm"
                            className="w-full"
                          >
                            {isInvesting ? 'Investing...' : 'Confirm'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedInvestment(null);
                              setInvestAmount('');
                              setError(null);
                            }}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        </div>
                        {error && (
                          <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setSelectedInvestment(investment.id)}
                        className="w-full"
                      >
                        Invest Now
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* My Blockchain Investments */}
        <TabsContent value="myinvestments">
          {isUserInvestmentsLoading ? (
            <LoadingState text="Loading your investments..." />
          ) : userInvestmentsError ? (
            <ErrorFallback
              message={userInvestmentsError.message}
              description="There was an error loading your investments."
              onRetry={refreshUserInvestments}
            />
          ) : userInvestments.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">You don't have any active investments.</p>
              <Button className="mt-4" variant="outline" onClick={() => setActiveTab("blockchain")}>
                Explore Investment Opportunities
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userInvestments.map((investment) => {
                const isMatured = investment.timeRemaining === 'Matured';
                const isProcessing = processingInvestmentId === investment.investmentId;
                
                return (
                  <Card key={investment.id} className="overflow-hidden">
                    <div className="p-6 pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">Investment #{investment.investmentId}</h3>
                        <Badge variant={investment.isActive ? "default" : "secondary"}>
                          {investment.isActive ? "Active" : "Completed"}
                        </Badge>
                      </div>
                      <p className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {investment.timeRemaining}
                      </p>
                      
                      <div className="space-y-3 mt-4">
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
                    </div>
                    
                    <div className="p-4 bg-muted/30 border-t space-y-3">
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
                    </div>
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