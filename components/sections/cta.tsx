"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { Shield, CheckCircle, Zap, Wallet } from "lucide-react";

export function CTASection() {
  const [borderPosition, setBorderPosition] = useState(0);
  
  // Animate the gradient border
  useEffect(() => {
    const interval = setInterval(() => {
      setBorderPosition((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <div 
            className="relative overflow-hidden rounded-2xl p-0.5" 
            style={{
              background: `linear-gradient(${borderPosition * 3.6}deg, rgba(30, 64, 175, 0.6), rgba(79, 70, 229, 0.6), rgba(16, 185, 129, 0.6), rgba(30, 64, 175, 0.6))`,
              backgroundSize: "400% 400%",
              animation: "gradient-animation 3s ease infinite",
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-[calc(1rem-1px)] p-12 md:p-16 flex flex-col lg:flex-row gap-12 justify-between items-center">
              <div className="lg:w-1/2">
                <h3 className="text-3xl md:text-4xl font-bold font-display leading-tight mb-6">
                  Ready to revolutionize IP ownership & licensing?
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Join our decentralized marketplace that empowers creators, investors, and fans 
                  to collaborate in the content industry through blockchain technology.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    { icon: Shield, text: "Tokenized IP with embedded rights and licensing terms" },
                    { icon: CheckCircle, text: "Rigorous due diligence for all creative projects" },
                    { icon: Zap, text: "Automated royalty distribution via smart contracts" },
                    { icon: Wallet, text: "Fractional ownership starting at just $10" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <item.icon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="font-medium text-base bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300">
                    Invest in IP
                  </Button>
                  <Button size="lg" variant="outline" className="font-medium text-base">
                    Submit Your Project
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-2/5">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 opacity-30 blur-lg"></div>
                  <div className="relative bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-bold text-lg">IP Marketplace Stats</h4>
                      <span className="text-sm font-medium px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                        +32.5% ROI
                      </span>
                    </div>
                    <img 
                      src="https://assets.website-files.com/6550c9531d76d63b1fd152bc/6550c9b4ed20bc2e034b3433_feature-1-financial-template.svg" 
                      alt="IP marketplace performance chart" 
                      className="w-full h-40 object-contain mb-4 dark:invert"
                    />
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Tokenized IPs</p>
                        <p className="font-bold text-xl">325</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Licensing Deals</p>
                        <p className="font-bold text-xl">1,240</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="flex items-center">
              <img 
                src="/images/icons/blockchain.svg" 
                alt="Blockchain icon" 
                className="w-10 h-10 mr-3 dark:invert"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Blockchain Verified Rights
              </span>
            </div>
            <div className="flex items-center">
              <img 
                src="/images/icons/smart-contract.svg" 
                alt="Smart Contract icon" 
                className="w-10 h-10 mr-3 dark:invert"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Smart Contract Automation
              </span>
            </div>
            <div className="flex items-center">
              <img 
                src="/images/icons/global.svg" 
                alt="Global icon" 
                className="w-10 h-10 mr-3 dark:invert"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Global IP Marketplace
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}