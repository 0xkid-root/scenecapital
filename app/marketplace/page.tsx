'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
  ChevronsLeft,
  ChevronsRight,
  Wallet,
  Heart,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle,
  X,
  BarChart2,
  BarChart3,
  Share,
  Share2,
  History,
  Trash2,
  Star,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Plus,
  ChevronDown,
  ChevronUp,
  Percent,
  Copy,
  Loader2,
  FileText,
  LineChart,
  ShoppingCart,
  Hash,
  SlidersHorizontal,
  Tags,
  Layers,
  Image as ImageIcon,
  Coins,
  InfoIcon,
  RotateCcw,
  Shield
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ethers } from 'ethers';

import { Contract } from 'ethers';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';

// Mock data generator
const generateMockTokens = (count: number): IPToken[] => {
  const types = ['Film', 'Music', 'Book', 'Web Series', 'Art Collection'];
  const creators = ['Elena Rodriguez', 'James Carter', 'Aisha Khan', 'Liam Wong', 'Sofia Alvarez'];
  const tokens: IPToken[] = [];
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const price = Math.floor(Math.random() * 100) + 10;
    const totalSupply = Math.floor(Math.random() * 1000000) + 500000;
    tokens.push({
      id: `token-${i + 1}`,
      name: `${type} Project ${i + 1}`,
      symbol: `TOK${i + 1}`,
      type,
      creator: creators[Math.floor(Math.random() * creators.length)],
      price,
      change: `+${(Math.random() * 50).toFixed(1)}%`,
      holders: Math.floor(Math.random() * 1000) + 50,
      marketCap: price * totalSupply * 0.65,
      volume24h: Math.floor(Math.random() * 100000) + 1000,
      image: `/projects/project-${i % 5 + 1}.jpg`,
      description: `A unique ${type.toLowerCase()} project exploring innovative themes and concepts.`,
      totalSupply,
      circulatingSupply: Math.floor(totalSupply * 0.65),
      royaltyFee: parseFloat((Math.random() * 5).toFixed(1)),
      releaseDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      inWatchlist: false,
      priceHistory: Array.from({ length: 7 }, () => price * (0.8 + Math.random() * 0.4)),
      verified: Math.random() > 0.3,
      creatorAvatar: `/avatars/creator-${i % 5 + 1}.jpg`,
    });
  }
  return tokens;
};

const generateMockTemplates = (count: number): TokenTemplate[] => {
  const types = ['Film', 'Music', 'Book', 'Web Series', 'Art Collection'];
  const templates: TokenTemplate[] = [];
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    templates.push({
      id: `template-${i + 1}`,
      name: `${type} Template ${i + 1}`,
      type,
      royaltyFee: parseFloat((Math.random() * 5).toFixed(1)),
      totalSupply: Math.floor(Math.random() * 1000000) + 500000,
      description: `Template for ${type.toLowerCase()} projects with predefined settings.`,
    });
  }
  return templates;
};

const generateMockPortfolio = (tokens: IPToken[]): PortfolioItem[] => {
  const portfolio: PortfolioItem[] = [];
  const selectedTokens = tokens.slice(0, 5);
  selectedTokens.forEach((token, i) => {
    portfolio.push({
      id: `portfolio-${i + 1}`,
      tokenId: token.id,
      name: token.name,
      symbol: token.symbol,
      amount: Math.floor(Math.random() * 200) + 10,
      value: token.price * (Math.floor(Math.random() * 200) + 10),
      profit: `+${(Math.random() * 20).toFixed(1)}%`,
    });
  });
  return portfolio;
};

// Smart contract ABI (simplified for RWAvenueTokenFactory)
const factoryAbi = [
  'function deployToken(address admin, string name, string symbol, address identityRegistry, address compliance) external returns (address)',
  'event TokenDeployed(address indexed tokenAddress, address indexed admin, string name, string symbol)',
];

// Interfaces
interface IPToken {
  id: string;
  name: string;
  symbol: string;
  type: string;
  creator: string;
  price: number;
  change: string;
  holders: number;
  marketCap: number;
  volume24h: number;
  image: string;
  description: string;
  totalSupply: number;
  circulatingSupply: number;
  royaltyFee: number;
  releaseDate: string;
  inWatchlist: boolean;
  priceHistory: number[];
  verified: boolean;
  creatorAvatar: string;
}

interface TokenTemplate {
  id: string;
  name: string;
  type: string;
  royaltyFee: number;
  totalSupply: number;
  description: string;
}

interface PortfolioItem {
  id: string;
  tokenId: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  profit: string;
}

interface NotificationType {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  icon: React.ReactNode;
}

interface ConfirmTradeState {
  open: boolean;
  token: IPToken | null;
  amount: number;
  action: 'buy' | 'sell';
  total: number;
}

