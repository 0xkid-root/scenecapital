"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/fade-in";
import { BadgeWithIcon } from "@/components/ui/badge-with-icon";
import { 
  UserPlus, Search, FileCheck, Wallet, ArrowUpRight, 
  ChevronRight, ChevronLeft, Play, PauseCircle, CheckCircle,
  BarChart, Repeat, Coins, Sparkles, Zap, Clock, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  details?: string[];
  benefits?: string[];
  onClick?: () => void;
}

function ProcessStep({ number, title, description, icon, active, details, benefits, onClick }: ProcessStepProps) {
  return (
    <motion.div
      whileHover={{ scale: active ? 1.03 : 1.02 }}
      className="h-full"
    >
      <Card 
        className={`
          relative h-full w-full transition-all duration-300 overflow-hidden cursor-pointer
          ${active ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 shadow-lg border-blue-200 dark:border-blue-800' : 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm'}
        `}
        onClick={onClick}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-600 opacity-0 transition-opacity duration-300 ease-in-out" 
          style={{ opacity: active ? 1 : 0 }}
        />
        
        <div className="absolute top-0 right-0 p-2">
          <Badge 
            variant="outline" 
            className={`text-xs font-medium ${active ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
          >
            Step {number}
          </Badge>
        </div>
        
        <CardContent className="pt-6 pb-4">
          <div className="mb-4 w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
            {icon}
          </div>
          <h4 className="text-xl font-bold font-display mb-2">{title}</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
          
          <AnimatePresence>
            {active && details && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
              >
                <ul className="space-y-2">
                  {details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500 dark:text-blue-400" />
                      <span className="text-slate-700 dark:text-slate-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        
        {active && benefits && (
          <CardFooter className="pt-0 pb-4 flex items-center justify-between">
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-1" />
              <span>{benefits.length} Benefits</span>
            </div>
            <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

const steps = [
  {
    number: 1,
    title: "Project Submission",
    description: "Creators submit their IP projects for review and verification of ownership rights.",
    icon: <FileCheck className="h-6 w-6" />,
    details: [
      "Complete creator profile with verification",
      "Upload project details and creative assets",
      "Define licensing terms and ownership structure",
      "Set revenue distribution parameters"
    ],
    benefits: [
      "Simple submission process",
      "No upfront costs",
      "Maintain creative control",
      "Global exposure to investors"
    ]
  },
  {
    number: 2,
    title: "Due Diligence",
    description: "Our team verifies team credentials, rights agreements, and project viability.",
    icon: <Search className="h-6 w-6" />,
    details: [
      "Legal verification of IP ownership",
      "Market analysis and valuation",
      "Technical assessment of project",
      "Background checks on creators"
    ],
    benefits: [
      "Professional assessment",
      "Market-based valuation",
      "Reduced investment risk",
      "Transparent evaluation criteria"
    ]
  },
  {
    number: 3,
    title: "IP Tokenization",
    description: "Approved projects are tokenized with smart contracts embedding licensing terms.",
    icon: <Coins className="h-6 w-6" />,
    details: [
      "Creation of unique digital tokens",
      "Embedding of licensing terms in smart contracts",
      "Setting token supply and price",
      "Deployment to blockchain network"
    ],
    benefits: [
      "Immutable proof of ownership",
      "Automated licensing enforcement",
      "Programmable royalty distribution",
      "Transparent ownership records"
    ]
  },
  {
    number: 4,
    title: "Fractional Investment",
    description: "Investors purchase fractional ownership in IP through tokenized shares.",
    icon: <Wallet className="h-6 w-6" />,
    details: [
      "Browse curated IP investment opportunities",
      "Purchase tokens with as little as $10",
      "Build diversified portfolio of creative assets",
      "Track investments in real-time dashboard"
    ],
    benefits: [
      "Low barrier to entry",
      "Portfolio diversification",
      "Liquid secondary market",
      "Direct connection to creators"
    ]
  },
  {
    number: 5,
    title: "Automated Royalties",
    description: "Revenue is automatically distributed to token holders via smart contracts.",
    icon: <Zap className="h-6 w-6" />,
    details: [
      "Real-time revenue tracking from all sources",
      "Instant distribution to all token holders",
      "Transparent transaction records",
      "Automated reporting and tax documentation"
    ],
    benefits: [
      "No payment delays",
      "Zero collection costs",
      "Transparent distribution",
      "Programmable payment splits"
    ]
  },
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'cards' | 'flow'>('timeline');
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Handle step selection
  const handleStepClick = (stepNumber: number) => {
    setActiveStep(stepNumber);
    setAutoPlay(false);
    setShowDetails(true);
  };
  
  // Toggle autoplay
  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    if (!autoPlay) {
      setShowDetails(false);
    }
  };

  // Auto-cycle through steps when autoplay is enabled
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % steps.length) + 1);
      setShowDetails(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay]);
  
  // Scroll active step into view on mobile
  useEffect(() => {
    if (timelineRef.current) {
      const activeElement = timelineRef.current.querySelector(`[data-step="${activeStep}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeStep]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section 
      className="py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden relative"
      id="process"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <BadgeWithIcon
              icon={Wallet}
              text="PLATFORM PROCESS"
              className="mb-3 mx-auto"
            />
            <h3 className="text-3xl md:text-4xl font-bold font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              How our IP marketplace works
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our decentralized platform transforms creative works into tokenized assets,
              enabling transparent ownership, licensing, and automated royalty distribution.
            </p>
          </div>
        </FadeIn>
        
        {/* View mode switcher and content */}
        <Tabs 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as 'timeline' | 'cards' | 'flow')}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger 
                  value="timeline" 
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300 flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Timeline</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="cards" 
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300 flex items-center gap-2"
                >
                  <BarChart className="h-4 w-4" />
                  <span>Steps</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="flow" 
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300 flex items-center gap-2"
                >
                  <Repeat className="h-4 w-4" />
                  <span>Flow</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          {/* Playback controls */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-full p-2 ${autoPlay ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}`}
                onClick={toggleAutoPlay}
                aria-label={autoPlay ? "Pause autoplay" : "Start autoplay"}
              >
                {autoPlay ? <PauseCircle className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {autoPlay ? "Auto-playing" : "Click steps to explore"}
              </div>
            </div>
          </div>

          <TabsContent value="timeline" className="mt-0">
            {/* Desktop timeline */}
            <div className="hidden md:block relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full"></div>
              
              <motion.div 
                className="flex justify-between items-start gap-4 relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                ref={timelineRef}
              >
                {steps.map((step) => (
                  <motion.div 
                    key={step.number} 
                    className="relative pb-10 w-full"
                    variants={itemVariants}
                    data-step={step.number}
                  >
                    <ProcessStep
                      number={step.number}
                      title={step.title}
                      description={step.description}
                      icon={step.icon}
                      active={activeStep === step.number}
                      details={showDetails && activeStep === step.number ? step.details : undefined}
                      benefits={step.benefits}
                      onClick={() => handleStepClick(step.number)}
                    />
                    <div className="absolute h-14 w-1 bg-slate-200 dark:bg-slate-800 left-1/2 -translate-x-1/2 -bottom-4"></div>
                    <div 
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-300 ${activeStep === step.number ? 'bg-blue-600 scale-125' : 'bg-slate-300 dark:bg-slate-600'}`}
                    ></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Mobile horizontal scrollable timeline */}
            <div className="md:hidden relative overflow-x-auto pb-6" ref={timelineRef}>
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full"></div>
              
              <div className="flex gap-4 min-w-max px-4">
                {steps.map((step) => (
                  <div 
                    key={step.number} 
                    className="relative pb-10 w-[280px]"
                    data-step={step.number}
                  >
                    <ProcessStep
                      number={step.number}
                      title={step.title}
                      description={step.description}
                      icon={step.icon}
                      active={activeStep === step.number}
                      details={showDetails && activeStep === step.number ? step.details : undefined}
                      benefits={step.benefits}
                      onClick={() => handleStepClick(step.number)}
                    />
                    <div className="absolute h-14 w-1 bg-slate-200 dark:bg-slate-800 left-1/2 -translate-x-1/2 -bottom-4"></div>
                    <div 
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all duration-300 ${activeStep === step.number ? 'bg-blue-600 scale-125' : 'bg-slate-300 dark:bg-slate-600'}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cards" className="mt-0">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {steps.map((step) => (
                <motion.div key={step.number} variants={itemVariants}>
                  <ProcessStep
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                    active={activeStep === step.number}
                    details={showDetails && activeStep === step.number ? step.details : undefined}
                    benefits={step.benefits}
                    onClick={() => handleStepClick(step.number)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="flow" className="mt-0">
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center w-full md:w-auto">
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-3 transition-all duration-300 ${activeStep === step.number ? 'bg-blue-600 text-white scale-110' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
                    onClick={() => handleStepClick(step.number)}
                    role="button"
                    tabIndex={0}
                  >
                    {step.number}
                  </div>
                  <h4 className="text-center font-bold mb-1">{step.title}</h4>
                  
                  {/* Only show description for active step */}
                  <AnimatePresence>
                    {activeStep === step.number && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-center text-sm text-slate-600 dark:text-slate-400 max-w-[200px]"
                      >
                        {step.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10 transform -translate-y-8"></div>
                  )}
                  {index < steps.length - 1 && (
                    <div className="md:hidden mt-6 mb-6 transform rotate-90">
                      <ArrowRight className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Detailed view of active step */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 shrink-0">
                      {steps[activeStep - 1].icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-display mb-2">{steps[activeStep - 1].title}</h4>
                      <p className="text-slate-700 dark:text-slate-300 mb-4">{steps[activeStep - 1].description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" /> Process Details
                          </h5>
                          <ul className="space-y-2">
                            {steps[activeStep - 1].details?.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500 dark:text-blue-400" />
                                <span className="text-slate-700 dark:text-slate-300">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" /> Key Benefits
                          </h5>
                          <ul className="space-y-2">
                            {steps[activeStep - 1].benefits?.map((benefit, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 mt-0.5 text-blue-500 dark:text-blue-400" />
                                <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
        </Tabs>

        <FadeIn className="mt-16 text-center">
          <Button className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300">
            Start Your Investment Journey
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}