'use client';

import { useState } from 'react';
import { RoyaltyTracking } from "@/components/dashboard/royalty-tracking";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, Filter, Calendar, ArrowUpDown, Search, 
  TrendingUp, ChevronDown, BarChart3, PieChart, Globe, FileText, 
  Settings, Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RoyaltiesPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');

  // Define activity status type
  type ActivityStatus = 'processed' | 'pending';

  // Sample data for visualization
  const recentActivity = [
    { id: 1, platform: 'Spotify', amount: '+$1,245.32', date: 'Today', status: 'processed' as ActivityStatus },
    { id: 2, platform: 'Apple Music', amount: '+$876.19', date: 'Yesterday', status: 'pending' as ActivityStatus },
    { id: 3, platform: 'YouTube', amount: '+$523.67', date: '2 days ago', status: 'processed' as ActivityStatus }
  ];

  const getStatusColor = (status: ActivityStatus): string => {
    return status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-64 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-40" />
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl opacity-40" />
      </div>

      <div className="container mx-auto p-4 md:p-6 relative z-10">
        {/* Top navigation bar */}
        <div className="flex items-center justify-between mb-6 bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-border/50 shadow-sm">
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search royalties, projects..." 
                className="pl-10 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full border-2 border-background" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Royalty Income</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Pro</Badge>
            </div>
            <p className="text-muted-foreground mt-1">Track, analyze and optimize your IP licensing revenue</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {dateRange === '7d' && 'Last 7 Days'}
                  {dateRange === '30d' && 'Last 30 Days'}
                  {dateRange === '90d' && 'Last 90 Days'}
                  {dateRange === 'ytd' && 'Year to Date'}
                  {dateRange === 'custom' && 'Custom Range'}
                  <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Select Time Range</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDateRange('7d')}>Last 7 Days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('30d')}>Last 30 Days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('90d')}>Last 90 Days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('ytd')}>Year to Date</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateRange('custom')}>Custom Range...</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4 mr-1" />
                  <span>Filter</span>
                  <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>By Platform</DropdownMenuItem>
                <DropdownMenuItem>By Project</DropdownMenuItem>
                <DropdownMenuItem>By Territory</DropdownMenuItem>
                <DropdownMenuItem>By Payment Status</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4 mr-1" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings (YTD)</p>
                  <h3 className="text-2xl font-bold mt-1">$124,567.89</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">+12.5%</span>
                    <span className="text-xs text-muted-foreground">vs prev. period</span>
                  </div>
                </div>
                <div className="bg-primary/10 p-2 rounded-md">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <h3 className="text-2xl font-bold mt-1">$24,839.45</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">+8.3%</span>
                    <span className="text-xs text-muted-foreground">vs prev. month</span>
                  </div>
                </div>
                <div className="bg-blue-500/10 p-2 rounded-md">
                  <PieChart className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <h3 className="text-2xl font-bold mt-1">27</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm font-medium">Top: Music Library Pro</span>
                  </div>
                </div>
                <div className="bg-purple-500/10 p-2 rounded-md">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Platforms</p>
                  <h3 className="text-2xl font-bold mt-1">12</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm font-medium">Top: Spotify</span>
                  </div>
                </div>
                <div className="bg-green-500/10 p-2 rounded-md">
                  <Globe className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border border-border/50 bg-card/80 backdrop-blur-sm mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest royalty payments and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-background rounded-md border border-border/30 hover:border-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                      {activity.platform === 'Spotify' && <BarChart3 className="h-5 w-5 text-primary" />}
                      {activity.platform === 'Apple Music' && <PieChart className="h-5 w-5 text-blue-500" />}
                      {activity.platform === 'YouTube' && <Globe className="h-5 w-5 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.platform}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-green-600">{activity.amount}</p>
                    <Badge variant="secondary" className={getStatusColor(activity.status)}>
                      {activity.status === 'processed' ? 'Processed' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-1 border border-border/50 w-fit">
            <TabsList className="grid grid-cols-4 md:grid-cols-4 gap-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="platforms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Globe className="h-4 w-4 mr-2" />
                Platforms
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <PieChart className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-6">
            <Card className="border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-center">
                  <CardTitle>Royalty Performance</CardTitle>
                  <Select defaultValue="earnings">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="View by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earnings">Earnings</SelectItem>
                      <SelectItem value="streams">Streams</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <RoyaltyTracking />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card className="border border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-center">
                  <CardTitle>Royalties by Project</CardTitle>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="h-4 w-4 mr-1" />
                      Sort
                    </Button>
                  </div>
                </div>
                <CardDescription>Detailed breakdown of royalty income by individual project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border/50 bg-background p-4">
                  <p className="text-center text-muted-foreground">Select your filters to view project performance</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="platforms">
            <Card className="border border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-center">
                  <CardTitle>Royalties by Platform</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>
                <CardDescription>Analyze your royalty income across different distribution platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border/50 bg-background p-4">
                  <p className="text-center text-muted-foreground">Customize your platform analysis view</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card className="border border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-center">
                  <CardTitle>Royalty Reports</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Generate Report
                  </Button>
                </div>
                <CardDescription>Generate and download detailed royalty reports for accounting and tax purposes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border/50 bg-background p-4">
                  <p className="text-center text-muted-foreground">Select report type and parameters to generate</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}