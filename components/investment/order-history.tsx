"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Download, Eye, Filter, MoreHorizontal, RefreshCw, Search, Share2, Sliders } from "lucide-react";
import { getOrders, cancelOrder, Order as ApiOrder } from "@/lib/api-services/orders";

// Define order interface for the component
interface Order {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  assetCategory: string;
  creator: string;
  quantity: number;
  price: string;
  amount: string;
  status: "completed" | "pending" | "failed" | "canceled";
  type: "buy" | "sell";
  txHash?: string;
}

// Map API order status to UI status
const mapApiStatusToUiStatus = (apiStatus: string): "completed" | "pending" | "failed" | "canceled" => {
  switch (apiStatus) {
    case "filled":
      return "completed";
    case "open":
    case "partial":
      return "pending";
    case "expired":
      return "failed";
    case "cancelled":
      return "canceled";
    default:
      return "pending";
  }
};

// Convert API order to UI order
const convertApiOrderToUiOrder = (apiOrder: ApiOrder): Order => {
  return {
    id: apiOrder.id,
    date: new Date(apiOrder.createdAt).toISOString().split('T')[0],
    assetId: apiOrder.asset.id,
    assetName: apiOrder.asset.name,
    assetCategory: apiOrder.asset.category,
    creator: "Unknown", // API doesn't provide creator info
    quantity: apiOrder.quantity,
    price: apiOrder.price.toString(),
    amount: apiOrder.total.toString(),
    status: mapApiStatusToUiStatus(apiOrder.status),
    type: apiOrder.type,
    txHash: apiOrder.transactionHash
  };
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Fetch orders from API
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Map UI status filter to API status
      let apiStatus: string | undefined;
      if (statusFilter !== "all") {
        switch (statusFilter) {
          case "completed":
            apiStatus = "filled";
            break;
          case "pending":
            apiStatus = "open";
            break;
          case "failed":
            apiStatus = "expired";
            break;
          case "canceled":
            apiStatus = "cancelled";
            break;
        }
      }

      // Prepare API params
      const params: any = {
        page,
        limit: 10
      };

      if (typeFilter !== "all") {
        params.type = typeFilter;
      }

      if (apiStatus) {
        params.status = apiStatus;
      }

      // Call API
      const response = await getOrders(params);
      
      if (response.success && response.data) {
        // Convert API orders to UI orders
        const uiOrders = response.data.orders.map(convertApiOrderToUiOrder);
        setOrders(uiOrders);
        
        // Set pagination info
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
        }
      } else {
        toast({
          title: "Error fetching orders",
          description: response.message || "Failed to load orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, typeFilter]);

  // Filter orders based on search term and date filter
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.assetName.toLowerCase().includes(searchTerm.toLowerCase());

    // Date filter
    const matchesDate = !selectedDate || 
      format(new Date(order.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

    return matchesSearch && matchesDate;
  });

  const refreshOrders = () => {
    fetchOrders();
    toast({
      title: "Orders refreshed",
      description: "Latest order data has been loaded",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSelectedDate(undefined);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "failed":
        return "bg-red-500 hover:bg-red-600";
      case "canceled":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "buy":
        return "bg-blue-500 hover:bg-blue-600";
      case "sell":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and manage your IP asset orders</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshOrders}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => clearFilters()}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="buy">Buy Orders</SelectItem>
              <SelectItem value="sell">Sell Orders</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal w-full"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-md">
                          <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                            {order.assetName.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{order.assetName}</p>
                          <p className="text-xs text-muted-foreground">{order.assetCategory}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${order.price}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${getTypeColor(order.type)} text-white`}>
                        {order.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {order.txHash && (
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              View Transaction
                            </DropdownMenuItem>
                          )}
                          {order.status === "pending" && (
                            <DropdownMenuItem className="text-red-500">
                              Cancel Order
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No orders found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t px-6 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}