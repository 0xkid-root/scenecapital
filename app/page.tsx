"use client";

import { useState } from "react";
import { WalletConnectModal } from "@/components/modals/WalletConnectModal";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    redirectPath: "/dashboard",
    redirectTab: "investor",
  });

  const handleInvestClick = () => {
    setModalConfig({
      redirectPath: "/dashboard",
      redirectTab: "investor",
    });
    setIsModalOpen(true);
  };

  const handleSubmitProject = () => {
    setModalConfig({
      redirectPath: "/dashboard",
      redirectTab: "creator",
    });
    setIsModalOpen(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-navy-950 text-white">
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="bg-navy-900/50 px-6 py-2 rounded-full inline-block mb-8">
          <p className="text-gray-300">The Future of Creative Investments</p>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-blue-400 mb-6">
          Revolutionizing IP Licensing & Ownership
        </h1>

        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl mb-4">
            <span className="text-purple-400">Scene</span>
            <span className="text-teal-400">.Capital</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            A pioneering Pre NFT-Content & Rights Marketplace that empowers creators,
            investors, and fans to collaborate in funding, owning, and licensing
            intellectual property for creative works through blockchain technology.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleInvestClick}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto"
          >
            Invest in IP
          </Button>
          <Button
            onClick={handleSubmitProject}
            variant="outline"
            className="border-gray-600 hover:bg-navy-800 text-lg px-8 py-6 h-auto"
          >
            Submit Your Project →
          </Button>
        </div>

        <button
          onClick={() => {/* Add demo video logic */}}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mx-auto mt-12"
        >
          <PlayCircle className="w-6 h-6" />
          Watch Demo
        </button>
      </div>

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        redirectPath={modalConfig.redirectPath}
        redirectTab={modalConfig.redirectTab}
      />
    </main>
  );
}