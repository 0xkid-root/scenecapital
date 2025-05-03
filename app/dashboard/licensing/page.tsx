'use client';

import { useState, useMemo } from 'react';
import { LicensingDeals } from '@/components/dashboard/licensing-deals';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import {
  Plus,
  Filter,
  Calendar,
  FileSignature,
  MoreHorizontal,
  Download,
  Copy,
  Trash2,
  Search,
  ArrowUpDown,
  Check,
  AlertCircle,
  FileText,
  Building,
  DollarSign,
  Clock,
  Percent,
  Info,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Deal {
  id: string;
  name: string;
  company: string;
  logo: string;
  type: string;
  value: string;
  startDate: string;
  endDate: string;
  royaltyRate: string;
  status: 'active' | 'pending' | 'negotiation' | 'expired';
  terms?: string;
}

interface Template {
  id: string;
  name: string;
  type: string;
  terms: string;
}

export default function LicensingPage() {
  // State management
  const [newDealOpen, setNewDealOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'value' | 'endDate' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [newDealData, setNewDealData] = useState({
    name: '',
    company: '',
    type: '',
    value: '',
    royaltyRate: '',
    startDate: '',
    endDate: '',
    terms: '',
    status: 'active' as Deal['status'],
  });
  const [newTemplateData, setNewTemplateData] = useState({
    name: '',
    type: '',
    terms: '',
    isEdit: false,
    editId: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [templateErrors, setTemplateErrors] = useState<{ [key: string]: string }>({});
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { toast } = useToast();

  // Sample data
  const [activeDeals, setActiveDeals] = useState<Deal[]>([
    {
      id: 'deal-001',
      name: 'Global Streaming Rights',
      company: 'StreamFlix Entertainment',
      logo: '/company-logos/streamflix.png',
      type: 'Distribution',
      value: '$450,000',
      startDate: 'Jan 15, 2025',
      endDate: 'Jan 14, 2026',
      royaltyRate: '12%',
      status: 'active',
    },
    {
      id: 'deal-002',
      name: 'European Theater Distribution',
      company: 'CineTech Holdings',
      logo: '/company-logos/cinetech.png',
      type: 'Exhibition',
      value: '$275,000',
      startDate: 'Mar 1, 2025',
      endDate: 'Feb 28, 2026',
      royaltyRate: '8%',
      status: 'active',
    },
  ]);

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'template-001',
      name: 'Standard Distribution Template',
      type: 'Distribution',
      terms: 'Standard terms for content distribution with quarterly royalty payments.',
    },
    {
      id: 'template-002',
      name: 'Exhibition Template',
      type: 'Exhibition',
      terms: 'Terms for theatrical exhibition with fixed royalty rate.',
    },
  ]);

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

  // Toast notifications
  const showSuccessToast = (message: string) => {
    toast({ title: 'Success', description: message, variant: 'default' });
  };

  const showErrorToast = (message: string) => {
    toast({ title: 'Error', description: message, variant: 'destructive' });
  };

  // Search and sort deals
  const filteredDeals = useMemo(() => {
    let deals = [...activeDeals];
    if (searchQuery) {
      deals = deals.filter(
        (deal) =>
          deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortField) {
      deals.sort((a, b) => {
        const aValue = sortField === 'value' ? parseFloat(a.value.replace('$', '').replace(',', '')) : a.endDate;
        const bValue = sortField === 'value' ? parseFloat(b.value.replace('$', '').replace(',', '')) : b.endDate;
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });
    }
    return deals;
  }, [activeDeals, searchQuery, sortField, sortDirection]);

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newDealData.name) newErrors.name = 'Deal name is required';
    if (!newDealData.company) newErrors.company = 'Company name is required';
    if (!newDealData.type) newErrors.type = 'Deal type is required';
    if (!newDealData.value || !/^\$?\d+(,\d{3})*(\.\d+)?$/.test(newDealData.value))
      newErrors.value = 'Valid deal value is required (e.g., $100,000)';
    if (!newDealData.royaltyRate || !/^\d+(\.\d+)?%$/.test(newDealData.royaltyRate))
      newErrors.royaltyRate = 'Valid royalty rate is required (e.g., 10%)';
    if (!newDealData.startDate) newErrors.startDate = 'Start date is required';
    if (!newDealData.endDate) newErrors.endDate = 'End date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle actions
  const handleCreateDeal = () => {
    if (!validateForm()) {
      showErrorToast('Please fix the form errors before submitting.');
      return;
    }
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      ...newDealData,
      logo: '/company-logos/default.png',
    };
    setActiveDeals([...activeDeals, newDeal]);
    setNewDealOpen(false);
    setNewDealData({
      name: '',
      company: '',
      type: '',
      value: '',
      royaltyRate: '',
      startDate: '',
      endDate: '',
      terms: '',
      status: 'active',
    });
    showSuccessToast(`New ${newDealData.status} deal created successfully!`);
  };

  const handleDeleteDeal = (dealId: string) => {
    setActiveDeals(activeDeals.filter((deal) => deal.id !== dealId));
    setConfirmDialogOpen(false);
    showSuccessToast('Deal deleted successfully!');
  };

  const handleRenewDeal = (deal: Deal) => {
    const newEndDate = new Date(deal.endDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    setActiveDeals(
      activeDeals.map((d) =>
        d.id === deal.id ? { ...d, endDate: newEndDate.toLocaleDateString('en-US') } : d
      )
    );
    showSuccessToast('Deal renewed successfully!');
  };

  const validateTemplateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!newTemplateData.name) newErrors.name = 'Template name is required';
    if (!newTemplateData.type) newErrors.type = 'Deal type is required';
    if (!newTemplateData.terms) newErrors.terms = 'Template terms are required';
    
    setTemplateErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTemplate = () => {
    if (!validateTemplateForm()) {
      showErrorToast('Please fix the form errors before submitting.');
      return;
    }
    
    if (newTemplateData.isEdit && newTemplateData.editId) {
      // Update existing template
      setTemplates(templates.map(template => 
        template.id === newTemplateData.editId ? {
          ...template,
          name: newTemplateData.name,
          type: newTemplateData.type,
          terms: newTemplateData.terms
        } : template
      ));
      showSuccessToast('Template updated successfully!');
    } else {
      // Create new template
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: newTemplateData.name,
        type: newTemplateData.type,
        terms: newTemplateData.terms,
      };
      setTemplates([...templates, newTemplate]);
      showSuccessToast('Template created successfully!');
    }
    
    // Reset form and close dialog
    setTemplateDialogOpen(false);
    setNewTemplateData({
      name: '',
      type: '',
      terms: '',
      isEdit: false,
      editId: ''
    });
  };

  const handleApplyTemplate = (template: Template) => {
    setNewDealData({
      ...newDealData,
      type: template.type,
      terms: template.terms,
    });
    setSelectedTemplate(null);
    setNewDealOpen(true);
  };
  
  const handleEditTemplate = (template: Template) => {
    setNewTemplateData({
      name: template.name,
      type: template.type,
      terms: template.terms,
      isEdit: true,
      editId: template.id
    });
    setTemplateDialogOpen(true);
  };

  const handleSort = (field: 'value' | 'endDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(activeDeals, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'licensing-deals.json';
    link.click();
    URL.revokeObjectURL(url);
    showSuccessToast('Deals exported successfully!');
  };

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen bg-background">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-6"
      >
        {/* Page Header */}
        <motion.div
          variants={item}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Licensing Deals
            </h1>
            <p className="text-muted-foreground">
              Manage your IP licensing agreements and partnerships
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={newDealOpen} onOpenChange={setNewDealOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  New Deal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Licensing Deal</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new licensing agreement.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="deal-name" className="text-right">
                        Deal Name
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="deal-name"
                          placeholder="Enter deal name"
                          value={newDealData.name}
                          onChange={(e) =>
                            setNewDealData({ ...newDealData, name: e.target.value })
                          }
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="company" className="text-right">
                        Company
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="company"
                          placeholder="Enter company name"
                          value={newDealData.company}
                          onChange={(e) =>
                            setNewDealData({ ...newDealData, company: e.target.value })
                          }
                          className={errors.company ? 'border-red-500' : ''}
                        />
                        {errors.company && (
                          <p className="text-red-500 text-xs mt-1">{errors.company}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="deal-type" className="text-right">
                        Deal Type
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={newDealData.type}
                          onValueChange={(value) =>
                            setNewDealData({ ...newDealData, type: value })
                          }
                        >
                          <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select deal type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distribution">Distribution</SelectItem>
                            <SelectItem value="exhibition">Exhibition</SelectItem>
                            <SelectItem value="merchandise">Merchandise</SelectItem>
                            <SelectItem value="streaming">Streaming</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={newDealData.status}
                          onValueChange={(value) =>
                            setNewDealData({ ...newDealData, status: value as Deal['status'] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="negotiation">In Negotiation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {/* Financials */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Financial Details</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="text-right flex items-center gap-1">
                        Deal Value
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Enter the total value of the deal (e.g., $100,000)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="col-span-3 relative">
                        <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="value"
                          placeholder="Enter deal value"
                          value={newDealData.value}
                          onChange={(e) =>
                            setNewDealData({ ...newDealData, value: e.target.value })
                          }
                          className={`pl-8 ${errors.value ? 'border-red-500' : ''}`}
                        />
                        {errors.value && (
                          <p className="text-red-500 text-xs mt-1">{errors.value}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="royalty" className="text-right flex items-center gap-1">
                        Royalty Rate
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Enter the royalty percentage (e.g., 10%)
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="col-span-3 relative">
                        <Percent className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="royalty"
                          placeholder="Enter royalty percentage"
                          value={newDealData.royaltyRate}
                          onChange={(e) =>
                            setNewDealData({ ...newDealData, royaltyRate: e.target.value })
                          }
                          className={`pl-8 ${errors.royaltyRate ? 'border-red-500' : ''}`}
                        />
                        {errors.royaltyRate && (
                          <p className="text-red-500 text-xs mt-1">{errors.royaltyRate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Dates */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Timeline</h3>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Start Date</Label>
                      <div className="col-span-3">
                        <DatePicker
                          date={newDealData.startDate ? new Date(newDealData.startDate) : undefined}
                          setDate={(date) =>
                            setNewDealData({ ...newDealData, startDate: date ? date.toLocaleDateString('en-US') : '' })
                          }
                        />
                        {errors.startDate && (
                          <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">End Date</Label>
                      <div className="col-span-3">
                        <DatePicker
                          date={newDealData.endDate ? new Date(newDealData.endDate) : undefined}
                          setDate={(date) =>
                            setNewDealData({ ...newDealData, endDate: date ? date.toLocaleDateString('en-US') : '' })
                          }
                        />
                        {errors.endDate && (
                          <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Terms */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Terms</h3>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="terms" className="text-right">
                        Terms
                      </Label>
                      <Textarea
                        id="terms"
                        placeholder="Enter deal terms and conditions"
                        value={newDealData.terms}
                        onChange={(e) =>
                          setNewDealData({ ...newDealData, terms: e.target.value })
                        }
                        className="col-span-3"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewDealOpen(false);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDeal}>Create Deal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter Licensing Deals</DialogTitle>
                  <DialogDescription>
                    Set criteria to filter the displayed licensing deals.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="filter-type">Deal Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="distribution">Distribution</SelectItem>
                        <SelectItem value="exhibition">Exhibition</SelectItem>
                        <SelectItem value="merchandise">Merchandise</SelectItem>
                        <SelectItem value="streaming">Streaming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-value">Min Deal Value</Label>
                    <div className="relative">
                      <DollarSign className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input id="filter-value" placeholder="Minimum value" className="pl-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="flex items-center gap-2">
                      <Input type="date" placeholder="Start" />
                      <span>to</span>
                      <Input type="date" placeholder="End" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filter-status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="negotiation">In Negotiation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
                    Reset
                  </Button>
                  <Button
                    onClick={() => {
                      setFilterDialogOpen(false);
                      showSuccessToast('Filters applied successfully!');
                    }}
                  >
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search deals..."
                className="pl-9 w-[200px] md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={item}>
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="bg-card shadow-sm rounded-lg">
              <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Active Deals
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Pending
              </TabsTrigger>
              <TabsTrigger value="negotiation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                In Negotiation
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Templates
              </TabsTrigger>
              <TabsTrigger value="deals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Deals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        Active Licensing Deals
                      </CardTitle>
                      <CardDescription>
                        Currently active licensing agreements and partnerships
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={handleExport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">Deal</th>
                          <th className="h-12 px-4 text-left font-medium">Type</th>
                          <th className="h-12 px-4 text-left font-medium">
                            <button
                              className="flex items-center gap-1"
                              onClick={() => handleSort('value')}
                            >
                              Value
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="h-12 px-4 text-left font-medium">Royalty</th>
                          <th className="h-12 px-4 text-left font-medium">
                            <button
                              className="flex items-center gap-1"
                              onClick={() => handleSort('endDate')}
                            >
                              Expires
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </th>
                          <th className="h-12 px-4 text-center font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDeals.map((deal) => (
                          <tr
                            key={deal.id}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={deal.logo} alt={deal.company} />
                                  <AvatarFallback>{deal.company.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{deal.name}</div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <Building className="h-3 w-3 mr-1" />
                                    {deal.company}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="font-normal">
                                {deal.type}
                              </Badge>
                            </td>
                            <td className="p-4 font-medium">{deal.value}</td>
                            <td className="p-4">{deal.royaltyRate}</td>
                            <td className="p-4">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {deal.endDate}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>{deal.name}</DialogTitle>
                                      <DialogDescription>
                                        Licensing agreement with {deal.company}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-6 py-4">
                                      <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                          Deal Information
                                        </h3>
                                        <div className="space-y-3">
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">Type:</span>
                                            <Badge variant="outline">{deal.type}</Badge>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">Value:</span>
                                            <span className="font-medium">{deal.value}</span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">Royalty:</span>
                                            <span>{deal.royaltyRate}</span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">Status:</span>
                                            <Badge variant="default">{deal.status}</Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                          Timeline
                                        </h3>
                                        <div className="space-y-3">
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">Start Date:</span>
                                            <span>{deal.startDate}</span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">End Date:</span>
                                            <span>{deal.endDate}</span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">Duration:</span>
                                            <span>12 months</span>
                                          </div>
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">Renewal:</span>
                                            <span>Automatic</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-span-2">
                                        <h3 className="font-medium text-sm text-muted-foreground mb-2">
                                          Deal Terms
                                        </h3>
                                        <div className="bg-muted/50 p-3 rounded-md text-sm">
                                          <p>{deal.terms || 'No terms specified.'}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter className="gap-2">
                                      <Button
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={() => showSuccessToast('Contract view triggered!')}
                                      >
                                        <FileText className="h-4 w-4 mr-2" />
                                        View Contract
                                      </Button>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="outline">Actions</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => handleRenewDeal(deal)}>
                                            Renew Deal
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setNewDealData({
                                                name: deal.name,
                                                company: deal.company,
                                                type: deal.type,
                                                value: deal.value,
                                                royaltyRate: deal.royaltyRate,
                                                startDate: deal.startDate,
                                                endDate: deal.endDate,
                                                terms: deal.terms || '',
                                                status: deal.status
                                              });
                                              setNewDealOpen(true);
                                            }}
                                          >
                                            Amend Terms
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => showSuccessToast('Report requested!')}
                                          >
                                            Request Report
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => setConfirmDialogOpen(true)}
                                          >
                                            Terminate Deal
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => showSuccessToast('Contract view triggered!')}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      View Contract
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRenewDeal(deal)}>
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Renew Deal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setNewDealData({
                                          name: deal.name,
                                          company: deal.company,
                                          type: deal.type,
                                          value: deal.value,
                                          royaltyRate: deal.royaltyRate,
                                          startDate: deal.startDate,
                                          endDate: deal.endDate,
                                          terms: deal.terms || '',
                                          status: deal.status
                                        });
                                        setNewDealOpen(true);
                                      }}
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => setConfirmDialogOpen(true)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Confirm Action</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to{' '}
                                        {deal.status === 'active' ? 'terminate' : 'delete'} this deal? This
                                        action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setConfirmDialogOpen(false)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteDeal(deal.id)}
                                      >
                                        {deal.status === 'active' ? 'Terminate' : 'Delete'}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Deal Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileSignature className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Global Streaming Rights deal updated
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Amended payment schedule to bi-annual
                        </p>
                        <p className="text-xs text-muted-foreground">3 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Payment received from CineTech Holdings
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Q1 royalty payment of $68,750
                        </p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card className="p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h2 className="text-xl font-semibold">Pending Approval</h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Licensing deals awaiting approval from counterparties or platform administrators.
                </p>
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                      <FileSignature className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">
                      You have no pending licensing deals at the moment.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setNewDealData({ ...newDealData, status: 'pending' });
                        setNewDealOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Deal
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="negotiation">
              <Card className="p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">In Negotiation</h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Licensing deals currently being negotiated with potential licensees.
                </p>
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                      <FileSignature className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      You have no licensing deals in negotiation at the moment.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setNewDealData({ ...newDealData, status: 'negotiation' });
                        setNewDealOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Deal
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <Card className="p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  <h2 className="text-xl font-semibold">Deal Templates</h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Predefined templates for creating new licensing deals.
                </p>
                {templates.length === 0 ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                        <FileSignature className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">No templates available at the moment.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setTemplateDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Template
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-md"
                      >
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">{template.type}</p>
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
                            onClick={() => handleEditTemplate(template)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => {
                              setTemplates(templates.filter((t) => t.id !== template.id));
                              showSuccessToast('Template deleted successfully!');
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setTemplateDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                )}
              </Card>
              <Dialog open={templateDialogOpen} onOpenChange={(open) => {
                setTemplateDialogOpen(open);
                if (!open) {
                  setNewTemplateData({
                    name: '',
                    type: '',
                    terms: '',
                    isEdit: false,
                    editId: ''
                  });
                  setTemplateErrors({});
                }
              }}>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>
                      {newTemplateData.isEdit ? 'Edit Template' : 'Create New Template'}
                    </DialogTitle>
                    <DialogDescription>
                      {newTemplateData.isEdit 
                        ? 'Update your template details below.'
                        : 'Define a template for creating licensing deals.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="template-name" className="text-right">
                        Template Name
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="template-name"
                          placeholder="Enter template name"
                          value={newTemplateData.name}
                          onChange={(e) =>
                            setNewTemplateData({ ...newTemplateData, name: e.target.value })
                          }
                          className={templateErrors.name ? 'border-red-500' : ''}
                        />
                        {templateErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{templateErrors.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="template-type" className="text-right">
                        Deal Type
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={newTemplateData.type}
                          onValueChange={(value) =>
                            setNewTemplateData({ ...newTemplateData, type: value })
                          }
                        >
                          <SelectTrigger className={templateErrors.type ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select deal type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distribution">Distribution</SelectItem>
                            <SelectItem value="exhibition">Exhibition</SelectItem>
                            <SelectItem value="merchandise">Merchandise</SelectItem>
                            <SelectItem value="streaming">Streaming</SelectItem>
                          </SelectContent>
                        </Select>
                        {templateErrors.type && (
                          <p className="text-red-500 text-xs mt-1">{templateErrors.type}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="template-terms" className="text-right">
                        Terms
                      </Label>
                      <div className="col-span-3">
                        <Textarea
                          id="template-terms"
                          placeholder="Enter default terms for this template"
                          value={newTemplateData.terms}
                          onChange={(e) =>
                            setNewTemplateData({ ...newTemplateData, terms: e.target.value })
                          }
                          className={templateErrors.terms ? 'border-red-500' : ''}
                          rows={4}
                        />
                        {templateErrors.terms && (
                          <p className="text-red-500 text-xs mt-1">{templateErrors.terms}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          These terms will be automatically applied when using this template to create a new deal.
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTemplateDialogOpen(false);
                        setTemplateErrors({});
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      {newTemplateData.isEdit ? 'Update Template' : 'Create Template'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="deals">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>All Deals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <LicensingDeals />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}