interface NewTokenData {
  name: string;
  symbol: string;
  type: string;
  price: string;
  totalSupply: string;
  royaltyFee: string;
  description: string;
  releaseDate: string;
  creator: string;
  status: string;
}

// Helper functions
const getTypeIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'Film': return <Film className="h-4 w-4" />;
    case 'Music': return <Music className="h-4 w-4" />;
    case 'Book': return <BookOpen className="h-4 w-4" />;
    case 'Web Series':
    case 'TV': return <Tv className="h-4 w-4" />;
    case 'Art Collection': return <Sparkles className="h-4 w-4" />;
    default: return <Film className="h-4 w-4" />;
  }
};

const getTypeColorClass = (type: string): string => {
  switch (type) {
    case 'Film': return 'bg-blue-500/10 text-blue-500';
    case 'Music': return 'bg-purple-500/10 text-purple-500';
    case 'Book': return 'bg-amber-500/10 text-amber-500';
    case 'Web Series':
    case 'TV': return 'bg-emerald-500/10 text-emerald-500';
    case 'Art Collection': return 'bg-pink-500/10 text-pink-500';
    default: return 'bg-gray-500/10 text-gray-500';
  }
};

// Chart components
const MiniPriceChart = ({ data }: { data: number[] }) => {
  const maxValue = Math.max(...data);
  return (
    <div className="h-10 flex items-end gap-[2px]">
      {data.map((value, index) => {
        const heightPercent = (value / maxValue) * 100;
        return (
          <div
            key={index}
            className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-sm"
            style={{ height: `${heightPercent}%` }}
          />
        );
      })}
    </div>
  );
};

