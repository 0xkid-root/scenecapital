"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NewDealModal } from "@/components/modals/NewDealModal";

export function NewDealButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#7F56F0] hover:bg-[#6D46E3] text-white h-9 px-4 py-2 text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </Button>
      </DialogTrigger>
      <NewDealModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Dialog>
  );
} 