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
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="flex-1 space-y-6 p-4 md:p-8 pt-6"
    >
      {/* Page Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">IP Token Marketplace</h2>
          <p className="text-muted-foreground mt-1">
            Discover, buy, and trade tokenized intellectual property assets from films, music, books, and more.
          </p>
        </div>
      </motion.div>

      {/* Market Overview */}
      <motion.div variants={item}>
        <Card className="p-6 bg-card/50 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="text-sm">Market Cap</span>
              </div>
              <div className="text-2xl font-bold">$2.7M</div>
              <div className="text-xs text-green-500">+15.4% this week</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="text-sm">24h Volume</span>
              </div>
              <div className="text-2xl font-bold">$198K</div>
              <div className="text-xs text-green-500">+8.2% today</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">Active Traders</span>
              </div>
              <div className="text-2xl font-bold">1,245</div>
              <div className="text-xs text-green-500">+32 today</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Avg. ROI</span>
              </div>
              <div className="text-2xl font-bold">18.5%</div>
              <div className="text-xs text-muted-foreground">Over 12 months</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={item} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, symbol, or creator"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="film">Film</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="web series">Web Series</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="holders">Holders</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Token Listings */}
      <motion.div variants={item}>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tokens</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New Listings</TabsTrigger>
            <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTokens.map((token) => (
                <motion.div
                  key={token.id}
                  variants={item}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      {/* Add proper Image component with token.image */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`${getTypeColorClass(token.type)}`}>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(token.type)}
                              {token.type}
                            </span>
                          </Badge>
                          <Badge variant="outline" className="bg-white/10 text-white">
                            {token.symbol}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{token.name}</h3>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          {token.change}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">by {token.creator}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Price</div>
                          <div className="font-semibold">${token.price}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Holders</div>
                          <div className="font-semibold">{token.holders}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Market Cap</div>
                          <div className="font-semibold">${token.marketCap.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">24h Volume</div>
                          <div className="font-semibold">${token.volume24h.toLocaleString()}</div>
                        </div>
                      </div>
                      <Button className="w-full mt-4" size="sm">
                        <Wallet className="w-4 h-4 mr-2" />
                        Trade Now
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            {/* Similar grid for trending tokens */}
          </TabsContent>

          <TabsContent value="new">
            {/* Similar grid for new listings */}
          </TabsContent>

          <TabsContent value="watchlist">
            {/* Similar grid for watchlist tokens */}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
