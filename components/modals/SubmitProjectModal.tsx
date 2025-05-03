"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useIPFSUpload from "@/hooks/useIPFSUpload";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { X, Upload, Film, Music, BookOpen, Tv, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProjectCategory = "Film" | "Music" | "Book" | "Web Series";

interface ProjectForm {
  title: string;
  category: ProjectCategory;
  description: string;
  fundingGoal: string;
  duration: string;
  teamSize: string;
  royaltyPercentage: string;
  coverImage?: File;
  documents?: File[];
}

interface FormErrors {
  title?: string;
  description?: string;
  fundingGoal?: string;
  duration?: string;
  royaltyPercentage?: string;
  coverImage?: string;
  documents?: string;
}

export function SubmitProjectModal({ isOpen, onClose }: SubmitProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    category: "Film",
    description: "",
    fundingGoal: "",
    duration: "",
    teamSize: "",
    royaltyPercentage: "",
  });
  const { uploadAssetsCreation, loading: ipfsLoading } = useIPFSUpload();


  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!form.title.trim()) newErrors.title = "Title is required";
      if (!form.description.trim()) newErrors.description = "Description is required";
    } else if (step === 2) {
      if (!form.fundingGoal) newErrors.fundingGoal = "Funding goal is required";
      if (!form.duration) newErrors.duration = "Duration is required";
      if (!form.royaltyPercentage) newErrors.royaltyPercentage = "Royalty percentage is required";
      
      // Numeric validations
      if (parseFloat(form.fundingGoal) <= 0) newErrors.fundingGoal = "Funding goal must be greater than 0";
      if (parseInt(form.duration) <= 0) newErrors.duration = "Duration must be greater than 0";
      if (parseFloat(form.royaltyPercentage) <= 0 || parseFloat(form.royaltyPercentage) > 100) {
        newErrors.royaltyPercentage = "Royalty percentage must be between 0 and 100";
      }
    } else if (step === 3) {
      if (!form.coverImage) newErrors.coverImage = "Cover image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDropCoverImage = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Cover image must be less than 10MB");
        return;
      }
      setForm((prev) => ({ ...prev, coverImage: file }));
      toast.success("Cover image uploaded successfully");
    }
  }, []);

  const onDropDocuments = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.size <= 25 * 1024 * 1024);
    if (validFiles.length !== acceptedFiles.length) {
      toast.error("Some documents were too large (max 25MB)");
    }
    if (validFiles.length > 0) {
      setForm((prev) => ({ ...prev, documents: validFiles }));
      toast.success(`${validFiles.length} document(s) uploaded successfully`);
    }
  }, []);

  const { getRootProps: getCoverImageRootProps, getInputProps: getCoverImageInputProps } = useDropzone({
    onDrop: onDropCoverImage,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxFiles: 1
  });

  const { getRootProps: getDocumentsRootProps, getInputProps: getDocumentsInputProps } = useDropzone({
    onDrop: onDropDocuments,
    accept: {
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []
    },
    multiple: true
  });

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    try {
      // Map form data to the expected shape for uploadAssetsCreation
      const assetsMetadata = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: form.fundingGoal, // or another field if you have a price
        currency: "ETH" as const,
        images: form.coverImage ? [form.coverImage] : [],
        documents: form.documents || [],
        validatorId: "demo-validator", // replace with actual validator if needed
      };

      const ipfsResults = await uploadAssetsCreation(assetsMetadata);
      console.log('IPFS Upload Results:', ipfsResults);
      // TODO: Implement actual form submission logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      toast.success("Project submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(3, prev + 1));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          placeholder="Enter your project title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={form.category}
          onValueChange={(value: ProjectCategory) =>
            setForm({ ...form, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Film">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>Film</span>
              </div>
            </SelectItem>
            <SelectItem value="Music">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span>Music</span>
              </div>
            </SelectItem>
            <SelectItem value="Book">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Book</span>
              </div>
            </SelectItem>
            <SelectItem value="Web Series">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4" />
                <span>Web Series</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your project..."
          className="h-32"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
        <Input
          id="fundingGoal"
          type="number"
          placeholder="Enter funding goal"
          value={form.fundingGoal}
          onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Funding Duration (Days)</Label>
        <Input
          id="duration"
          type="number"
          placeholder="Enter funding duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="royaltyPercentage">Royalty Percentage (%)</Label>
        <Input
          id="royaltyPercentage"
          type="number"
          placeholder="Enter royalty percentage"
          value={form.royaltyPercentage}
          onChange={(e) => setForm({ ...form, royaltyPercentage: e.target.value })}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div
          {...getCoverImageRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
            errors.coverImage ? 'border-red-500' : ''
          }`}
        >
          <input {...getCoverImageInputProps()} />
          {form.coverImage ? (
            <div className="text-sm text-green-500">
              ✓ {form.coverImage.name}
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 10MB
              </p>
            </>
          )}
        </div>
        {errors.coverImage && (
          <p className="text-sm text-red-500 mt-1">{errors.coverImage}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Project Documents</Label>
        <div
          {...getDocumentsRootProps()}
          className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <input {...getDocumentsInputProps()} />
          {form.documents && form.documents.length > 0 ? (
            <div className="text-sm text-green-500">
              ✓ {form.documents.length} document(s) uploaded
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload project documentation
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC up to 25MB
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-card dark:glass-card-dark border-none shadow-float overflow-hidden p-0">
        <div className="relative">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 opacity-70" />

          {/* Progress indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200/10">
            <div
              className="h-full bg-[#7F56F0] transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
          >
            <X className="h-4 w-4 text-white/70" />
          </motion.button>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-200/10">
              <h3 className="text-xl font-bold text-white">Submit New Project </h3>
              <p className="text-sm text-slate-400 mt-1">
                Step {currentStep} of 3: {" "}
                {currentStep === 1
                  ? "Tell us about your project"
                  : currentStep === 2
                  ? "Set your funding goals"
                  : "Upload project assets"}
              </p>
            </div>

            {/* Form Steps */}
            <div className="p-6 space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1 || isSubmitting}
                >
                  Back
                </Button>
                <Button
                  className="bg-[#7F56F0] hover:bg-[#6D46E3] text-white"
                  onClick={() => {
                    if (currentStep === 3) {
                      handleSubmit();
                    } else {
                      handleNext();
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : currentStep === 3 ? (
                    "Submit Project"
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 