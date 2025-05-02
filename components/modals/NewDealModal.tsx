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
import { X, Loader2, Upload, FileText, Calendar, DollarSign } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DealType = "Exclusive" | "Non-Exclusive";
type DealStatus = "Active" | "Pending" | "In Negotiation";

interface DealForm {
  id: string;
  projectName: string;
  licensee: string;
  type: DealType;
  value: string;
  duration: string;
  status: DealStatus;
  startDate: string;
  endDate: string;
  terms: string;
  documents?: File[];
}

export function NewDealModal({ isOpen, onClose }: NewDealModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<DealForm>({
    id: `LD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    projectName: "",
    licensee: "",
    type: "Non-Exclusive",
    value: "",
    duration: "",
    status: "Pending",
    startDate: "",
    endDate: "",
    terms: "",
  });

  const onDropDocuments = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.size <= 25 * 1024 * 1024);
    if (validFiles.length !== acceptedFiles.length) {
      toast.error("Some documents were too large (max 25MB)");
    }
    if (validFiles.length > 0) {
      setForm(prev => ({ ...prev, documents: validFiles }));
      toast.success(`${validFiles.length} document(s) uploaded successfully`);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropDocuments,
    accept: {
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []
    },
    multiple: true
  });

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Implement actual deal creation logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      toast.success("Deal created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create deal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.projectName) {
      toast.error("Please enter a project name");
      return false;
    }
    if (!form.licensee) {
      toast.error("Please enter a licensee");
      return false;
    }
    if (!form.value || parseFloat(form.value) <= 0) {
      toast.error("Please enter a valid deal value");
      return false;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Please specify deal duration dates");
      return false;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return false;
    }
    if (!form.terms) {
      toast.error("Please specify deal terms");
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
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#7F56F0]" />
              <h3 className="text-sm font-medium text-white">New Licensing Deal</h3>
            </div>
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
              {/* Deal ID */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">Deal ID</Label>
                <Input
                  className="h-8 text-xs bg-slate-800/50"
                  value={form.id}
                  disabled
                />
              </div>

              {/* Project Name */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">Project Name</Label>
                <Input
                  className="h-8 text-xs"
                  placeholder="Enter project name"
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                />
              </div>

              {/* Licensee */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">Licensee</Label>
                <Input
                  className="h-8 text-xs"
                  placeholder="Enter licensee name"
                  value={form.licensee}
                  onChange={(e) => setForm({ ...form, licensee: e.target.value })}
                />
              </div>

              {/* Deal Type */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value: DealType) => setForm({ ...form, type: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exclusive">
                      <span className="text-purple-400">Exclusive</span>
                    </SelectItem>
                    <SelectItem value="Non-Exclusive">
                      <span className="text-blue-400">Non-Exclusive</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deal Value */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">Value (USD)</Label>
                <Input
                  className="h-8 text-xs"
                  type="number"
                  placeholder="Enter value"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>

              {/* Start Date */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">Start Date</Label>
                <Input
                  className="h-8 text-xs"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              {/* End Date */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">End Date</Label>
                <Input
                  className="h-8 text-xs"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>

              {/* Terms */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">Deal Terms</Label>
                <Textarea
                  className="text-xs h-20"
                  placeholder="Enter deal terms and conditions..."
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                />
              </div>

              {/* Document Upload */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">Supporting Documents</Label>
                <div
                  {...getRootProps()}
                  className="border border-dashed rounded-lg p-3 text-center hover:bg-slate-800/30 transition-colors cursor-pointer h-16 flex flex-col justify-center"
                >
                  <input {...getInputProps()} />
                  {form.documents && form.documents.length > 0 ? (
                    <div className="text-xs text-green-500">
                      ✓ {form.documents.length} document(s) uploaded
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-4 h-4 mb-1 text-slate-400" />
                      <div className="text-xs text-slate-400">
                        Upload documents (PDF, DOC up to 25MB)
                      </div>
                    </div>
                  )}
                </div>
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
                  Creating Deal...
                </>
              ) : (
                "Create Deal"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 