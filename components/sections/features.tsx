"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, ChartBar, LockKeyhole, Zap, ArrowUpRight, Clock, Shield, 
  Database, Coins, Users, Wallet, Handshake, Film, Music, BookOpen, 
  Palette, Code, Gamepad2, ChevronDown, ChevronRight, CheckCircle2, 
  Play, PauseCircle, Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FeatureCategory = "creators" | "investors" | "platform";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  category: FeatureCategory;
  benefits: string[];
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function FeatureCard({ 
  title, 
  description, 
  icon, 
  index, 
  category,
  benefits,
  color,
  isExpanded,
  onToggle
}: FeatureCardProps) {
  const staggerDelay = 0.1 * index;
  
  // Define color classes based on category
  const colorClasses = {
    creators: {
      bg: "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40",
      iconBg: `bg-${color}-100 dark:bg-${color}-900/30`,
      iconText: `text-${color}-800 dark:text-${color}-400`,
      border: `border-${color}-200 dark:border-${color}-800/30`,
      shadow: `shadow-${color}-200/20 dark:shadow-${color}-800/10`,
      badge: `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-400 border-${color}-200 dark:border-${color}-800/30`
    },
    investors: {
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40",
      iconBg: `bg-${color}-100 dark:bg-${color}-900/30`,
      iconText: `text-${color}-800 dark:text-${color}-400`,
      border: `border-${color}-200 dark:border-${color}-800/30`,
      shadow: `shadow-${color}-200/20 dark:shadow-${color}-800/10`,
      badge: `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-400 border-${color}-200 dark:border-${color}-800/30`
    },
    platform: {
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
      iconBg: `bg-${color}-100 dark:bg-${color}-900/30`,
      iconText: `text-${color}-800 dark:text-${color}-400`,
      border: `border-${color}-200 dark:border-${color}-800/30`,
      shadow: `shadow-${color}-200/20 dark:shadow-${color}-800/10`,
      badge: `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-400 border-${color}-200 dark:border-${color}-800/30`
    }
  };

  return (
    <FadeIn delay={staggerDelay} once={true}>
      <Card 
        className={`backdrop-blur-lg border ${colorClasses[category].border} hover:shadow-lg transition-all duration-300 ${colorClasses[category].bg} ${colorClasses[category].shadow} overflow-hidden`}
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        aria-expanded={isExpanded}
      >
        <CardHeader className="relative pb-2">
          <Badge 
            variant="outline" 
            className={`absolute top-4 right-4 text-xs font-medium ${colorClasses[category].badge}`}
          >
            {category === "creators" ? "For Creators" : 
             category === "investors" ? "For Investors" : "Platform Feature"}
          </Badge>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[category].iconBg} ${colorClasses[category].iconText} mb-4`}>
            {icon}
          </div>
          <CardTitle className="font-display text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between items-center">
          <p className="text-sm font-medium flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            <span>{isExpanded ? "Hide Details" : "View Benefits"}</span>
          </p>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </motion.div>
        </CardFooter>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                <p className="font-medium mb-3 text-sm">Key Benefits:</p>
                <ul className="space-y-2">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 ${colorClasses[category].iconText}`} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </FadeIn>
  );
}

