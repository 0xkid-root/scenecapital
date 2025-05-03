"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define types for IP projects
type IpCategory = "film" | "music" | "tv" | "theater" | "art" | "books";

interface IpProject {
  id: string;
  name: string;
  creator: string;
  equity: number;
  price: number;
  royaltyRate: number;
  genre: string;
  stage: string;
}

interface IpProjectsMap {
  film: IpProject[];
  music: IpProject[];
  tv: IpProject[];
  theater: IpProject[];
  art: IpProject[];
  books: IpProject[];
}

// Mock data for IP projects across different categories
const mockIpProjects: IpProjectsMap = {
  film: [
    { id: "F001", name: "Quantum Horizon", creator: "Nova Studios", equity: 35, price: 12.75, royaltyRate: 8.5, genre: "Sci-Fi", stage: "Pre-production" },
    { id: "F002", name: "The Last Memory", creator: "Ethereal Films", equity: 20, price: 8.25, royaltyRate: 7.2, genre: "Drama", stage: "Development" },
    { id: "F003", name: "Midnight Runners", creator: "Action House", equity: 15, price: 5.50, royaltyRate: 6.8, genre: "Action", stage: "Production" },
    { id: "F004", name: "Whispers in Time", creator: "Chronos Pictures", equity: 25, price: 9.80, royaltyRate: 7.5, genre: "Mystery", stage: "Post-production" }
  ],
  music: [
    { id: "M001", name: "Harmonic Waves", creator: "Echo Collective", equity: 40, price: 3.25, royaltyRate: 12.5, genre: "Alternative", stage: "Recording" },
    { id: "M002", name: "Pulse Rhythm", creator: "Sonic Labs", equity: 30, price: 2.80, royaltyRate: 11.0, genre: "Electronic", stage: "Mastering" },
    { id: "M003", name: "Velvet Voice", creator: "Melody Records", equity: 25, price: 4.15, royaltyRate: 13.2, genre: "Soul", stage: "Released" },
    { id: "M004", name: "Urban Echoes", creator: "City Sounds", equity: 35, price: 3.75, royaltyRate: 10.8, genre: "Hip Hop", stage: "Production" }
  ],
  tv: [
    { id: "T001", name: "Beyond the Veil", creator: "Vision Networks", equity: 20, price: 7.50, royaltyRate: 9.0, genre: "Fantasy", stage: "Pilot" },
    { id: "T002", name: "Code Division", creator: "Cyber Entertainment", equity: 30, price: 11.20, royaltyRate: 8.7, genre: "Tech Thriller", stage: "Season 1" },
    { id: "T003", name: "Family Matters", creator: "Homefront Studios", equity: 25, price: 6.40, royaltyRate: 7.5, genre: "Sitcom", stage: "Season 2" },
    { id: "T004", name: "Medical Frontiers", creator: "Pulse TV", equity: 15, price: 5.30, royaltyRate: 6.9, genre: "Medical Drama", stage: "Development" }
  ],
  theater: [
    { id: "TH001", name: "Whispers of the Stage", creator: "Curtain Call", equity: 40, price: 5.25, royaltyRate: 10.5, genre: "Drama", stage: "Writing" },
    { id: "TH002", name: "Midnight Sonata", creator: "Broadway Dreams", equity: 30, price: 4.75, royaltyRate: 9.8, genre: "Musical", stage: "Rehearsal" },
    { id: "TH003", name: "The Comedy of Truth", creator: "Jester Productions", equity: 25, price: 3.90, royaltyRate: 8.5, genre: "Comedy", stage: "Running" },
    { id: "TH004", name: "Historical Echoes", creator: "Timeline Theater", equity: 35, price: 4.50, royaltyRate: 9.0, genre: "Historical", stage: "Pre-production" }
  ],
  art: [
    { id: "A001", name: "Digital Dreams Collection", creator: "Nova Art", equity: 50, price: 6.25, royaltyRate: 15.0, genre: "Digital", stage: "Creation" },
    { id: "A002", name: "Abstract Perspectives", creator: "Vision Gallery", equity: 40, price: 8.50, royaltyRate: 14.2, genre: "Abstract", stage: "Exhibition" },
    { id: "A003", name: "Nature's Canvas", creator: "Earth Tones", equity: 30, price: 7.75, royaltyRate: 13.5, genre: "Landscape", stage: "Completed" },
    { id: "A004", name: "Urban Expressions", creator: "City Arts", equity: 45, price: 9.20, royaltyRate: 14.8, genre: "Street Art", stage: "In Progress" }
  ],
  books: [
    { id: "B001", name: "The Quantum Paradox", creator: "Sci-Fi Press", equity: 25, price: 4.30, royaltyRate: 11.0, genre: "Science Fiction", stage: "Writing" },
    { id: "B002", name: "Echoes of the Past", creator: "Historical House", equity: 20, price: 3.75, royaltyRate: 10.5, genre: "Historical Fiction", stage: "Editing" },
    { id: "B003", name: "Murder in the Shadows", creator: "Mystery Books", equity: 30, price: 5.20, royaltyRate: 12.0, genre: "Mystery", stage: "Publishing" },
    { id: "B004", name: "Poetic Journeys", creator: "Verse Publications", equity: 35, price: 2.90, royaltyRate: 13.5, genre: "Poetry", stage: "Released" }
  ]
};

