"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, Users, Briefcase, Film, Music, BookOpen, Paintbrush,
  TrendingUp, Clock, Star, DollarSign, Calendar, ArrowUpRight, BarChart3,
  ChevronDown, UserCircle
} from "lucide-react";

// Types and Interfaces (unchanged, included for context)
type IPCategory = "film" | "music" | "tv" | "theater" | "art" | "book" | "all";
type ProjectStatus = "active" | "funded" | "completed" | "all";
type TransactionType = "buy" | "sell" | "stake" | "dividend";
type TransactionStatus = "completed" | "pending" | "failed" | "all";

interface Creator {
  id: string;
  name: string;
  avatar: string;
  role: string;
  verified: boolean;
  projects: number;
  followers: number;
}

interface Project {
  id: string;
  title: string;
  category: IPCategory;
  creator: Creator;
  coverImage: string;
  description: string;
  status: ProjectStatus;
  fundingGoal: number;
  currentFunding: number;
  investors: number;
  tokenPrice: number;
  royaltyRate: number;
  releaseDate: string;
  createdAt: string;
  popularity: number;
}

interface Transaction {
  id: string;
  projectId: string;
  projectTitle: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  tokens: number;
  price: number;
  date: string;
  hash: string;
  counterparty: string;
}

interface MarketTrend {
  category: IPCategory;
  weeklyChange: number;
  monthlyVolume: number;
  averagePrice: number;
}

interface Portfolio {
  totalValue: number;
  weeklyChange: number;
  holdings: {
    projectId: string;
    projectTitle: string;
    category: IPCategory;
    tokens: number;
    value: number;
    purchasePrice: number;
    currentPrice: number;
  }[];
}

// Mock Data
const mockCreators: Creator[] = [
  {
    id: "creator1",
    name: "Nova Studios",
    avatar: "/avatars/creator1.jpg",
    role: "Production Company",
    verified: true,
    projects: 12,
    followers: 5400
  },
  {
    id: "creator2",
    name: "Echo Collective",
    avatar: "/avatars/creator2.jpg",
    role: "Music Group",
    verified: true,
    projects: 8,
    followers: 3200
  },
  {
    id: "creator3",
    name: "Vision Networks",
    avatar: "/avatars/creator3.jpg",
    role: "TV Production",
    verified: true,
    projects: 6,
    followers: 2800
  },
  {
    id: "creator4",
    name: "Curtain Call",
    avatar: "/avatars/creator4.jpg",
    role: "Theater Company",
    verified: false,
    projects: 4,
    followers: 1500
  },
  {
    id: "creator5",
    name: "Nova Art",
    avatar: "/avatars/creator5.jpg",
    role: "Art Collective",
    verified: true,
    projects: 9,
    followers: 4100
  }
];

const mockProjects: Project[] = [
  {
    id: "project1",
    title: "Quantum Horizon",
    category: "film",
    creator: mockCreators[0],
    coverImage: "/projects/film1.jpg",
    description: "A sci-fi epic about time travel and parallel universes.",
    status: "active",
    fundingGoal: 500000,
    currentFunding: 325000,
    investors: 128,
    tokenPrice: 12.75,
    royaltyRate: 8.5,
    releaseDate: "2025-06-15",
    createdAt: "2024-02-10",
    popularity: 92
  },
  {
    id: "project2",
    title: "Harmonic Waves",
    category: "music",
    creator: mockCreators[1],
    coverImage: "/projects/music1.jpg",
    description: "An alternative music album exploring new sound frontiers.",
    status: "funded",
    fundingGoal: 75000,
    currentFunding: 75000,
    investors: 210,
    tokenPrice: 3.25,
    royaltyRate: 12.5,
    releaseDate: "2024-09-20",
    createdAt: "2024-01-15",
    popularity: 88
  },
  {
    id: "project3",
    title: "Beyond the Veil",
    category: "tv",
    creator: mockCreators[2],
    coverImage: "/projects/tv1.jpg",
    description: "A fantasy series about hidden worlds and ancient magic.",
    status: "active",
    fundingGoal: 1200000,
    currentFunding: 850000,
    investors: 315,
    tokenPrice: 7.50,
    royaltyRate: 9.0,
    releaseDate: "2025-03-01",
    createdAt: "2023-11-20",
    popularity: 95
  }
];