const features = [
  // Creator-focused features
  {
    title: "IP Tokenization",
    description: "Transform creative works into digital assets with embedded rights and licensing terms.",
    icon: <Lightbulb className="h-6 w-6" />,
    category: "creators" as FeatureCategory,
    color: "purple",
    benefits: [
      "Monetize your creative work without losing ownership",
      "Define flexible licensing terms that protect your rights",
      "Create multiple revenue streams from a single work",
      "Reach global investors and fans directly"
    ]
  },
  {
    title: "Creator Control",
    description: "Set customizable licensing terms while maintaining creative control of your work.",
    icon: <Handshake className="h-6 w-6" />,
    category: "creators" as FeatureCategory,
    color: "purple",
    benefits: [
      "Maintain artistic integrity while sharing commercial rights",
      "Define usage limitations and approval workflows",
      "Revoke licenses for violations automatically",
      "Create tiered licensing structures for different use cases"
    ]
  },
  {
    title: "Automated Royalties",
    description: "Receive instant payments through smart contracts when your IP generates revenue.",
    icon: <Zap className="h-6 w-6" />,
    category: "creators" as FeatureCategory,
    color: "purple",
    benefits: [
      "Get paid instantly when your work is used commercially",
      "Eliminate payment delays and collection headaches",
      "Transparent tracking of all revenue sources",
      "Programmable royalty splits for collaborations"
    ]
  },
  
  // Investor-focused features
  {
    title: "Fractional Ownership",
    description: "Invest in creative IP with as little as $10 through fractional tokenized shares.",
    icon: <Database className="h-6 w-6" />,
    category: "investors" as FeatureCategory,
    color: "blue",
    benefits: [
      "Low barrier to entry for premium creative investments",
      "Diversify across multiple creative projects",
      "Liquid secondary market for IP investments",
      "Participate in exclusive investor communities"
    ]
  },
  {
    title: "Rigorous Due Diligence",
    description: "Access only high-quality projects that pass our thorough vetting process.",
    icon: <Shield className="h-6 w-6" />,
    category: "investors" as FeatureCategory,
    color: "blue",
    benefits: [
      "Professional market analysis for each project",
      "Legal verification of IP ownership and rights",
      "Creator background and track record verification",
      "Risk assessment and potential return projections"
    ]
  },
  {
    title: "DeFi Integration",
    description: "Stake your IP tokens in liquidity pools to generate additional returns.",
    icon: <Coins className="h-6 w-6" />,
    category: "investors" as FeatureCategory,
    color: "blue",
    benefits: [
      "Earn yield on your creative investments",
      "Participate in governance of creative DAOs",
      "Access exclusive DeFi products for IP assets",
      "Leverage IP tokens for loans and other financial services"
    ]
  },
  
  // Platform features
  {
    title: "Transparent Rights Management",
    description: "All licensing terms and ownership records are immutably stored on blockchain.",
    icon: <LockKeyhole className="h-6 w-6" />,
    category: "platform" as FeatureCategory,
    color: "emerald",
    benefits: [
      "Immutable proof of ownership and rights",
      "Public verification of licensing terms",
      "Automated enforcement of usage rights",
      "Simplified rights clearance and verification"
    ]
  },
  {
    title: "24/7 Marketplace",
    description: "Trade your IP tokens anytime on our secure global marketplace.",
    icon: <ChartBar className="h-6 w-6" />,
    category: "platform" as FeatureCategory,
    color: "emerald",
    benefits: [
      "Liquid market for creative investments",
      "Real-time price discovery for IP assets",
      "Global access without intermediaries",
      "Low transaction fees compared to traditional markets"
    ]
  },
  {
    title: "Multi-Media Support",
    description: "Platform supports all creative formats from film and music to art, literature and software.",
    icon: <Film className="h-6 w-6" />,
    category: "platform" as FeatureCategory,
    color: "emerald",
    benefits: [
      "Specialized tools for each creative medium",
      "Cross-media collaboration opportunities",
      "Unified rights management across formats",
      "Industry-specific marketplace features"
    ]
  },
];

export function FeaturesSection() {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<FeatureCategory>("platform");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const toggleFeature = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };
  
  const filteredFeatures = features.filter(feature => feature.category === activeTab);
  
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
      className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 overflow-hidden relative"
      id="features"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3 tracking-wider">PLATFORM FEATURES</h2>
            <h3 className="text-3xl md:text-4xl font-bold font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400">
              Revolutionizing IP Licensing & Ownership
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our decentralized platform transforms how creative works are funded, owned, and licensed through 
              blockchain technology, creating new opportunities for creators, investors, and fans.
            </p>
          </div>
        </FadeIn>
        
        {/* Interactive demo video */}
        <FadeIn className="mb-16">
          <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video bg-slate-900">
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoPlaying ? (
                <button 
                  onClick={() => setIsVideoPlaying(false)}
                  className="z-10 bg-slate-900/80 text-white p-4 rounded-full hover:bg-slate-800/80 transition-colors"
                  aria-label="Pause video"
                >
                  <PauseCircle className="h-8 w-8" />
                </button>
              ) : (
                <div className="text-center">
                  <button 
                    onClick={() => setIsVideoPlaying(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-lg mb-4 transition-transform hover:scale-105"
                    aria-label="Play video"
                  >
                    <Play className="h-8 w-8" />
                  </button>
                  <p className="text-white text-lg font-medium">Watch how it works</p>
                </div>
              )}
            </div>
            <img 
              src="/images/platform-demo.jpg" 
              alt="Scene Capital Platform Demo" 
              className="w-full h-full object-cover"
            />
          </div>
        </FadeIn>

        {/* Feature category tabs */}
        <div className="mb-8">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as FeatureCategory)}
            className="w-full"
          >
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-3 w-full max-w-2xl">
                <TabsTrigger 
                  value="creators" 
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 dark:data-[state=active]:bg-purple-900/30 dark:data-[state=active]:text-purple-300 flex items-center gap-2"
                >
                  <Palette className="h-4 w-4" />
                  <span>For Creators</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="investors" 
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300 flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>For Investors</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="platform" 
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800 dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-300 flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Platform</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="creators" className="mt-8">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">Empower Your Creative Journey</h4>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Turn your creative works into valuable digital assets while maintaining artistic control.
                  Set your terms, connect with investors, and receive automated royalty payments.
                </p>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="investors" className="mt-8">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Discover New Investment Opportunities</h4>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Invest in the next generation of creative works with as little as $10.
                  Diversify your portfolio with vetted projects and earn passive income through royalties.
                </p>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="platform" className="mt-8">
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Secure, Transparent & Efficient</h4>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Our blockchain-powered platform ensures transparent rights management, secure transactions,
                  and efficient marketplace operations for all creative formats.
                </p>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFeatures.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                index={index}
                category={feature.category}
                benefits={feature.benefits}
                color={feature.color}
                isExpanded={expandedFeature === index}
                onToggle={() => toggleFeature(index)}
              />
            </motion.div>
          ))}
        </motion.div>

        <FadeIn className="mt-16 text-center">
          <div className="inline-flex gap-4">
            <Button variant="outline" className="font-medium group">
              View Documentation <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started Now
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}