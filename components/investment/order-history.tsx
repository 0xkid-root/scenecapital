"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

// Define types for the order history component
type OrderCategory = "film" | "music" | "tv" | "theater" | "art" | "books";
type OrderStatus = "completed" | "pending" | "cancelled";
type OrderType = "buy" | "sell";

interface Project {
  id: string;
  name: string;
  creator: string;
}

interface ProjectsMap {
  film: Project[];
  music: Project[];
  tv: Project[];
  theater: Project[];
  art: Project[];
  books: Project[];
}

interface Order {
  id: string;
  date: Date;
  category: OrderCategory;
  projectId: string;
  projectName: string;
  creator: string;
  status: OrderStatus;
  type: OrderType;
  quantity: number;
  price: string;
  total: string;
  fees: string;
}

interface PortfolioItem {
  name: string;
  value: number;
}

// Mock data for order history
const generateOrderHistory = (): Order[] => {
  const categories: OrderCategory[] = ["film", "music", "tv", "theater", "art", "books"];
  const statuses: OrderStatus[] = ["completed", "pending", "cancelled"];
  const orderTypes: OrderType[] = ["buy", "sell"];
  
  const mockProjects: ProjectsMap = {
    film: [
      { id: "F001", name: "Quantum Horizon", creator: "Nova Studios" },
      { id: "F002", name: "The Last Memory", creator: "Ethereal Films" },
      { id: "F003", name: "Midnight Runners", creator: "Action House" },
      { id: "F004", name: "Whispers in Time", creator: "Chronos Pictures" }
    ],
    music: [
      { id: "M001", name: "Harmonic Waves", creator: "Echo Collective" },
      { id: "M002", name: "Pulse Rhythm", creator: "Sonic Labs" },
      { id: "M003", name: "Velvet Voice", creator: "Melody Records" },
      { id: "M004", name: "Urban Echoes", creator: "City Sounds" }
    ],
    tv: [
      { id: "T001", name: "Beyond the Veil", creator: "Vision Networks" },
      { id: "T002", name: "Code Division", creator: "Cyber Entertainment" },
      { id: "T003", name: "Family Matters", creator: "Homefront Studios" },
      { id: "T004", name: "Medical Frontiers", creator: "Pulse TV" }
    ],
    theater: [
      { id: "TH001", name: "Whispers of the Stage", creator: "Curtain Call" },
      { id: "TH002", name: "Midnight Sonata", creator: "Broadway Dreams" },
      { id: "TH003", name: "The Comedy of Truth", creator: "Jester Productions" },
      { id: "TH004", name: "Historical Echoes", creator: "Timeline Theater" }
    ],
    art: [
      { id: "A001", name: "Digital Dreams Collection", creator: "Nova Art" },
      { id: "A002", name: "Abstract Perspectives", creator: "Vision Gallery" },
      { id: "A003", name: "Nature's Canvas", creator: "Earth Tones" },
      { id: "A004", name: "Urban Expressions", creator: "City Arts" }
    ],
    books: [
      { id: "B001", name: "The Quantum Paradox", creator: "Sci-Fi Press" },
      { id: "B002", name: "Echoes of the Past", creator: "Historical House" },
      { id: "B003", name: "Murder in the Shadows", creator: "Mystery Books" },
      { id: "B004", name: "Poetic Journeys", creator: "Verse Publications" }
    ]
  };
  
  const orders: Order[] = [];
  for (let i = 0; i < 50; i++) {
    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Pick a random category and project
    const category = categories[Math.floor(Math.random() * categories.length)];
    const projectsForCategory = mockProjects[category];
    const project = projectsForCategory[Math.floor(Math.random() * projectsForCategory.length)];
    
    // Generate other random order details
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const price = (Math.random() * 10 + 2).toFixed(2);
    const total = (quantity * parseFloat(price)).toFixed(2);
    
    orders.push({
      id: `ORD-${10000 + i}`,
      date: date,
      category: category,
      projectId: project.id,
      projectName: project.name,
      creator: project.creator,
      status: status,
      type: orderType,
      quantity: quantity,
      price: price,
      total: total,
      fees: (parseFloat(total) * 0.025).toFixed(2),
    });
  }
  
  // Sort by date (newest first)
  return orders.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const mockOrderHistory = generateOrderHistory();

// Generate portfolio data based on completed orders
const generatePortfolioData = (orders: Order[]): PortfolioItem[] => {
  const completedOrders = orders.filter(order => order.status === "completed");
  const portfolio: Record<string, number> = {};
  
  completedOrders.forEach(order => {
    const key = order.category;
    
    if (order.type === "buy") {
      if (!portfolio[key]) {
        portfolio[key] = 0;
      }
      portfolio[key] += parseFloat(order.total);
    } else if (order.type === "sell") {
      if (!portfolio[key]) {
        portfolio[key] = 0;
      }
      portfolio[key] -= parseFloat(order.total);
    }
  });
  
  // Ensure all values are positive for display purposes
  Object.keys(portfolio).forEach(key => {
    if (portfolio[key] < 0) {
      portfolio[key] = Math.abs(portfolio[key]) * 0.2; // Just to ensure we have some data to show
    }
  });
  
  return Object.entries(portfolio).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2))
  }));
};

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export function OrderHistory() {
  const [orders, setOrders] = useState(mockOrderHistory);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  // Generate portfolio data based on orders
  const portfolioData = generatePortfolioData(orders);
  
  // Filter orders based on selected filters
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (selectedStatus && order.status !== selectedStatus) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory && order.category !== selectedCategory) {
      return false;
    }
    
    // Filter by date range
    if (selectedDateRange.from && selectedDateRange.to) {
      const orderDate = new Date(order.date);
      const fromDate = new Date(selectedDateRange.from);
      const toDate = new Date(selectedDateRange.to);
      if (orderDate < fromDate || orderDate > toDate) {
        return false;
      }
    }
    
    // Filter by search term (project name or order ID)
    if (searchTerm && !order.projectName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };
  
  // Apply filters
  const applyFilters = () => {
    handleFilterChange();
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedStatus("");
    setSelectedCategory("");
    setSelectedDateRange({ from: undefined, to: undefined });
    setSearchTerm("");
    handleFilterChange();
  };
  
  // Status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case "completed": return "secondary";
      case "pending": return "outline";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View and manage your previous orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search by project name or order ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="film">Film</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="tv">TV</SelectItem>
                    <SelectItem value="theater">Theater</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.projectName}</TableCell>
                      <TableCell>{order.creator}</TableCell>
                      <TableCell>{order.category}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>${order.price}</TableCell>
                      <TableCell>${order.total}</TableCell>
                      <TableCell>${order.fees}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}