interface PriceHistoryPoint {
  date: string;
  price: number;
}

// Mock price history data for charts
const generatePriceHistory = (basePrice: number): PriceHistoryPoint[] => {
  const data: PriceHistoryPoint[] = [];
  let price = basePrice;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation to the price
    price = price + (Math.random() * 0.4 - 0.2) * price;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return data;
};

export function OrderManagement() {
  const [selectedCategory, setSelectedCategory] = useState<IpCategory>("film");
  const [selectedProject, setSelectedProject] = useState<IpProject | null>(null);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState(1);
  const [orderPrice, setOrderPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [sliderValue, setSliderValue] = useState<number[]>([50]);

  // Update selected project and its price history when a project is selected
  const handleProjectSelect = (projectId: string) => {
    const project = mockIpProjects[selectedCategory].find(p => p.id === projectId);
    setSelectedProject(project || null);
    setOrderPrice(project ? project.price : 0);
    setPriceHistory(generatePriceHistory(project ? project.price : 5));
  };

  // Calculate total order value
  const totalOrderValue = selectedProject ? (orderPrice * quantity).toFixed(2) : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
          <CardDescription>
            Trade IP rights for creative projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select 
              value={selectedCategory} 
              onValueChange={(value: IpCategory) => {
                setSelectedCategory(value);
                setSelectedProject(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>IP Categories</SelectLabel>
                  <SelectItem value="film">Film</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="tv">TV</SelectItem>
                  <SelectItem value="theater">Theater</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project</label>
            <Select 
              disabled={!selectedCategory}
              onValueChange={handleProjectSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Projects` : "Projects"}</SelectLabel>
                  {selectedCategory && mockIpProjects[selectedCategory].map((project) => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order Type</label>
            <Tabs value={orderType} onValueChange={(value: any) => setOrderType(value as "buy" | "sell")} className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input 
              type="number" 
              min="1"
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Price ($)</label>
              <span className="text-sm text-gray-500">
                Market: ${selectedProject ? selectedProject.price.toFixed(2) : "0.00"}
              </span>
            </div>
            <Input 
              type="number" 
              min="0.01" 
              step="0.01"
              value={orderPrice} 
              onChange={(e) => setOrderPrice(parseFloat(e.target.value) || 0)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Position Size (% of Portfolio)</label>
            <div className="pt-6 pb-2">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
              />
            </div>
            <div className="text-right text-sm text-gray-500">
              {sliderValue}%
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Total Value:</span>
              <span className="font-semibold">${totalOrderValue}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Fees:</span>
              <span className="font-semibold">${(totalOrderValue * 0.025).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span className="font-semibold">${(parseFloat(totalOrderValue) + parseFloat((parseFloat(totalOrderValue) * 0.025).toFixed(2))).toFixed(2)}</span>
            </div>
          </div>

          <Button 
            className="w-full" 
            disabled={!selectedProject}
          >
            {orderType === "buy" ? "Buy IP Shares" : "Sell IP Shares"}
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Information about the selected IP project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedProject ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedProject.name}</h3>
                  <p className="text-gray-500">ID: {selectedProject.id}</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Creator:</span>
                      <span className="text-sm font-medium">{selectedProject.creator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Genre:</span>
                      <span className="text-sm font-medium">{selectedProject.genre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Stage:</span>
                      <span className="text-sm font-medium">
                        <Badge variant="outline">{selectedProject.stage}</Badge>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Available Equity:</span>
                      <span className="text-sm font-medium">{selectedProject.equity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Royalty Rate:</span>
                      <span className="text-sm font-medium">{selectedProject.royaltyRate}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Price History (30 days)</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          interval={6}
                        />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recent Trades</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, index) => {
                      const date = new Date();
                      date.setHours(date.getHours() - index * 4);
                      const randomPrice = (selectedProject.price + (Math.random() * 0.4 - 0.2) * selectedProject.price).toFixed(2);
                      const randomQuantity = Math.floor(Math.random() * 10) + 1;
                      const type = Math.random() > 0.5 ? "Buy" : "Sell";
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>{date.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={type === "Buy" ? "default" : "secondary"}>
                              {type}
                            </Badge>
                          </TableCell>
                          <TableCell>{randomQuantity}</TableCell>
                          <TableCell>${randomPrice}</TableCell>
                          <TableCell>${(randomPrice * randomQuantity).toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-gray-500">Select a project to view details</p>
              <p className="text-sm text-gray-400 mt-2">Browse IP projects across film, music, TV, theater, art, and books</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}