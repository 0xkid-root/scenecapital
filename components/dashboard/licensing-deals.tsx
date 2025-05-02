"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileSignature, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal,
  ExternalLink,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample licensing deals data
const licensingDeals = [
  {
    id: "LD-2024-001",
    project: "Cosmic Odyssey",
    licensee: "Universal Studios",
    type: "Exclusive",
    value: "$75,000",
    duration: "2 years",
    status: "Active",
    startDate: "Jan 15, 2024",
    endDate: "Jan 14, 2026"
  },
  {
    id: "LD-2024-002",
    project: "Echoes of Tomorrow",
    licensee: "Spotify Premium",
    type: "Non-Exclusive",
    value: "$12,500",
    duration: "1 year",
    status: "Active",
    startDate: "Mar 1, 2024",
    endDate: "Feb 28, 2025"
  },
  {
    id: "LD-2024-003",
    project: "The Silent Protocol",
    licensee: "Audible",
    type: "Non-Exclusive",
    value: "$18,000",
    duration: "18 months",
    status: "Pending",
    startDate: "Jul 1, 2024",
    endDate: "Dec 31, 2025"
  },
  {
    id: "LD-2024-004",
    project: "Neon Shadows",
    licensee: "Netflix",
    type: "Exclusive",
    value: "$45,000",
    duration: "3 years",
    status: "Negotiation",
    startDate: "TBD",
    endDate: "TBD"
  }
];

// Helper function to get status badge styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-0">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        {status}
      </Badge>;
    case "Pending":
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-0">
        <Clock className="h-3 w-3 mr-1" />
        {status}
      </Badge>;
    case "Negotiation":
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-0">
        <AlertCircle className="h-3 w-3 mr-1" />
        {status}
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function LicensingDeals() {
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >


      <motion.div variants={item}>
        <Card className="overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent border-b">
            <div className="flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Active and Pending Licensing Deals</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-7">Manage your intellectual property licensing agreements and track their status</p>
          </div>

          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Licensee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licensingDeals.map((deal) => (
                  <TableRow key={deal.id} className="group hover:bg-muted/50">
                    <TableCell className="font-medium">{deal.id}</TableCell>
                    <TableCell>{deal.project}</TableCell>
                    <TableCell>{deal.licensee}</TableCell>
                    <TableCell>
                      {deal.type === "Exclusive" ? (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-0">
                          {deal.type}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-0">
                          {deal.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{deal.value}</TableCell>
                    <TableCell>{deal.duration}</TableCell>
                    <TableCell>{getStatusBadge(deal.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>License Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="flex items-center cursor-pointer" aria-label="View license details">
                            <Eye className="h-4 w-4 mr-2 text-blue-500" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center cursor-pointer" aria-label="Edit license agreement">
                            <Edit className="h-4 w-4 mr-2 text-amber-500" />
                            Edit Agreement
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center cursor-pointer" aria-label="Download license contract">
                            <Download className="h-4 w-4 mr-2 text-green-500" />
                            Download Contract
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950" aria-label="Terminate license deal">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Terminate Deal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="overflow-hidden">
          <div className="p-6 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent border-b">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Licensing Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-7">Overview of your IP licensing portfolio and upcoming renewals</p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-transparent border border-green-100 dark:border-green-900/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h4 className="font-medium">Active Deals</h4>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-lg font-bold">$87,500</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Count</p>
                <p className="text-lg font-bold">2</p>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-2" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                <motion.div 
                  className="h-full bg-green-500" 
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  transition={{ duration: 0.5 }}
                  style={{ width: '50%' }}
                />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium">Pending Approval</h4>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-lg font-bold">$18,000</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Count</p>
                <p className="text-lg font-bold">1</p>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-2" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                <motion.div 
                  className="h-full bg-amber-500" 
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ width: '25%' }}
                />
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-100 dark:border-blue-900/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">In Negotiation</h4>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-lg font-bold">$45,000</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Count</p>
                <p className="text-lg font-bold">1</p>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-2" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                <motion.div 
                  className="h-full bg-blue-500" 
                  initial={{ width: 0 }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ width: '25%' }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            <div className="rounded-lg bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-100 dark:border-amber-900/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium">Upcoming Renewals</h4>
              </div>
              <div className="flex flex-col space-y-3">
                <div className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 mr-2"></div>
                  <div>
                    <p className="text-sm font-medium">"Echoes of Tomorrow" with Spotify Premium</p>
                    <p className="text-xs text-muted-foreground">Expires Feb 28, 2025 (8 months remaining)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-2"></div>
                  <div>
                    <p className="text-sm font-medium">"Cosmic Odyssey" with Universal Studios</p>
                    <p className="text-xs text-muted-foreground">Expires Jan 14, 2026 (20 months remaining)</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-100 dark:border-amber-900/20">
                <p className="text-sm text-muted-foreground">
                  Best practice: Initiate renewal discussions 3 months before expiry date.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
