"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSignature, DollarSign, Wallet, Shield } from "lucide-react";
import { CreateLicenseModal } from "@/components/modals/CreateLicenseModal";
import { IPProtectionModal } from "@/components/modals/IPProtectionModal";

export function QuickActionButtons() {
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => setIsLicenseModalOpen(true)}
        >
          <FileSignature className="h-6 w-6" />
          <span>Create License</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <DollarSign className="h-6 w-6" />
          <span>View Royalties</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <Wallet className="h-6 w-6" />
          <span>Withdraw Funds</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2"
          onClick={() => setIsProtectionModalOpen(true)}
        >
          <Shield className="h-6 w-6" />
          <span>IP Protection</span>
        </Button>
      </div>

      <CreateLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />

      <IPProtectionModal
        isOpen={isProtectionModalOpen}
        onClose={() => setIsProtectionModalOpen(false)}
      />
    </>
  );
} 