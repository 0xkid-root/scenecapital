'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Film, Music, BookOpen, Tv, Users, DollarSign, Calendar, TrendingUp, Wallet, ChevronRight, ArrowUpRight, Share2, Bookmark, FileText, Globe, Award, FileSignature, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';
import type { Project } from '@/types/project';

// Lazy load components
const InvestModal = dynamic(
  () => import('@/components/modals/invest-modal').then(mod => mod.InvestModal),
  {
    loading: () => <div className="animate-pulse h-96 w-full bg-muted rounded-lg" />,
    ssr: false
  }
);

const ProjectStats = dynamic<{
  investors: number;
  returns: number;
  timeline: string;
  minInvestment?: number;
}>(
  () => import('@/components/projects/project-stats').then(mod => mod.default),
  {
    loading: () => <div className="animate-pulse h-48 w-full bg-muted rounded-lg" />
  }
);

const ProjectFeatures = dynamic<{
  features: string[];
}>(
  () => import('@/components/projects/project-features').then(mod => mod.default),
  {
    loading: () => <div className="animate-pulse h-48 w-full bg-muted rounded-lg" />
  }
);

// Mock data - in a real app, this would come from an API
const projectData: Project = {
  id: '1',
  title: 'Cosmic Odyssey',
  description: 'An epic sci-fi film that explores humanity\'s first contact with an advanced alien civilization. This groundbreaking project combines stunning visual effects with a thought-provoking narrative about human potential and cosmic discovery.',
  type: 'film',
  creator: 'Elena Rodriguez',
  location: 'Global Release',
  target: 500000,
  raised: 375000,
  investors: 145,
  returns: 18.5,
  timeline: '18 months',
  minInvestment: 500,
  features: [
    'Award-winning Director',
    'Cutting-edge VFX',
    'Original Soundtrack',
    'Global Distribution Rights',
    'Merchandising Opportunities',
  ],
  tokenDetails: {
    symbol: 'COSM',
    tokenPrice: 50,
    totalSupply: 10000,
    platform: 'Ethereum',
    contractAddress: '0x1234...',
  },
  royaltyStructure: {
    streaming: '5%',
    theatrical: '8%',
    merchandise: '12%',
  },
  images: [
    '/projects/cosmic-odyssey-1.jpg',
    '/projects/cosmic-odyssey-2.jpg',
    '/projects/cosmic-odyssey-3.jpg',
  ],
};

