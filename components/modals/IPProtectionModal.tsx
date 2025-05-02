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
import { X, Loader2, Shield, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface IPProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProtectionType = "Copyright" | "Trademark" | "Patent" | "Trade Secret";
type JurisdictionType = "International" | "National" | "Regional";

interface IPProtectionForm {
  projectId: string;
  protectionType: ProtectionType;
  jurisdiction: JurisdictionType;
  description: string;
  documents?: File[];
  registrationNumber?: string;
  filingDate?: string;
}

export function IPProtectionModal({ isOpen, onClose }: IPProtectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<IPProtectionForm>({
    projectId: "",
    protectionType: "Copyright",
    jurisdiction: "International",
    description: "",
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
      // TODO: Implement actual IP protection submission logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      toast.success("IP protection request submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit IP protection request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.projectId) {
      toast.error("Please select a project");
      return false;
    }
    if (!form.description) {
      toast.error("Please provide a description of the IP protection needed");
      return false;
    }
    if (!form.documents || form.documents.length === 0) {
      toast.error("Please upload supporting documents");
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
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#7F56F0]" />
              <h3 className="text-sm font-medium text-white">IP Protection</h3>
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

              {/* Protection Type */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">Protection Type</Label>
                <Select
                  value={form.protectionType}
                  onValueChange={(value: ProtectionType) => setForm({ ...form, protectionType: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Copyright">Copyright</SelectItem>
                    <SelectItem value="Trademark">Trademark</SelectItem>
                    <SelectItem value="Patent">Patent</SelectItem>
                    <SelectItem value="Trade Secret">Trade Secret</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Jurisdiction */}
              <div>
                <Label className="text-xs mb-1 block text-slate-300">Jurisdiction</Label>
                <Select
                  value={form.jurisdiction}
                  onValueChange={(value: JurisdictionType) => setForm({ ...form, jurisdiction: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="International">International</SelectItem>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Registration Details (Optional) */}
              {form.protectionType !== "Trade Secret" && (
                <>
                  <div>
                    <Label className="text-xs mb-1 block text-slate-300">Registration # (Optional)</Label>
                    <Input
                      className="h-8 text-xs"
                      placeholder="Enter if available"
                      value={form.registrationNumber || ""}
                      onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block text-slate-300">Filing Date (Optional)</Label>
                    <Input
                      className="h-8 text-xs"
                      type="date"
                      value={form.filingDate || ""}
                      onChange={(e) => setForm({ ...form, filingDate: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Description */}
              <div className="col-span-2">
                <Label className="text-xs mb-1 block text-slate-300">Description</Label>
                <Textarea
                  className="text-xs h-20"
                  placeholder="Describe the IP protection needed..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  Submitting...
                </>
              ) : (
                "Submit Protection Request"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}