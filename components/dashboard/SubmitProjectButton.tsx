"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubmitProjectModal } from "@/components/modals/SubmitProjectModal";
import { PlusCircle } from "lucide-react";

export function SubmitProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#7F56F0] hover:bg-[#6D46E3] text-white flex items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Submit New Project
      </Button>

      <SubmitProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 