const ProjectPage: FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [kycStatus, setKycStatus] = useState<'pending' | 'completed' | 'none'>('none');
  const [blockchain, setBlockchain] = useState<null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const { toast } = useToast();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  useEffect(() => {
    const initBlockchain = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
      

        try {
      
          setIsConnected(true);
          // Check KYC status
          // This would be implemented in the Blockchain class
          // const status = await bc.checkKYCStatus();
          // setKycStatus(status);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      }
    };

    initBlockchain();

    // Auto-rotate project images
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % projectData.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleInvest = async () => {
    if (!blockchain) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to invest in this project',
        variant: 'destructive',
      });
      return;
    }

    if (kycStatus !== 'completed') {
      toast({
        title: 'KYC Required',
        description: 'Please complete KYC verification before investing',
        variant: 'destructive',
      });
      return;
    }

    setIsInvestModalOpen(true);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className='container mx-auto px-4 py-8 relative overflow-hidden'
    >
      {/* Background gradient elements */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      
      {/* Breadcrumb */}
      <motion.div variants={item} className="mb-6 flex items-center text-sm text-muted-foreground">
        <span>Projects</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{projectData.title}</span>
      </motion.div>
      
      <div className='grid gap-8 lg:grid-cols-12'>
        {/* Main Content */}
        <div className='lg:col-span-8 space-y-6'>
          <Suspense fallback={<div className="animate-pulse h-[400px] w-full bg-muted rounded-lg" />}>
            <div>
              <motion.div variants={item}>
                <div 
                  className='relative h-[500px] rounded-xl overflow-hidden shadow-float'
                  role="region"
                  aria-label="Project image gallery"
                >
                  {/* Image carousel with fade transition */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={projectData.images[activeImage]}
                        alt={`${projectData.title} - view ${activeImage + 1}`}
                        className='w-full h-full object-cover'
                        loading="eager"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Gradient overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10' />
                  
                  {/* Image indicators */}
                  <div 
                    className="absolute bottom-6 right-6 z-20 flex space-x-2"
                    role="tablist"
                    aria-label="Image gallery navigation"
                  >
                    {projectData.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-white w-6' : 'bg-white/50'}`}
                        role="tab"
                        aria-selected={activeImage === idx}
                        aria-label={`View image ${idx + 1}`}
                        tabIndex={activeImage === idx ? 0 : -1}
                      />
                    ))}
                  </div>
                  
                  {/* Project info */}
                  <div className="absolute bottom-6 left-6 z-20 max-w-[80%]">
                    <Badge 
                      variant="outline" 
                      className="glass-card border-none mb-3 px-3 py-1 text-xs uppercase tracking-wider font-semibold"
                    >
                      {projectData.type}
                    </Badge>
                    <h1 className="text-4xl font-bold text-white mb-3 gradient-text">{projectData.title}</h1>
                    <div className="flex items-center text-white/90 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{projectData.location}</span>
                    </div>
                    <div className="flex space-x-3">
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="glass-card p-2 rounded-full"
                        aria-label="Share project"
                      >
                        <Share2 className="h-4 w-4 text-white" />
                        <span className="sr-only">Share project</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="glass-card p-2 rounded-full"
                        aria-label="Bookmark project"
                      >
                        <Bookmark className="h-4 w-4 text-white" />
                        <span className="sr-only">Bookmark project</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <Card className="p-8 glass-card dark:glass-card-dark shadow-float mt-6">
                  <h2 className="text-2xl font-bold mb-4 gradient-text">About this Project</h2>
                  <p className="text-muted-foreground leading-relaxed">{projectData.description}</p>
                  <Suspense fallback={<div className="animate-pulse h-48 w-full bg-muted rounded-lg" />}>
                    <ProjectFeatures features={projectData.features} />
                  </Suspense>
                </Card>
              </motion.div>
            </div>
          </Suspense>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6" aria-label="Project information">
          <motion.div variants={item}>
            <Card className="overflow-hidden gradient-border-card">
              <div className="p-6 relative">
                {/* Decorative elements - aria-hidden to hide from screen readers */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full filter blur-xl opacity-50" aria-hidden="true" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full filter blur-xl opacity-50" aria-hidden="true" />
                
                <div className="space-y-6 relative z-10">
                  <section aria-labelledby="funding-progress-heading">
                    <div className="flex items-center justify-between mb-2">
                      <h3 id="funding-progress-heading" className="text-sm font-medium text-muted-foreground">Funding Progress</h3>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {Math.round((projectData.raised / projectData.target) * 100)}% Funded
                      </Badge>
                    </div>
                    <div 
                      className="mt-2 h-3 w-full rounded-full bg-secondary/20 overflow-hidden p-[1px]"
                      role="progressbar"
                      aria-valuenow={Math.round((projectData.raised / projectData.target) * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Funding progress"
                    >
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-inner-glow"
                        initial={{ width: 0 }}
                        animate={{ width: `${(projectData.raised / projectData.target) * 100}%` }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Raised: </span>
                        <span className="font-bold text-lg gradient-text">${projectData.raised.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Target: </span>
                        <span className="font-medium">${projectData.target.toLocaleString()}</span>
                      </div>
                    </div>
                  </section>
                  <section className="pt-6 border-t border-border/30" aria-labelledby="project-stats-heading">
                    <h3 id="project-stats-heading" className="sr-only">Project Statistics</h3>
                    <Suspense fallback={<div className="animate-pulse h-24 w-full bg-muted rounded-lg" aria-hidden="true" />}>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-full bg-primary/10" aria-hidden="true">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-xs text-muted-foreground">Investors</h4>
                                <p className="font-bold">{projectData.investors}</p>
                              </div>
                            </div>
                          </div>
                          <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-full bg-secondary/10" aria-hidden="true">
                                <TrendingUp className="h-4 w-4 text-secondary" />
                              </div>
                              <div>
                                <h4 className="text-xs text-muted-foreground">Returns</h4>
                                <p className="font-bold">{projectData.returns}%</p>
                              </div>
                            </div>
                          </div>
                          <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-full bg-accent/10" aria-hidden="true">
                                <Calendar className="h-4 w-4 text-accent" />
                              </div>
                              <div>
                                <h4 className="text-xs text-muted-foreground">Timeline</h4>
                                <p className="font-bold">{projectData.timeline}</p>
                              </div>
                            </div>
                          </div>
                          <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-full bg-primary/10" aria-hidden="true">
                                <DollarSign className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-xs text-muted-foreground">Min Investment</h4>
                                <p className="font-bold">${projectData.minInvestment?.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                      </div>
                    </Suspense>
                  </section>

                  <div className="pt-6">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleInvest}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-float"
                        size="lg"
                        disabled={!isConnected || kycStatus !== 'completed'}
                        aria-label="Invest in this project"
                      >
                        <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
                        Invest Now
                      </Button>
                    </motion.div>
                    {!isConnected && (
                      <div className="glass-card dark:glass-card-dark mt-3 p-3 rounded-lg" role="alert">
                        <p className="text-xs text-muted-foreground text-center">
                          Please connect your wallet to invest
                        </p>
                      </div>
                    )}
                    {isConnected && kycStatus !== 'completed' && (
                      <div className="glass-card dark:glass-card-dark mt-3 p-3 rounded-lg" role="alert">
                        <p className="text-xs text-muted-foreground text-center">
                          KYC verification required
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
              
          {/* Additional project information card */}
          <motion.div variants={item}>
            <Card className="p-6 glass-card dark:glass-card-dark shadow-float">
              <section aria-labelledby="project-details-heading">
                <h3 id="project-details-heading" className="text-lg font-semibold mb-4">Project Details</h3>
                <dl className="space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Project Type</dt>
                    <dd className="font-medium capitalize">{projectData.type}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Creator</dt>
                    <dd className="font-medium">{projectData.creator}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Expected Returns</dt>
                    <dd className="font-medium text-green-600">{projectData.returns}%</dd>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Investment Period</dt>
                    <dd className="font-medium">{projectData.timeline}</dd>
                  </div>
                </dl>
                
                <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSignature className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">IP Rights</h3>
                  </div>
                  <p className="text-2xl font-bold">Tokenized</p>
                  <p className="text-sm text-muted-foreground">Fractional ownership</p>
                </div>
              </section>
            </Card>
          </motion.div>
        </aside>
      </div>
      
      {/* Floating decorative elements - hidden from screen readers */}
      <div className="absolute top-1/4 right-1/3 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 animate-float" aria-hidden="true" />
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full bg-gradient-to-r from-secondary to-accent opacity-20 animate-float" style={{ animationDelay: '1s' }} aria-hidden="true" />
      <div className="absolute top-2/3 left-1/4 w-10 h-10 rounded-full bg-gradient-to-r from-accent to-primary opacity-20 animate-float" style={{ animationDelay: '2s' }} aria-hidden="true" />

      <AnimatePresence>
        {isInvestModalOpen && (
          <InvestModal
            project={projectData}
            onClose={() => setIsInvestModalOpen(false)}
            blockchain={blockchain || undefined}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectPage;