const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    projectId: "project1",
    projectTitle: "Quantum Horizon",
    type: "buy",
    status: "completed",
    amount: 1275.00,
    tokens: 100,
    price: 12.75,
    date: "2024-04-15T14:30:00Z",
    hash: "0x8a3b9a7c8d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1",
    counterparty: "Market"
  },
  {
    id: "tx2",
    projectId: "project2",
    projectTitle: "Harmonic Waves",
    type: "stake",
    status: "completed",
    amount: 650.00,
    tokens: 200,
    price: 3.25,
    date: "2024-04-10T09:15:00Z",
    hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    counterparty: "Staking Pool"
  },
  {
    id: "tx3",
    projectId: "project3",
    projectTitle: "Beyond the Veil",
    type: "buy",
    status: "pending",
    amount: 1500.00,
    tokens: 200,
    price: 7.50,
    date: "2024-04-18T11:45:00Z",
    hash: "0xc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0",
    counterparty: "Market"
  },
  {
    id: "tx4",
    projectId: "project1",
    projectTitle: "Quantum Horizon",
    type: "sell",
    status: "completed",
    amount: 650.00,
    tokens: 50,
    price: 13.00,
    date: "2024-04-12T16:20:00Z",
    hash: "0x9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c",
    counterparty: "User0x123"
  },
  {
    id: "tx5",
    projectId: "project2",
    projectTitle: "Harmonic Waves",
    type: "dividend",
    status: "completed",
    amount: 125.00,
    tokens: 0,
    price: 0,
    date: "2024-04-05T08:30:00Z",
    hash: "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e",
    counterparty: "Echo Collective"
  }
];

const mockMarketTrends: MarketTrend[] = [
  { category: "film", weeklyChange: 5.2, monthlyVolume: 1250000, averagePrice: 10.75 },
  { category: "music", weeklyChange: 3.8, monthlyVolume: 980000, averagePrice: 4.25 },
  { category: "tv", weeklyChange: 7.1, monthlyVolume: 1750000, averagePrice: 8.50 },
  { category: "theater", weeklyChange: 2.5, monthlyVolume: 450000, averagePrice: 5.75 },
  { category: "art", weeklyChange: 4.3, monthlyVolume: 850000, averagePrice: 7.25 },
  { category: "book", weeklyChange: 1.9, monthlyVolume: 320000, averagePrice: 3.50 }
];

const mockPortfolio = {
  totalValue: 15250.00,
  weeklyChange: 3.8,
  holdings: [
    {
      projectId: "project1",
      projectTitle: "Quantum Horizon",
      category: "film",
      tokens: 100,
      value: 1275.00,
      purchasePrice: 12.50,
      currentPrice: 12.75
    },
    {
      projectId: "project2",
      projectTitle: "Harmonic Waves",
      category: "music",
      tokens: 200,
      value: 650.00,
      purchasePrice: 3.15,
      currentPrice: 3.25
    },
    {
      projectId: "project3",
      projectTitle: "Beyond the Veil",
      category: "tv",
      tokens: 150,
      value: 1125.00,
      purchasePrice: 7.25,
      currentPrice: 7.50
    }
  ]
};

