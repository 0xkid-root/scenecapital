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
import { X, Loader2, Upload, FileText } from "lucide-react";
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
      toast.success(`${validFiles.length} document(s) uploaded`);
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Deal created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create deal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.projectName) {
      toast.error("Project name required");
      return false;
    }
    if (!form.licensee) {
      toast.error("Licensee required");
      return false;
    }
    if (!form.value || parseFloat(form.value) <= 0) {
      toast.error("Valid deal value required");
      return false;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Deal duration dates required");
      return false;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return false;
    }
    if (!form.terms) {
      toast.error("Deal terms required");
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
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-100">New Deal</h3>
            </div>
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
              {/* Deal ID */}
              <div>
                <Label className="text-xs text-gray-300">Deal ID</Label>
                <Input
                  className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  value={form.id}
                  disabled
                />
              </div>

              {/* Project Name */}
              <div>
                <Label className="text-xs text-gray-300">Project</Label>
                <Input
                  className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Project name"
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                />
              </div>

              {/* Licensee */}
              <div>
                <Label className="text-xs text-gray-300">Licensee</Label>
                <Input
                  className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Licensee name"
                  value={form.licensee}
                  onChange={(e) => setForm({ ...form, licensee: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Deal Type */}
                <div>
                  <Label className="text-xs text-gray-300">Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value: DealType) => setForm({ ...form, type: value })}
                  >
                    <SelectTrigger className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Exclusive" className="text-indigo-400">Exclusive</SelectItem>
                      <SelectItem value="Non-Exclusive" className="text-blue-400">Non-Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Deal Value */}
                <div>
                  <Label className="text-xs text-gray-300">Value (USD)</Label>
                  <Input
                    className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    type="number"
                    placeholder="Value"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Start Date */}
                <div>
                  <Label className="text-xs text-gray-300">Start</Label>
                  <Input
                    className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>

                {/* End Date */}
                <div>
                  <Label className="text-xs text-gray-300">End</Label>
                  <Input
                    className="h-9 text-xs bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Terms */}
              <div>
                <Label className="text-xs text-gray-300">Terms</Label>
                <Textarea
                  className="text-xs h-16 bg-gray-800/50 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Deal terms..."
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                />
              </div>

              {/* Document Upload */}
              <div>
                <Label className="text-xs text-gray-300">Documents</Label>
                <div
                  {...getRootProps()}
                  className="border border-dashed rounded-lg p-2 text-center hover:bg-gray-700/30 transition-colors cursor-pointer h-14 flex items-center justify-center"
                >
                  <input {...getInputProps()} />
                  {form.documents && form.documents.length > 0 ? (
                    <div className="text-xs text-green-400">
                      ✓ {form.documents.length} document(s)
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-400">PDF/DOC (25MB max)</span>
                    </div>
                  )}
                </div>
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
                "Create Deal"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}