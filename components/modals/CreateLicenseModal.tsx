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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("License created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create license.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.projectId) {
      toast.error("Project required");
      return false;
    }
    if (!form.territory) {
      toast.error("Territory required");
      return false;
    }
    if (!form.fee || parseFloat(form.fee) <= 0) {
      toast.error("Valid license fee required");
      return false;
    }
    if (!form.royaltyRate || parseFloat(form.royaltyRate) < 0 || parseFloat(form.royaltyRate) > 100) {
      toast.error("Royalty rate must be 0-100%");
      return false;
    }
    if (!form.terms) {
      toast.error("License terms required");
      return false;
    }
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 rounded-xl bg-gradient-to-br from-gray-900/90 to-indigo-950/90 border border-gray-700/50">
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 border-b border-gray-700/30">
            <h3 className="text-sm font-semibold text-gray-100">New License</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </motion.button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="space-y-3">
              {/* Project Selection */}
              <div>
                <Label className="text-xs text-gray-300">Project</Label>
                <Select
                  value={form.projectId}
                  onValueChange={(value) => setForm({ ...form, projectId: value })}
                >
                  <SelectTrigger className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="1" className="text-gray-200">Project Alpha</SelectItem>
                    <SelectItem value="2" className="text-gray-200">Project Beta</SelectItem>
                    <SelectItem value="3" className="text-gray-200">Project Gamma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* License Type */}
                <div>
                  <Label className="text-xs text-gray-300">Type</Label>
                  <Select
                    value={form.licenseType}
                    onValueChange={(value: LicenseType) => setForm({ ...form, licenseType: value })}
                  >
                    <SelectTrigger className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Exclusive" className="text-indigo-400">Exclusive</SelectItem>
                      <SelectItem value="Non-Exclusive" className="text-blue-400">Non-Exclusive</SelectItem>
                      <SelectItem value="Limited" className="text-green-400">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div>
                  <Label className="text-xs text-gray-300">Duration</Label>
                  <Select
                    value={form.duration}
                    onValueChange={(value: LicenseDuration) => setForm({ ...form, duration: value })}
                  >
                    <SelectTrigger className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Perpetual" className="text-gray-200">Perpetual</SelectItem>
                      <SelectItem value="Fixed" className="text-gray-200">Fixed Term</SelectItem>
                      <SelectItem value="Renewable" className="text-gray-200">Renewable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Territory */}
              <div>
                <Label className="text-xs text-gray-300">Territory</Label>
                <Input
                  className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Worldwide"
                  value={form.territory}
                  onChange={(e) => setForm({ ...form, territory: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* License Fee */}
                <div>
                  <Label className="text-xs text-gray-300">Fee (USD)</Label>
                  <Input
                    className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    type="number"
                    placeholder="Fee"
                    value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })}
                  />
                </div>

                {/* Royalty Rate */}
                <div>
                  <Label className="text-xs text-gray-300">Royalty (%)</Label>
                  <Input
                    className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    type="number"
                    placeholder="%"
                    value={form.royaltyRate}
                    onChange={(e) => setForm({ ...form, royaltyRate: e.target.value })}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <Label className="text-xs text-gray-300">Terms</Label>
                <Textarea
                  className="text-xs h-16 bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="License terms..."
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-9 text-xs mt-3 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
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