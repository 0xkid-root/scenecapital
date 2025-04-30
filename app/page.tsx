"use client";

import { HeroSection } from '@/components/sections/hero';
import { FeaturesSection } from '@/components/sections/features';
import { ProcessSection } from '@/components/sections/process';
import { ProjectsSection } from '@/components/sections/projects';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { CTASection } from '@/components/sections/cta';
import { EnhancedFooter } from '@/components/sections/footer';
import { useEffect } from 'react';
import { useInView } from 'framer-motion';

export default function Home() {
  // Implement performance monitoring
  useEffect(() => {
    // Report Web Vitals
    if (typeof window !== 'undefined') {
      const reportWebVitals = (metric: any) => {
        console.log(metric);
      };
    }
  }, []);

  return (
    <main className="relative overflow-hidden">
      {/* Improved background with subtle gradient animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1), transparent)`,
        }}
      />
      
      {/* Grid pattern overlay with reduced opacity */}
      <div 
        className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-[0.015] dark:opacity-[0.03] z-0"
      />

      {/* Content sections with improved spacing and animations */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <ProjectsSection />
        <TestimonialsSection />
        <CTASection />
        <EnhancedFooter />
      </div>

      {/* Accessibility skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>
    </main>
  );
}