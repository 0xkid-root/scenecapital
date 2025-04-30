"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { ChevronRight, ArrowRight, Play } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Partner logos with their names and URLs
const partnerLogos = [
  {
    name: "Universal Studios",
    logo: "/images/partners/universal.svg",
    darkMode: true,
  },
  {
    name: "Sony Pictures",
    logo: "/images/partners/sony.svg",
    darkMode: true,
  },
  {
    name: "Warner Bros",
    logo: "/images/partners/warner.svg",
    darkMode: true,
  },
  {
    name: "Netflix",
    logo: "/images/partners/netflix.svg",
    darkMode: false,
  },
  {
    name: "Spotify",
    logo: "/images/partners/spotify.svg",
    darkMode: false,
  },
  {
    name: "Disney",
    logo: "/images/partners/disney.svg",
    darkMode: true,
  },
];

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Enhanced parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  // Rotate through partner logos
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePartnerIndex((prev) => (prev + 1) % partnerLogos.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 pt-32"
      id="hero"
      aria-labelledby="hero-heading"
      ref={containerRef}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 z-0 overflow-hidden">
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(
              circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, 
              rgba(59, 130, 246, 0.15), 
              transparent 60%
            )`,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-400/10 dark:bg-blue-400/5"
              style={{
                width: Math.random() * 40 + 10,
                height: Math.random() * 40 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                delay: Math.random() * 20,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Improved background pattern with animation */}
      <motion.div 
        className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-[0.015] dark:opacity-[0.03] z-0"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Enhanced animated blob decorations */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full filter blur-[128px] opacity-20 dark:opacity-10 z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`,
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-400 dark:bg-emerald-600 rounded-full filter blur-[128px] opacity-20 dark:opacity-10 z-0"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)`,
        }}
      />
      <motion.div 
        className="absolute top-2/3 right-1/3 w-64 h-64 bg-amber-400 dark:bg-amber-600 rounded-full filter blur-[100px] opacity-10 dark:opacity-5 z-0"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        style={{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
        }}
      />

      <motion.div 
        className="container px-4 mx-auto relative z-10"
        style={{ opacity, scale, y }}
      >
        <StaggerChildren className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <FadeIn>
            <Badge className="px-4 py-1.5 text-sm md:text-base font-medium rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 mb-6 hover:bg-white/60 dark:hover:bg-slate-800/60">
              The Future of Creative Investments
            </Badge>
          </FadeIn>

          <FadeIn>
            <motion.h1 
              id="hero-heading"
              className="font-display font-bold text-4xl md:text-5xl lg:text-7xl bg-gradient-to-br from-blue-800 to-indigo-900 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent leading-[1.1] tracking-tight mb-6"
              initial={{ backgroundPosition: '0% 0%' }}
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            >
              Revolutionizing IP<br />Licensing & Ownership
            </motion.h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <motion.div 
              className="flex items-center justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span 
                className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent" 
                aria-label="Scene representing arts and movies"
                initial={{ backgroundPosition: '0% 0%' }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                Scene
              </motion.span>
              <motion.span 
                className="text-4xl font-bold text-amber-500 mx-1" 
                aria-label="Dot representing light of hope"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                .
              </motion.span>
              <motion.span 
                className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent" 
                aria-label="Capital representing finance"
                initial={{ backgroundPosition: '0% 0%' }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                Capital
              </motion.span>
            </motion.div>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
              A pioneering Pre NFT-Content & Rights Marketplace that empowers creators, investors, and fans to collaborate in funding, owning, and licensing intellectual property for creative works through blockchain technology.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                size="lg" 
                className="font-medium text-base bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg shadow-blue-900/20 dark:shadow-blue-900/10"
              >
                Invest in IP
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="font-medium text-base group backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80"
              >
                Submit Your Project <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </FadeIn>
          
          <FadeIn delay={0.25} className="mt-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-block"
            >
              <Button 
                size="sm" 
                variant="ghost" 
                className="font-medium text-sm flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 group"
                onClick={() => setIsVideoPlaying(true)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Play className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400 ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </Button>
            </motion.div>
          </FadeIn>
          
          <FadeIn delay={0.3} className="mt-16">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                Trusted by leading entertainment companies
              </p>
              
              <div className="relative">
                {/* Animated highlight for current partner */}
                <motion.div 
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: `calc(${(100 / partnerLogos.length) * activePartnerIndex}% + 8px)`,
                    width: `calc(${100 / partnerLogos.length}% - 16px)`,
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Partner logos */}
                <div className="flex flex-wrap justify-center items-center py-4 px-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  {partnerLogos.map((partner, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center justify-center h-16 ${index === activePartnerIndex ? 'opacity-100' : 'opacity-50'}`}
                      style={{ width: `${100 / partnerLogos.length}%` }}
                      whileHover={{ scale: 1.1, opacity: 1 }}
                      onClick={() => setActivePartnerIndex(index)}
                    >
                      <img 
                        src={partner.logo} 
                        alt={`${partner.name} logo`}
                        className={`h-8 ${partner.darkMode ? 'dark:invert' : ''} transition-all duration-300`}
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Animated partner name */}
              <div className="h-8 mt-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activePartnerIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400"
                  >
                    {partnerLogos[activePartnerIndex].name}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </FadeIn>
        </StaggerChildren>
      </motion.div>
      
      {/* Video modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div 
              className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                  title="Scene Capital Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <button 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                onClick={() => setIsVideoPlaying(false)}
                aria-label="Close video"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}