const PriceChart = ({ data, days = 7, showTooltip = true }: { data: number[], days?: number, showTooltip?: boolean }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  return (
    <div className="mt-6 mb-4">
      <div className="h-52 flex items-end gap-1">
        {data.map((value, index) => {
          const heightPercent = ((value - minValue) / (maxValue - minValue)) * 80 + 20;
          return (
            <div key={index} className="relative flex-1 group">
              <div
                className="bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm"
                style={{ height: `${heightPercent}%` }}
              />
              {showTooltip && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card p-1 rounded shadow-md text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  ${value.toFixed(2)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{days} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [tradeAmount, setTradeAmount] = useState(1);
  const [selectedToken, setSelectedToken] = useState<IPToken | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [newTokenOpen, setNewTokenOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [tokens, setTokens] = useState<IPToken[]>(generateMockTokens(50));
  const [templates, setTemplates] = useState<TokenTemplate[]>(generateMockTemplates(10));
  const [userPortfolio, setUserPortfolio] = useState<PortfolioItem[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [marketCapRange, setMarketCapRange] = useState([0, 10000000]);
  const [marketFilters, setMarketFilters] = useState({
    verified: false,
    minHolders: 0,
    minVolume: 0,
  });
  const [activeChartPeriod, setActiveChartPeriod] = useState('7d');
  const [confirmTrade, setConfirmTrade] = useState<ConfirmTradeState>({
    open: false,
    token: null,
    amount: 0,
    action: 'buy',
    total: 0,
  });
  const [transactionSuccess, setTransactionSuccess] = useState<ConfirmTradeState>({
    open: false,
    token: null,
    amount: 0,
    action: 'buy',
    total: 0,
  });
  const [newTokenData, setNewTokenData] = useState<NewTokenData>({
    name: '',
    symbol: '',
    type: '',
    price: '',
    totalSupply: '',
    royaltyFee: '',
    description: '',
    releaseDate: '',
    creator: '',
    status: 'listed',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Initialize portfolio
  useEffect(() => {
    setUserPortfolio(generateMockPortfolio(tokens));
  }, [tokens]);

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setWalletAddress(accounts[0]);
        toast({ title: 'Wallet Connected', description: `Connected to ${accounts[0]}` });
      } catch (error) {
        console.error('Wallet connection failed:', error);
        toast({ title: 'Connection Failed', description: 'Failed to connect wallet.', variant: 'destructive' });
      }
    } else {
      toast({ title: 'No Wallet Found', description: 'Please install MetaMask.', variant: 'destructive' });
    }
  };

  // Filter and sort tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.creator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || token.type.toLowerCase() === selectedType.toLowerCase();
      const matchesPriceRange = token.price >= priceRange[0] && token.price <= priceRange[1];
      const matchesMarketCap = token.marketCap >= marketCapRange[0] && token.marketCap <= marketCapRange[1];
      const matchesVerified = marketFilters.verified ? token.verified : true;
      const matchesHolders = token.holders >= marketFilters.minHolders;
      const matchesVolume = token.volume24h >= marketFilters.minVolume;
      return matchesSearch && matchesType && matchesPriceRange && matchesMarketCap && matchesVerified && matchesHolders && matchesVolume;
    });
  }, [tokens, searchQuery, selectedType, priceRange, marketCapRange, marketFilters]);

  const sortedTokens = useMemo(() => {
    return [...filteredTokens].sort((a, b) => {
      switch (sortBy) {
        case 'price': return b.price - a.price;
        case 'priceAsc': return a.price - b.price;
        case 'marketCap': return b.marketCap - a.marketCap;
        case 'volume': return b.volume24h - a.volume24h;
        case 'holders': return b.holders - a.holders;
        case 'change': return parseFloat(b.change.replace('%', '')) - parseFloat(a.change.replace('%', ''));
        default: return 0;
      }
    });
  }, [filteredTokens, sortBy]);

  // Pagination
  const paginatedTokens = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedTokens.slice(start, end);
  }, [sortedTokens, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedTokens.length / itemsPerPage);

  // Watchlist tokens
  const watchlistTokens = useMemo(() => tokens.filter((token) => token.inWatchlist), [tokens]);

  // Form validation
  const validateTokenForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!newTokenData.name) newErrors.name = 'Token name is required';
    if (!newTokenData.symbol || !/^[A-Z]{3,5}$/.test(newTokenData.symbol))
      newErrors.symbol = 'Symbol must be 3-5 uppercase letters';
    if (!newTokenData.type) newErrors.type = 'Token type is required';
    if (!newTokenData.price || !/^\d+(\.\d+)?$/.test(newTokenData.price))
      newErrors.price = 'Valid price is required (e.g., 50.00)';
    if (!newTokenData.totalSupply || !/^\d+$/.test(newTokenData.totalSupply))
      newErrors.totalSupply = 'Valid total supply is required (e.g., 1000000)';
    if (!newTokenData.royaltyFee || !/^\d+(\.\d+)?$/.test(newTokenData.royaltyFee))
      newErrors.royaltyFee = 'Valid royalty fee is required (e.g., 2.5)';
    if (!newTokenData.description) newErrors.description = 'Description is required';
    if (!newTokenData.releaseDate) newErrors.releaseDate = 'Release date is required';
    if (!newTokenData.creator) newErrors.creator = 'Creator name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newTokenData]);

  // Handle actions
  const toggleWatchlist = useCallback((tokenId: string) => {
    const updatedTokens = tokens.map((token) => {
      if (token.id === tokenId) {
        const newWatchlistStatus = !token.inWatchlist;
        toast({
          title: newWatchlistStatus ? 'Added to Watchlist' : 'Removed from Watchlist',
          description: `${token.name} has been ${newWatchlistStatus ? 'added to' : 'removed from'} your watchlist.`,
        });
        return { ...token, inWatchlist: newWatchlistStatus };
      }
      return token;
    });
    setTokens(updatedTokens);
  }, [tokens]);

  const handleConfirmTrade = useCallback((token: IPToken, amount: number, action: 'buy' | 'sell', total: number) => {
    setConfirmTrade({
      open: true,
      token,
      amount,
      action,
      total,
    });
  }, []);
  
  const handleTokenSelect = useCallback((token: IPToken) => {
    setSelectedToken(token);
  }, []);

  const handleTradeSubmit = useCallback((e: React.FormEvent<HTMLFormElement>, token: IPToken, action: 'buy' | 'sell') => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = parseInt(formData.get('amount')?.toString() || '0');
    
    if (amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than zero.',
        variant: 'destructive',
      });
      return;
    }
    if (!walletAddress) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to trade tokens.',
        variant: 'destructive',
      });
      return;
    }
    handleConfirmTrade(token, amount, action, amount * token.price);
  }, [walletAddress, handleConfirmTrade]);

  const executeTrade = useCallback(() => {
    if (!confirmTrade.token) return;
    const { token, amount, action, total } = confirmTrade;
    setConfirmTrade({ ...confirmTrade, open: false });
    setTransactionSuccess({
      open: true,
      token,
      amount,
      action,
      total,
    });
    toast({
      title: 'Transaction Successful',
      description: `${action === 'buy' ? 'Bought' : 'Sold'} ${amount} ${token.symbol} for $${total.toFixed(2)}.`,
    });
    setTimeout(() => setSelectedToken(null), 500);
  }, [confirmTrade]);

  const handleCreateToken = async () => {
    if (!validateTokenForm()) {
      toast({
        title: 'Form Error',
        description: 'Please fix the form errors before submitting.',
        variant: 'destructive',
      });
      return;
    }
    if (!walletAddress) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to create a token.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider('');
      const signer = await provider.getSigner();
      const factoryAddress = '0xYourFactoryAddressHere'; // Replace with actual deployed address
      const factory = new ethers.Contract(factoryAddress, factoryAbi, signer);

      const tx = await factory.deployToken(
        walletAddress,
        newTokenData.name,
        newTokenData.symbol,
  
      );
      await tx.wait();

      const newToken: IPToken = {
        id: `token-${Date.now()}`,
        ...newTokenData,
        price: parseFloat(newTokenData.price),
        totalSupply: parseInt(newTokenData.totalSupply),
        circulatingSupply: Math.floor(parseInt(newTokenData.totalSupply) * 0.65),
        royaltyFee: parseFloat(newTokenData.royaltyFee),
        marketCap: parseFloat(newTokenData.price) * Math.floor(parseInt(newTokenData.totalSupply) * 0.65),
        volume24h: 0,
        holders: 0,
        change: '+0%',
        inWatchlist: false,
        priceHistory: [parseFloat(newTokenData.price)],
        verified: false,
        image: '/projects/default.jpg',
        creatorAvatar: '/avatars/default.jpg',
      };
      setTokens([...tokens, newToken]);
      setNewTokenOpen(false);
      setNewTokenData({
        name: '',
        symbol: '',
        type: '',
        price: '',
        totalSupply: '',
        royaltyFee: '',
        description: '',
        releaseDate: '',
        creator: '',
        status: 'listed',
      });
      setErrors({});
      toast({
        title: 'Token Created',
        description: `${newTokenData.name} has been successfully listed on the blockchain.`,
      });
    } catch (error) {
      console.error('Token creation failed:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create token. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = useCallback(() => {
    const newTemplate: TokenTemplate = {
      id: `template-${Date.now()}`,
      name: newTokenData.name || 'New Template',
      type: newTokenData.type || 'Film',
      royaltyFee: parseFloat(newTokenData.royaltyFee) || 2.5,
      totalSupply: parseInt(newTokenData.totalSupply) || 1000000,
      description: newTokenData.description || 'Default template description',
    };
    setTemplates([...templates, newTemplate]);
    setTemplateDialogOpen(false);
    setNewTokenData({ ...newTokenData, name: '', type: '', royaltyFee: '', totalSupply: '', description: '' });
    toast({
      title: 'Template Created',
      description: `${newTemplate.name} has been added to templates.`,
    });
  }, [newTokenData, templates]);

  const handleApplyTemplate = useCallback((template: TokenTemplate) => {
    setNewTokenData({
      ...newTokenData,
      type: template.type,
      royaltyFee: template.royaltyFee.toString(),
      totalSupply: template.totalSupply.toString(),
      description: template.description,
    });
    setNewTokenOpen(true);
  }, [newTokenData]);

  const handleShare = useCallback((token: IPToken) => {
    const url = `${window.location.origin}/marketplace/token/${token.id}`;
    setShareUrl(url);
    setShareDialogOpen(true);
  }, []);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({
        title: 'Link Copied',
        description: 'The share link has been copied to your clipboard.',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const formatNumber = (num: number): string => num.toLocaleString();

  const getChartDays = (): number => {
    switch (activeChartPeriod) {
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      default: return 7;
    }
  };

  // Notification cleanup
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-gray-50 relative"
    >
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-md shadow-lg border ${
              notification.type === 'success' ? 'bg-green-500 text-white' : 
              notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {notification.icon}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">IP Marketplace</h1>
          <p className="text-gray-500 mt-2">Discover and trade tokenized intellectual property assets</p>
          <div className="absolute -z-10 top-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {walletAddress ? (
            <Button variant="outline" disabled>
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </Button>
          ) : (
            <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90 text-white">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          <Dialog open={newTokenOpen} onOpenChange={setNewTokenOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white" disabled={!walletAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Token
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Token Listing</DialogTitle>
                <DialogDescription>
                  Fill in the details to list a new tokenized IP asset on the blockchain.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="grid gap-6 py-4 px-2">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="token-name" className="text-right">Token Name</Label>
                      <div className="col-span-3">
                        <Input
                          id="token-name"
                          placeholder="Enter token name"
                          value={newTokenData.name}
                          onChange={(e) => setNewTokenData({ ...newTokenData, name: e.target.value })}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="symbol" className="text-right">Symbol</Label>
                      <div className="col-span-3">
                        <Input
                          id="symbol"
                          placeholder="Enter symbol (e.g., COSM)"
                          value={newTokenData.symbol}
                          onChange={(e) => setNewTokenData({ ...newTokenData, symbol: e.target.value.toUpperCase() })}
                          className={errors.symbol ? 'border-red-500' : ''}
                        />
                        {errors.symbol && <p className="text-red-500 text-xs mt-1">{errors.symbol}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">Type</Label>
                      <div className="col-span-3">
                        <Select
                          value={newTokenData.type}
                          onValueChange={(value) => setNewTokenData({ ...newTokenData, type: value })}
                        >
                          <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select token type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Film">Film</SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Book">Book</SelectItem>
                            <SelectItem value="Web Series">Web Series</SelectItem>
                            <SelectItem value="Art Collection">Art Collection</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="creator" className="text-right">Creator</Label>
                      <div className="col-span-3">
                        <Input
                          id="creator"
                          placeholder="Enter creator name"
                          value={newTokenData.creator}
                          onChange={(e) => setNewTokenData({ ...newTokenData, creator: e.target.value })}
                          className={errors.creator ? 'border-red-500' : ''}
                        />
                        {errors.creator && <p className="text-red-500 text-xs mt-1">{errors.creator}</p>}
                      </div>
                    </div>
                  </div>
                  {/* Financials */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Financial Details</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right flex items-center gap-1">
                        Price
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger><Info className="h-4 w-4 text-gray-500" /></TooltipTrigger>
                            <TooltipContent>Enter the initial price per token (e.g., 50.00)</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="col-span-3 relative">
                        <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="price"
                          placeholder="Enter price"
                          value={newTokenData.price}
                          onChange={(e) => setNewTokenData({ ...newTokenData, price: e.target.value })}
                          className={`pl-8 ${errors.price ? 'border-red-500' : ''}`}
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="royaltyFee" className="text-right flex items-center gap-1">
                        Royalty Fee
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger><Info className="h-4 w-4 text-gray-500" /></TooltipTrigger>
                            <TooltipContent>Enter the royalty fee percentage (e.g., 2.5)</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="col-span-3 relative">
                        <Percent className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="royaltyFee"
                          placeholder="Enter royalty fee"
                          value={newTokenData.royaltyFee}
                          onChange={(e) => setNewTokenData({ ...newTokenData, royaltyFee: e.target.value })}
                          className={`pl-8 ${errors.royaltyFee ? 'border-red-500' : ''}`}
                        />
                        {errors.royaltyFee && <p className="text-red-500 text-xs mt-1">{errors.royaltyFee}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="totalSupply" className="text-right">Total Supply</Label>
                      <div className="col-span-3">
                        <Input
                          id="totalSupply"
                          placeholder="Enter total supply"
                          value={newTokenData.totalSupply}
                          onChange={(e) => setNewTokenData({ ...newTokenData, totalSupply: e.target.value })}
                          className={errors.totalSupply ? 'border-red-500' : ''}
                        />
                        {errors.totalSupply && <p className="text-red-500 text-xs mt-1">{errors.totalSupply}</p>}
                      </div>
                    </div>
                  </div>
                  {/* Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Details</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="releaseDate" className="text-right">Release Date</Label>
                      <div className="col-span-3">
                        <Input
                          id="releaseDate"
                          type="date"
                          value={newTokenData.releaseDate}
                          onChange={(e) => setNewTokenData({ ...newTokenData, releaseDate: e.target.value })}
                          className={errors.releaseDate ? 'border-red-500' : ''}
                        />
                        {errors.releaseDate && <p className="text-red-500 text-xs mt-1">{errors.releaseDate}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <textarea
                        id="description"
                        placeholder="Enter token description"
                        value={newTokenData.description}
                        onChange={(e) => setNewTokenData({ ...newTokenData, description: e.target.value })}
                        className={`col-span-3 p-2 border rounded-md w-full ${errors.description ? 'border-red-500' : ''}`}
                        rows={4}
                      />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewTokenOpen(false);
                    setErrors({});
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateToken} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Token'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Tokens</SheetTitle>
                <SheetDescription>Apply filters to narrow down the token listings.</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-4">
                <div>
                  <Label>Price Range</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                <div>
                  <Label>Market Cap Range</Label>
                  <Slider
                    value={marketCapRange}
                    onValueChange={setMarketCapRange}
                    min={0}
                    max={10000000}
                    step={10000}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${formatNumber(marketCapRange[0])}</span>
                    <span>${formatNumber(marketCapRange[1])}</span>
                  </div>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Film">Film</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Book">Book</SelectItem>
                      <SelectItem value="Web Series">Web Series</SelectItem>
                      <SelectItem value="Art Collection">Art Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified"
                    checked={marketFilters.verified}
                    onCheckedChange={(checked) => setMarketFilters({ ...marketFilters, verified: checked })}
                  />
                  <Label htmlFor="verified">Verified Only</Label>
                </div>
                <div>
                  <Label htmlFor="minHolders">Minimum Holders</Label>
                  <Input
                    id="minHolders"
                    type="number"
                    value={marketFilters.minHolders}
                    onChange={(e) => setMarketFilters({ ...marketFilters, minHolders: parseInt(e.target.value) || 0 })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="minVolume">Minimum 24h Volume</Label>
                  <Input
                    id="minVolume"
                    type="number"
                    value={marketFilters.minVolume}
                    onChange={(e) => setMarketFilters({ ...marketFilters, minVolume: parseInt(e.target.value) || 0 })}
                    className="mt-2"
                  />
                </div>
              </div>
              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([0, 100]);
                    setMarketCapRange([0, 10000000]);
                    setSelectedType('all');
                    setMarketFilters({ verified: false, minHolders: 0, minVolume: 0 });
                  }}
                >
                  Reset
                </Button>
                <Button onClick={() => setIsFiltersOpen(false)}>Apply Filters</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tokens..."
              className="pl-9 w-[200px] md:w-[250px] border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={item}>
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white shadow-sm rounded-lg">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">All Tokens</TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-primary data-[state=active]:text-white">Watchlist</TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-primary data-[state=active]:text-white">Portfolio</TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-primary data-[state=active]:text-white">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Token Listings
                </CardTitle>
                <CardDescription>Explore tokenized IP assets available for trading</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <p className="text-muted-foreground animate-pulse">Loading token listings...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                          <button
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${sortBy === 'price' || sortBy === 'priceAsc' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                            onClick={() => setSortBy(sortBy === 'price' ? 'priceAsc' : 'price')}
                          >
                            Price
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </button>
                          <button
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${sortBy === 'marketCap' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                            onClick={() => setSortBy('marketCap')}
                          >
                            Market Cap
                          </button>
                          <button
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${sortBy === 'volume' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                            onClick={() => setSortBy('volume')}
                          >
                            Volume
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{paginatedTokens.length}</span> of <span className="font-medium">{sortedTokens.length}</span> tokens
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {paginatedTokens.map((token) => (
                        <div 
                          key={token.id} 
                          className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
                        >
                          <div className="absolute top-3 right-3 z-10 flex gap-2">
                            {token.verified && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="bg-blue-500/90 text-white p-1.5 rounded-full">
                                      <CheckCircle className="h-4 w-4" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Verified Token</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                    onClick={() => toggleWatchlist(token.id)}
                                  >
                                    <Heart
                                      className={`h-4 w-4 ${token.inWatchlist ? 'fill-red-500 text-red-500' : ''}`}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {token.inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          
                          <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-muted/80 to-muted">
                            <div className="absolute inset-0 opacity-30">
                              <MiniPriceChart data={token.priceHistory} />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                                <AvatarImage src={token.image} alt={token.name} />
                                <AvatarFallback className="text-lg">{token.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className={getTypeColorClass(token.type)}>
                                {getTypeIcon(token.type)}
                                {token.type}
                              </Badge>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                {token.change}
                              </Badge>
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-1 truncate">{token.name}</h3>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-muted-foreground">{token.symbol}</span>
                              <span className="font-medium text-lg">${token.price.toFixed(2)}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                              <div>
                                <p className="text-muted-foreground">Market Cap</p>
                                <p className="font-medium">${formatNumber(token.marketCap)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Holders</p>
                                <p className="font-medium">{formatNumber(token.holders)}</p>
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full bg-primary/90 hover:bg-primary transition-colors"
                              onClick={() => handleTokenSelect(token)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col items-center gap-4 mt-8">
                      <Pagination className="bg-muted/30 p-2 rounded-lg shadow-sm">
                        <PaginationContent>
                          <PaginationItem>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`rounded-full ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-primary/10'}`}
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                            >
                              <ChevronsLeft className="h-4 w-4" />
                            </Button>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationPrevious
                              className={`rounded-full ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-primary/10'}`}
                              onClick={() => setCurrentPage(currentPage - 1)}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Only show a limited number of pages with ellipsis
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                    className={currentPage === page ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-primary/10'}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <PaginationItem key={page}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            }
                            return null;
                          })}
                          
                          <PaginationItem>
                            <PaginationNext
                              className={`rounded-full ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-primary/10'}`}
                              onClick={() => setCurrentPage(currentPage + 1)}
                            />
                          </PaginationItem>
                          <PaginationItem>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`rounded-full ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-primary/10'}`}
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronsRight className="h-4 w-4" />
                            </Button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                      
                      <div className="flex items-center gap-2">
                        <Label htmlFor="itemsPerPage" className="text-sm text-muted-foreground">Items per page:</Label>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={(value) => {
                            setItemsPerPage(parseInt(value));
                            setCurrentPage(1); // Reset to first page when changing items per page
                          }}
                        >
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue placeholder={itemsPerPage.toString()} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchlist">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Watchlist
                </CardTitle>
                <CardDescription>Your saved tokens for quick access</CardDescription>
              </CardHeader>
              <CardContent>
                {watchlistTokens.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Your watchlist is empty.</p>
                    <Button variant="outline" onClick={() => setNewTokenOpen(true)} disabled={!walletAddress}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Token
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-12 px-4 text-left font-medium">Token</th>
                          <th className="h-12 px-4 text-left font-medium">Type</th>
                          <th className="h-12 px-4 text-left font-medium">Price</th>
                          <th className="h-12 px-4 text-left font-medium">Change</th>
                          <th className="h-12 px-4 text-center font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {watchlistTokens.map((token) => (
                          <tr key={token.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={token.image} alt={token.name} />
                                  <AvatarFallback>{token.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{token.name}</div>
                                  <div className="text-sm text-gray-500">{token.symbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className={getTypeColorClass(token.type)}>
                                {getTypeIcon(token.type)}
                                {token.type}
                              </Badge>
                            </td>
                            <td className="p-4 font-medium">${token.price.toFixed(2)}</td>
                            <td className="p-4">
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                {token.change}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleTokenSelect(token)}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleWatchlist(token.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-500" />
                  Portfolio
                </CardTitle>
                <CardDescription>Your current token holdings</CardDescription>
              </CardHeader>
              <CardContent>
                {userPortfolio.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Your portfolio is empty.</p>
                    <Button variant="outline" onClick={() => setNewTokenOpen(true)} disabled={!walletAddress}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Token
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPortfolio.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={tokens.find((t) => t.id === item.tokenId)?.image} />
                            <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${formatNumber(item.value)}</div>
                          <div className="text-sm text-green-500">{item.profit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Tag className="h-5 w-5 text-indigo-500" />
                  Token Templates
                </CardTitle>
                <CardDescription>Predefined templates for creating new token listings</CardDescription>
              </CardHeader>
              <CardContent>
                {templates.length === 0 ? (
                  <div className="text-center py-12">
                    <Tag className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No templates available.</p>
                    <Button variant="outline" onClick={() => setTemplateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                      >
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-gray-500">{template.type}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplyTemplate(template)}
                          >
                            Apply
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewTokenData({
                                ...newTokenData,
                                name: template.name,
                                type: template.type,
                                royaltyFee: template.royaltyFee.toString(),
                                totalSupply: template.totalSupply.toString(),
                                description: template.description,
                              });
                              setTemplateDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => {
                              setTemplates(templates.filter((t) => t.id !== template.id));
                              toast({
                                title: 'Template Deleted',
                                description: `${template.name} has been removed.`,
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setTemplateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>Define a template for creating token listings.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-name" className="text-right">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="Enter template name"
                      value={newTokenData.name}
                      onChange={(e) => setNewTokenData({ ...newTokenData, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-type" className="text-right">Type</Label>
                    <Select
                      value={newTokenData.type}
                      onValueChange={(value) => setNewTokenData({ ...newTokenData, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Film">Film</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Book">Book</SelectItem>
                        <SelectItem value="Web Series">Web Series</SelectItem>
                        <SelectItem value="Art Collection">Art Collection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="royaltyFee" className="text-right">Royalty Fee</Label>
                    <div className="col-span-3 relative">
                      <Percent className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="royaltyFee"
                        placeholder="Enter royalty fee"
                        value={newTokenData.royaltyFee}
                        onChange={(e) => setNewTokenData({ ...newTokenData, royaltyFee: e.target.value })}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalSupply" className="text-right">Total Supply</Label>
                    <Input
                      id="totalSupply"
                      placeholder="Enter total supply"
                      value={newTokenData.totalSupply}
                      onChange={(e) => setNewTokenData({ ...newTokenData, totalSupply: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <textarea
                      id="description"
                      placeholder="Enter template description"
                      value={newTokenData.description}
                      onChange={(e) => setNewTokenData({ ...newTokenData, description: e.target.value })}
                      className="col-span-3 p-2 border rounded-md w-full"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateTemplate}>Create Template</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </motion.div>
{/* Token Details Modal */}
<Dialog open={selectedToken !== null} onOpenChange={(open) => !open && setSelectedToken(null)}>
  <DialogContent className="max-w-2xl">
    {selectedToken && (
      <>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getTypeColorClass(selectedToken.type)}>
                <span className="flex items-center gap-1">
                  {getTypeIcon(selectedToken.type)}
                  {selectedToken.type}
                </span>
              </Badge>
              <Badge variant="outline" className="bg-foreground/10">{selectedToken.symbol}</Badge>
              {selectedToken.verified && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleWatchlist(selectedToken.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${selectedToken.inWatchlist ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {selectedToken.inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare(selectedToken)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share token</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <DialogTitle className="text-2xl mt-2">{selectedToken.name}</DialogTitle>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedToken.creatorAvatar} />
              <AvatarFallback>{selectedToken.creator.charAt(0)}</AvatarFallback>
            </Avatar>
            <DialogDescription>by {selectedToken.creator}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart and Price */}
          <div className="md:col-span-2">
            <div className="bg-muted/30 rounded-md p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-lg font-bold">${selectedToken.price.toFixed(2)}</span>
                  <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500">
                    {selectedToken.change}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {['24h', '7d', '30d'].map((period) => (
                    <Button
                      key={period}
                      variant="outline"
                      size="sm"
                      className={activeChartPeriod === period ? 'bg-primary text-primary-foreground' : ''}
                      onClick={() => setActiveChartPeriod(period)}
                    >
                      {period.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              <PriceChart data={selectedToken.priceHistory} days={getChartDays()} />
            </div>

            {/* Description & Token Details */}
            <div className="space-y-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{selectedToken.description}</p>
              <Separator />
              <h3 className="font-semibold">Token Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Release Date</p>
                  <p>{selectedToken.releaseDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Supply</p>
                  <p>{formatNumber(selectedToken.totalSupply)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Circulating Supply</p>
                  <p>
                    {formatNumber(selectedToken.circulatingSupply)} (
                    {Math.round((selectedToken.circulatingSupply / selectedToken.totalSupply) * 100)}%)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Royalty Fee</p>
                  <p>{selectedToken.royaltyFee}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p>${formatNumber(selectedToken.volume24h)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Holders</p>
                  <p>{formatNumber(selectedToken.holders)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Section */}
          <div className="bg-muted/20 p-4 rounded-lg space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              Trade
            </h4>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  Amount
                </Label>
                <div className="flex">
                  <Input
                    id="amount"
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(parseFloat(e.target.value) || 0)}
                    className="rounded-r-none focus-visible:ring-primary"
                  />
                  <Button
                    variant="secondary"
                    className="rounded-l-none border-l-0"
                    onClick={() => setTradeAmount(1)}
                  >
                    Max
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  Total Cost
                </Label>
                <div className="bg-muted/50 p-3 rounded-md border border-border flex items-center justify-between">
                  <span className="font-medium text-lg">
                    ${(tradeAmount * selectedToken.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {tradeAmount} {selectedToken.symbol}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 border-red-200"
                onClick={() =>
                  handleConfirmTrade(selectedToken, tradeAmount, 'sell', tradeAmount * selectedToken.price)
                }
              >
                <ArrowDownRight className="h-4 w-4 mr-2" />
                Sell
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() =>
                  handleConfirmTrade(selectedToken, tradeAmount, 'buy', tradeAmount * selectedToken.price)
                }
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Buy
              </Button>
            </div>
          </div>
        </div>
      </>
    )}
  </DialogContent>
</Dialog>

      {/* Trade Confirmation Modal */}
      <Dialog open={confirmTrade.open} onOpenChange={(open) => setConfirmTrade({ ...confirmTrade, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {confirmTrade.action === 'buy' ? 'Purchase' : 'Sale'}</DialogTitle>
            <DialogDescription>Please review the transaction details before confirming.</DialogDescription>
          </DialogHeader>
          {confirmTrade.token && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Token:</span>
                <span className="font-medium">{confirmTrade.token.name} ({confirmTrade.token.symbol})</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{confirmTrade.amount} tokens</span>
              </div>
              <div className="flex justify-between">
                <span>Price per token:</span>
                <span>${confirmTrade.token.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Royalty Fee ({confirmTrade.token.royaltyFee}%):</span>
                <span>${((confirmTrade.total * confirmTrade.token.royaltyFee) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${(confirmTrade.total * (1 + confirmTrade.token.royaltyFee / 100)).toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmTrade({ ...confirmTrade, open: false })}>
              Cancel
            </Button>
            <Button onClick={executeTrade} disabled={isLoading || !confirmTrade.token}>
              Confirm {confirmTrade.action === 'buy' ? 'Purchase' : 'Sale'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Success Modal */}
      <Dialog open={transactionSuccess.open} onOpenChange={(open) => setTransactionSuccess({ ...transactionSuccess, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Successful</DialogTitle>
            <DialogDescription>
              Your {transactionSuccess.action === 'buy' ? 'purchase' : 'sale'} has been completed.
            </DialogDescription>
          </DialogHeader>
          {transactionSuccess.token && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <div className="flex justify-between">
                <span>Token:</span>
                <span className="font-medium">{transactionSuccess.token.name} ({transactionSuccess.token.symbol})</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{transactionSuccess.amount} tokens</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>${transactionSuccess.total.toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setTransactionSuccess({ ...transactionSuccess, open: false })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Token</DialogTitle>
            <DialogDescription>
              Share this token with others using the link below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input value={shareUrl} readOnly />
            <Button
              onClick={handleCopyClick}
              className="flex items-center gap-2"
            >
              {isCopied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </motion.div>
  );
}

