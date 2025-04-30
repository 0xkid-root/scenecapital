'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Film, 
  Music, 
  BookOpen, 
  Tv, 
  TrendingUp, 
  DollarSign,
  Users,
  Clock,
  Wallet
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sample token listing data
const tokenListings = [
  {
    id: 'token-1',
    name: 'Cosmic Odyssey',
    symbol: 'COSM',
    type: 'Film',
    creator: 'Elena Rodriguez',
    price: 65,
    change: '+30%',
    holders: 145,
    marketCap: 650000,
    volume24h: 45000,
    image: '/projects/cosmic-odyssey-1.jpg'
  },
  {
    id: 'token-2',
    name: 'Echoes of Tomorrow',
    symbol: 'ECHO',
    type: 'Music',
    creator: 'Marcus Chen',
    price: 32,
    change: '+12%',
    holders: 215,
    marketCap: 320000,
    volume24h: 28000,
    image: '/projects/echoes-album.jpg'
  },
  {
    id: 'token-3',
    name: 'The Silent Protocol',
    symbol: 'SILP',
    type: 'Book',
    creator: 'Amara Johnson',
    price: 48,
    change: '+9%',
    holders: 189,
    marketCap: 480000,
    volume24h: 32000,
    image: '/projects/silent-protocol.jpg'
  },
  {
    id: 'token-4',
    name: 'Neon Shadows',
    symbol: 'NEON',
    type: 'Web Series',
    creator: 'Kai Nakamura',
    price: 55,
    change: '+21%',
    holders: 276,
    marketCap: 550000,
    volume24h: 42000,
    image: '/projects/neon-shadows.jpg'
  },
  {
    id: 'token-5',
    name: 'Harmonic Visions',
    symbol: 'HARM',
    type: 'Music',
    creator: 'Sophia Williams',
    price: 28,
    change: '+15%',
    holders: 132,
    marketCap: 280000,
    volume24h: 21000,
    image: '/projects/harmonic-visions.jpg'
  },
  {
    id: 'token-6',
    name: 'Quantum Tales',
    symbol: 'QTALE',
    type: 'Book',
    creator: 'David Chen',
    price: 42,
    change: '+7%',
    holders: 156,
    marketCap: 420000,
    volume24h: 31000,
    image: '/projects/quantum-tales.jpg'
  }
];

// Helper function to get the appropriate icon for each IP type
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Film':
      return <Film className="h-4 w-4" />;
    case 'Music':
      return <Music className="h-4 w-4" />;
    case 'Book':
      return <BookOpen className="h-4 w-4" />;
    case 'Web Series':
    case 'TV':
      return <Tv className="h-4 w-4" />;
    default:
      return <Film className="h-4 w-4" />;
  }
};

// Helper function to get the appropriate color class for each IP type
const getTypeColorClass = (type: string) => {
  switch (type) {
    case 'Film':
      return 'bg-blue-500/10 text-blue-500';
    case 'Music':
      return 'bg-purple-500/10 text-purple-500';
    case 'Book':
      return 'bg-amber-500/10 text-amber-500';
    case 'Web Series':
    case 'TV':
      return 'bg-emerald-500/10 text-emerald-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('price');

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Filter tokens based on search query and selected type
  const filteredTokens = tokenListings.filter(token => {
    const matchesSearch = 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.creator.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || token.type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  // Sort tokens based on selected sort option
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'marketCap':
        return b.marketCap - a.marketCap;
      case 'volume':
        return b.volume24h - a.volume24h;
      case 'holders':
        return b.holders - a.holders;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-8"
      >
        {/* Page Header */}
        <motion.div variants={item} className="space-y-2">
          <h1 className="text-3xl font-bold">IP Token Marketplace</h1>
          <p className="text-muted-foreground">
            Discover, buy, and trade tokenized intellectual property assets from films, music, books, and more.
          </p>
        </motion.div>

        {/* Market Overview */}
        <motion.div variants={item}>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Market Cap</h3>
                </div>
                <p className="text-2xl font-bold">$2.7M</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.4% this week
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">24h Volume</h3>
                </div>
                <p className="text-2xl font-bold">$198K</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% today
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Active Traders</h3>
                </div>
                <p className="text-2xl font-bold">1,245</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +32 today
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Avg. ROI</h3>
                </div>
                <p className="text-2xl font-bold">18.5%</p>
                <p className="text-sm text-muted-foreground">
                  Over 12 months
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, symbol, or creator" 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="film">Films</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="book">Books</SelectItem>
                <SelectItem value="web series">Web Series</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="marketCap">Market Cap</SelectItem>
                <SelectItem value="volume">24h Volume</SelectItem>
                <SelectItem value="holders">Holders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Token Listings */}
        <motion.div variants={item}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Tokens</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New Listings</TabsTrigger>
              <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTokens.map((token) => (
                  <motion.div 
                    key={token.id} 
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="overflow-hidden h-full border-border/50 transition-all duration-300 hover:shadow-float">
                      {/* Image section with gradient overlay */}
                      <div className="relative h-40 overflow-hidden">
                        {/* This would be an actual image in production */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"
                          style={{
                            backgroundImage: `url(${token.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        
                        {/* Type badge */}
                        <div className="absolute top-3 left-3">
                          <Badge 
                            variant="outline" 
                            className={`flex items-center gap-1 ${getTypeColorClass(token.type)} border-0`}
                          >
                            {getTypeIcon(token.type)}
                            <span>{token.type}</span>
                          </Badge>
                        </div>
                        
                        {/* Title and creator */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-white truncate">{token.name}</h3>
                              <p className="text-sm text-white/80">by {token.creator}</p>
                            </div>
                            <Badge className="bg-primary/80 hover:bg-primary">{token.symbol}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats section */}
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Current Price</p>
                            <p className="text-2xl font-bold">${token.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">24h Change</p>
                            <p className="text-lg font-medium text-green-600">{token.change}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="p-2 bg-muted/30 rounded-md">
                            <p className="text-xs text-muted-foreground">Holders</p>
                            <p className="font-medium">{token.holders}</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded-md">
                            <p className="text-xs text-muted-foreground">Market Cap</p>
                            <p className="font-medium">${(token.marketCap / 1000).toFixed(0)}K</p>
                          </div>
                          <div className="p-2 bg-muted/30 rounded-md">
                            <p className="text-xs text-muted-foreground">24h Vol</p>
                            <p className="font-medium">${(token.volume24h / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                            <Wallet className="h-4 w-4 mr-2" />
                            Buy
                          </Button>
                          <Button variant="outline" className="flex-1">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {sortedTokens.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tokens match your search criteria.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Trending tokens will appear here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              <div className="text-center py-12">
                <p className="text-muted-foreground">New token listings will appear here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="watchlist">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Connect your wallet to view your watchlist.</p>
                <Button className="mt-4">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