// Main Component
export default function SceneCapitalPlatform() {
  const [activeTab, setActiveTab] = useState<string>("discover");
  const [categoryFilter, setCategoryFilter] = useState<IPCategory>("all");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>("all");
  const [transactionFilter, setTransactionFilter] = useState<TransactionStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);

  // Filter projects (unchanged)
  useEffect(() => {
    let result = mockProjects;
    
    if (categoryFilter !== "all") {
      result = result.filter(project => project.category === categoryFilter);
    }
    
    if (statusFilter !== "all") {
      result = result.filter(project => project.status === statusFilter);
    }
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query) ||
        project.creator.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredProjects(result);
  }, [categoryFilter, statusFilter, searchQuery]);

  // Filter transactions (unchanged)
  useEffect(() => {
    let result = mockTransactions;
    
    if (transactionFilter !== "all") {
      result = result.filter(tx => tx.status === transactionFilter);
    }
    
    if (searchQuery.trim() !== "" && activeTab === "transactions") {
      const query = searchQuery.toLowerCase();
      result = result.filter(tx => 
        tx.projectTitle.toLowerCase().includes(query) || 
        tx.counterparty.toLowerCase().includes(query) ||
        tx.type.toLowerCase().includes(query)
      );
    }
    
    setFilteredTransactions(result);
  }, [transactionFilter, searchQuery, activeTab]);

  // Helper Functions (unchanged)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateFundingPercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  // Render Functions (unchanged where complete)
  const renderProjectCard = (project: Project) => {
    const fundingPercentage = calculateFundingPercentage(project.currentFunding, project.fundingGoal);
    
    return (
      <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img src={project.coverImage} alt={project.title} className="w-full h-48 object-cover" />
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded capitalize">
            {project.category}
          </div>
          <div className={`absolute top-3 left-3 text-xs px-2 py-1 rounded ${
            project.status === "active" ? "bg-blue-500 text-white" : 
            project.status === "funded" ? "bg-green-500 text-white" : 
            "bg-purple-500 text-white"
          } capitalize`}>
            {project.status}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-2">
            <img src={project.creator.avatar} alt={project.creator.name} className="w-6 h-6 rounded-full mr-2" />
            <span className="text-sm text-gray-600 flex items-center">
              {project.creator.name}
              {project.creator.verified && (
                <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          </div>
          
          <h3 className="font-bold text-lg mb-2 truncate">{project.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
          
          {project.status !== "completed" && (
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{formatCurrency(project.currentFunding)} raised</span>
                <span>{fundingPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    fundingPercentage >= 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${fundingPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{project.investors} investors</span>
                <span>Goal: {formatCurrency(project.fundingGoal)}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              <div className="font-medium text-gray-900">{formatCurrency(project.tokenPrice)}</div>
              <div className="text-xs text-gray-500">Token Price</div>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">{(project.royaltyRate * 100).toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Royalty Rate</div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors">
              Invest Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTransactionRow = (tx: Transaction) => {
    return (
      <tr key={tx.id} className="hover:bg-gray-50">
        <td className="px-4 py-3 text-sm">
          <div className="font-medium text-gray-900">{tx.projectTitle}</div>
          <div className="text-xs text-gray-500">{tx.id}</div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            tx.type === "buy" ? "bg-green-100 text-green-800" : 
            tx.type === "sell" ? "bg-red-100 text-red-800" : 
            tx.type === "stake" ? "bg-purple-100 text-purple-800" : 
            "bg-blue-100 text-blue-800"
          } capitalize`}>
            {tx.type}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-right">
          <div className="font-medium text-gray-900">{formatCurrency(tx.amount)}</div>
          <div className="text-xs text-gray-500">{tx.tokens} tokens @ {formatCurrency(tx.price)}</div>
        </td>
        <td className="px-4 py-3 text-sm whitespace-nowrap">
          {tx.date}
        </td>
        <td className="px-4 py-3 text-sm">
          {tx.counterparty}
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            tx.status === "completed" ? "bg-green-100 text-green-800" : 
            tx.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          } capitalize`}>
            {tx.status}
          </span>
        </td>
      </tr>
    );
  };

  const StatCard = ({ title, value, icon, trend = null }: { title: string, value: string, icon: React.ReactNode, trend?: { value: number } | null }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {trend && (
        <div className={`text-sm flex items-center ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend.value >= 0 ? (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );

  const getCategoryIcon = (category: IPCategory) => {
    switch(category) {
      case "film": return <Film className="w-4 h-4" />;
      case "music": return <Music className="w-4 h-4" />;
      case "tv": return <Film className="w-4 h-4" />;
      case "theater": return <Users className="w-4 h-4" />;
      case "art": return <Paintbrush className="w-4 h-4" />;
      case "book": return <BookOpen className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (unchanged) */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <div className="text-blue-600 font-bold text-xl">Scene.Capital</div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Beta</span>
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 mx-4 max-w-xl">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search projects, creators, or assets..."
                className="bg-transparent border-none w-full focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  J
                </div>
                <span className="hidden md:inline text-sm font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Navigation Tabs (unchanged) */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === "discover" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("discover")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Discover
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === "market" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("market")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Market
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === "portfolio" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("portfolio")}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Portfolio
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === "transactions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("transactions")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Transactions
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium flex items-center ${activeTab === "creators" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("creators")}
            >
              <Users className="w-4 h-4 mr-2" />
              Creators
            </button>
          </div>
        </div>
        
        {/* Discover Tab */}
        {activeTab === "discover" && (
          <>
            {/* Hero Banner (unchanged) */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-md mb-8 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:p-8 flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Invest in Creativity</h1>
                  <p className="text-blue-100 mb-6 max-w-lg">
                    Discover, invest, and trade IP rights in film, music, books, and more. 
                    Own a piece of creative projects and earn royalties from their success.
                  </p>
                  <button className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                    Explore Top Projects
                  </button>
                </div>
                <div className="md:w-1/3 relative">
                  <img src="/api/placeholder/500/300" alt="Creative Projects" className="w-full h-48 md:h-full object-cover" />
                </div>
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    categoryFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCategoryFilter("all")}
                >
                  All Categories
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                    categoryFilter === "film" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCategoryFilter("film")}
                >
                  <Film className="w-4 h-4 mr-1" /> Film
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                    categoryFilter === "music" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCategoryFilter("music")}
                >
                  <Music className="w-4 h-4 mr-1" /> Music
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                    categoryFilter === "tv" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCategoryFilter("tv")}
                >
                  <Film className="w-4 h-4 mr-1" /> TV
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                    categoryFilter === "theater" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCategoryFilter("theater")}
                >
                  <Users className="w-4 h-4 mr-1" /> Theater
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                    categoryFilter === "art" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCategoryFilter("art")}
                >
                  <Paintbrush className="w-4 h-4 mr-1" /> Art
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                    categoryFilter === "book" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCategoryFilter("book")}
                >
                  <BookOpen className="w-4 h-4 mr-1" /> Book
                </button>
              </div>
            </div>

            {/* Status Filters */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    statusFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setStatusFilter("all")}
                >
                  All Status
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    statusFilter === "active" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setStatusFilter("active")}
                >
                  Active

                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    statusFilter === "funded" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setStatusFilter("funded")}
                >
                  Funded
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    statusFilter === "completed" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setStatusFilter("completed")}
                >
                  Completed
                </button>
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ProjectStatus)}
                >
                  <option value="all">Sort: Popularity</option>
                  <option value="funding">Funding Amount</option>
                  <option value="newest">Newest</option>
                  <option value="release">Release Date</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => renderProjectCard(project))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Market Tab */}
        {activeTab === "market" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Market Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {mockMarketTrends.map(trend => (
                <div key={trend.category} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold capitalize">{trend.category}</h3>
                    {getCategoryIcon(trend.category)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Weekly Change</span>
                      <span className={trend.weeklyChange >= 0 ? "text-green-600" : "text-red-600"}>
                        {trend.weeklyChange >= 0 ? "+" : ""}{trend.weeklyChange}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly Volume</span>
                      <span>{formatCurrency(trend.monthlyVolume)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Average Price</span>
                      <span>{formatCurrency(trend.averagePrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Total Value"
                value={formatCurrency(mockPortfolio.totalValue)}
                icon={<DollarSign className="w-5 h-5" />}
                trend={{ value: mockPortfolio.weeklyChange }}
              />
              <StatCard
                title="Holdings"
                value={mockPortfolio.holdings.length.toString()}
                icon={<Briefcase className="w-5 h-5" />}
              />
              <StatCard
                title="Weekly Change"
                value={`${mockPortfolio.weeklyChange >= 0 ? "+" : ""}${mockPortfolio.weeklyChange}%`}
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tokens</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockPortfolio.holdings.map(holding => (
                    <tr key={holding.projectId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{holding.projectTitle}</td>
                      <td className="px-4 py-3 text-sm capitalize">{holding.category}</td>
                      <td className="px-4 py-3 text-sm text-right">{holding.tokens}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(holding.value)}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span className={holding.currentPrice >= holding.purchasePrice ? "text-green-600" : "text-red-600"}>
                          {(((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
            <div className="mb-6 flex gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  transactionFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setTransactionFilter("all")}
              >
                All Transactions
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  transactionFilter === "completed" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setTransactionFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  transactionFilter === "pending" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setTransactionFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  transactionFilter === "failed" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setTransactionFilter("failed")}
              >
                Failed
              </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counterparty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(tx => renderTransactionRow(tx))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Creators Tab */}
        {activeTab === "creators" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Featured Creators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCreators.map(creator => (
                <div key={creator.id} className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
                  <img src={creator.avatar} alt={creator.name} className="w-16 h-16 rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{creator.name}</h3>
                      {creator.verified && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{creator.role}</p>
                    <div className="flex space-x-4 text-sm text-gray-500 mt-2">
                      <span>{creator.projects} Projects</span>
                      <span>{creator.followers.toLocaleString()} Followers</span>
                    </div>
                    <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}