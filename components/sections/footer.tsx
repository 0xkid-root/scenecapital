"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Community", href: "#" },
      { label: "Tutorials", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Compliance", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function EnhancedFooter() {
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle");
  const [isHovered, setIsHovered] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus("error");
      return;
    }

    // Simulate API call
    setSubscriptionStatus("success");
    setEmail("");
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setSubscriptionStatus("idle");
    }, 5000);
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-24 pb-12">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        {/* Newsletter Section */}
        <div className="relative mb-20">
          <FadeIn>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-12 border border-blue-100 dark:border-blue-800/30 shadow-lg backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-3">
                  <Badge className="mb-4 bg-blue-500 hover:bg-blue-600 text-white">Newsletter</Badge>
                  <h3 className="text-2xl md:text-3xl font-bold font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Stay updated with Scene Capital
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-6 max-w-xl">
                    Subscribe to our newsletter for the latest investment opportunities, market insights, and platform updates.
                  </p>
                </div>
                
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {subscriptionStatus === "idle" && (
                      <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubscribe}
                        className="space-y-4"
                      >
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pr-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-12"
                            aria-label="Email address for newsletter"
                            required
                          />
                          <motion.button
                            type="submit"
                            className="absolute right-1 top-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Subscribe to newsletter"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          By subscribing, you agree to our Privacy Policy and consent to receive updates.
                        </p>
                      </motion.form>
                    )}
                    
                    {subscriptionStatus === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-300">Thank you for subscribing!</h4>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            You'll receive our next newsletter in your inbox.
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {subscriptionStatus === "error" && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
                      >
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-300">Invalid email address</h4>
                          <p className="text-sm text-red-700 dark:text-red-400">
                            Please enter a valid email address and try again.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 relative">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent" 
                aria-label="Scene representing arts and movies"
                whileHover={{ scale: 1.05 }}
              >
                Scene
              </motion.span>
              <motion.span 
                className="text-2xl font-bold text-amber-500 mx-1"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2
                }}
                aria-label="Dot representing light of hope"
              >
                .
              </motion.span>
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent" 
                aria-label="Capital representing finance"
                whileHover={{ scale: 1.05 }}
              >
                Capital
              </motion.span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              Empowering creators through blockchain investment solutions. Our platform connects investors with innovative projects in the entertainment industry.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-600 dark:text-slate-400">
                  123 Innovation Street, Tech District<br />
                  San Francisco, CA 94103
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-400">
                  +1 (555) 123-4567
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-slate-600 dark:text-slate-400">
                  contact@scenecapital.com
                </p>
              </div>
            </div>
          </div>
          
          {/* Link Columns */}
          {footerColumns.map((column, index) => (
            <div key={index}>
              <h3 className="font-display font-bold text-slate-900 dark:text-white mb-6">
                {column.title}
              </h3>
              <ul className="space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Social Links & Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-5">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Twitter, label: "Twitter" },
              { icon: Instagram, label: "Instagram" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Github, label: "GitHub" }
            ].map((social, index) => {
              const SocialIcon = social.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="#" 
                    aria-label={social.label}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <SocialIcon className="h-5 w-5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center md:text-right text-sm text-slate-500 dark:text-slate-500">
            <p>© {currentYear} Scene Capital. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
