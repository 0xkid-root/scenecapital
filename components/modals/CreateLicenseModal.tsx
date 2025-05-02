"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LicenseType = "Exclusive" | "Non-Exclusive" | "Limited";
type LicenseDuration = "Perpetual" | "Fixed" | "Renewable";

interface LicenseForm {
  projectId: string;
  licenseType: LicenseType;
  duration: LicenseDuration;
  territory: string;
  fee: string;
  royaltyRate: string;
  terms: string;
}

export function CreateLicenseModal({ isOpen, onClose }: CreateLicenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<LicenseForm>({
    projectId: "",
    licenseType: "Non-Exclusive",
    duration: "Fixed",
    territory: "",
    fee: "",
    royaltyRate: "",
    terms: "",
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Implement actual license creation logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      toast.success("License created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create license. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.projectId) {
      toast.error("Please select a project");
      return false;
    }
    if (!form.territory) {
      toast.error("Please specify the territory");
      return false;
    }
    if (!form.fee || parseFloat(form.fee) <= 0) {
      toast.error("Please enter a valid license fee");
      return false;
    }
    if (!form.royaltyRate || parseFloat(form.royaltyRate) < 0 || parseFloat(form.royaltyRate) > 100) {
      toast.error("Please enter a valid royalty rate (0-100%)");
      return false;
    }
    if (!form.terms) {
      toast.error("Please specify the license terms");
      return false;
    }
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 rounded-lg overflow-hidden">
        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-800/60 p-3 border-b border-slate-700/50">
            <h3 className="text-sm font-medium text-white">Create License</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X className="h-3 w-3 text-white/70" />
            </motion.button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {/* Project Selection */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">Project</Label>
                <Select
                  value={form.projectId}
                  onValueChange={(value) => setForm({ ...form, projectId: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Project Alpha</SelectItem>
                    <SelectItem value="2">Project Beta</SelectItem>
                    <SelectItem value="3">Project Gamma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* License Type */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">License Type</Label>
                <Select
                  value={form.licenseType}
                  onValueChange={(value: LicenseType) => setForm({ ...form, licenseType: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exclusive">Exclusive</SelectItem>
                    <SelectItem value="Non-Exclusive">Non-Exclusive</SelectItem>
                    <SelectItem value="Limited">Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">Duration</Label>
                <Select
                  value={form.duration}
                  onValueChange={(value: LicenseDuration) => setForm({ ...form, duration: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perpetual">Perpetual</SelectItem>
                    <SelectItem value="Fixed">Fixed Term</SelectItem>
                    <SelectItem value="Renewable">Renewable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Territory */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">Territory</Label>
                <Input
                  className="h-8 text-xs"
                  placeholder="e.g., Worldwide, North America, etc."
                  value={form.territory}
                  onChange={(e) => setForm({ ...form, territory: e.target.value })}
                />
              </div>

              {/* License Fee */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">License Fee (USD)</Label>
                <Input
                  className="h-8 text-xs"
                  type="number"
                  placeholder="Enter fee"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                />
              </div>

              {/* Royalty Rate */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">Royalty Rate (%)</Label>
                <Input
                  className="h-8 text-xs"
                  type="number"
                  placeholder="Enter %"
                  value={form.royaltyRate}
                  onChange={(e) => setForm({ ...form, royaltyRate: e.target.value })}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">License Terms</Label>
                <Textarea
                  className="text-xs h-20"
                  placeholder="Enter detailed license terms and conditions..."
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-8 text-xs mt-2 bg-[#7F56F0] hover:bg-[#6D46E3] text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create License"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}