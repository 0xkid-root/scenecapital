"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { NewDealButton } from "@/components/licensing/NewDealButton";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Deal {
  id: string;
  project: string;
  licensee: string;
  type: "Exclusive" | "Non-Exclusive";
  value: number;
  duration: string;
  status: "Active" | "Pending" | "In Negotiation";
}

const mockDeals: Deal[] = [
  {
    id: "LD-2024-001",
    project: "Cosmic Odyssey",
    licensee: "Universal Studios",
    type: "Exclusive",
    value: 75000,
    duration: "2 years",
    status: "Active",
  },
  {
    id: "LD-2024-002",
    project: "Echoes of Tomorrow",
    licensee: "Spotify Premium",
    type: "Non-Exclusive",
    value: 12500,
    duration: "1 year",
    status: "Active",
  },
  {
    id: "LD-2024-003",
    project: "The Silent Protocol",
    licensee: "Audible",
    type: "Non-Exclusive",
    value: 18000,
    duration: "18 months",
    status: "Pending",
  },
  {
    id: "LD-2024-004",
    project: "Neon Shadows",
    licensee: "Netflix",
    type: "Exclusive",
    value: 45000,
    duration: "3 years",
    status: "In Negotiation",
  },
];

export default function LicensingPage() {
  const [activeTab, setActiveTab] = useState("active");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="flex-1 space-y-6 p-4 md:p-8 pt-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Licensing Deals</h2>
          <p className="text-muted-foreground mt-1">
            Manage your IP licensing agreements and partnerships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <NewDealButton />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-navy-800">
            <TabsTrigger value="active">Active Deals</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="negotiation">In Negotiation</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-slate-800">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-xs font-medium text-slate-300 px-4 py-3 text-left">ID</th>
                    <th className="text-xs font-medium text-slate-300 px-4 py-3 text-left">Project</th>
                    <th className="text-xs font-medium text-slate-300 px-4 py-3 text-left">Licensee</th>
                    <th className="text-xs font-medium text-slate-300 px-4 py-3 text-left">Type</th>
                    <th className="text-xs font-medium text-slate-300 px-4 py-3 text-left">Value</th>
                    <th className="text-xs font-medium text-slate-300 px-4 py-3 text-left">Duration</th>
                    <th className="text-xs font-medium text-slate-300 px-4 py-3 text-left">Status</th>
                    <th className="text-xs font-medium text-slate-300 px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="text-xs px-4 py-3 text-slate-300">{deal.id}</td>
                      <td className="text-xs px-4 py-3 text-white font-medium">{deal.project}</td>
                      <td className="text-xs px-4 py-3 text-slate-300">{deal.licensee}</td>
                      <td className="text-xs px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            deal.type === "Exclusive"
                              ? "bg-purple-400/10 text-purple-400"
                              : "bg-blue-400/10 text-blue-400"
                          }`}
                        >
                          {deal.type}
                        </span>
                      </td>
                      <td className="text-xs px-4 py-3 text-slate-300">
                        ${deal.value.toLocaleString()}
                      </td>
                      <td className="text-xs px-4 py-3 text-slate-300">{deal.duration}</td>
                      <td className="text-xs px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            deal.status === "Active"
                              ? "bg-green-400/10 text-green-400"
                              : deal.status === "Pending"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-blue-400/10 text-blue-400"
                          }`}
                        >
                          {deal.status}
                        </span>
                      </td>
                      <td className="text-xs px-4 py-3">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="pending">
            {/* Similar table for pending deals */}
          </TabsContent>

          <TabsContent value="negotiation">
            {/* Similar table for deals in negotiation */}
          </TabsContent>

          <TabsContent value="templates">
            {/* Templates content */}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
} 