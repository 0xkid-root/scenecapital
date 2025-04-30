"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function KYCVerification() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Implement KYC submission logic
    setLoading(false);
  };

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-gray-700 via-rose-500 to-orange-400 p-[1px]">
      <div className="bg-white dark:bg-slate-900 rounded-[inherit]">
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Personal Information</Label>
                <Input placeholder="Full Name" className="mt-1" />
                <Input placeholder="Date of Birth" type="date" className="mt-1" />
              </div>
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Document Upload</Label>
                <Input type="file" className="mt-1" />
              </div>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Complete Verification"}
              </Button>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}