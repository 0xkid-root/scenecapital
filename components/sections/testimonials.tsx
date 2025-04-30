"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeIn } from "@/components/animations/fade-in";
import { BadgeWithIcon } from "@/components/ui/badge-with-icon";
import { 
  Star, Quote, ChevronLeft, ChevronRight, CheckCircle,
  MessageSquare, Heart, Award, Users, ThumbsUp, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  verified: boolean;
}

const testimonials: TestimonialProps[] = [
  {
    quote: "Scene Capital completely transformed how I approach investing in creative projects. The transparency and security provided by their blockchain platform gives me complete confidence.",
    author: "Alex Morgan",
    role: "Angel Investor",
    company: "Bright Ventures",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    verified: true,
  },
  {
    quote: "As a film producer, I've seen both sides of the platform. The funding process was seamless, and the smart contract ensures that investors receive fair returns when projects succeed.",
    author: "Sophia Chen",
    role: "Film Producer",
    company: "Luminary Studios",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    verified: true,
  },
  {
    quote: "The ability to invest in fractional shares of creative projects has opened up a whole new asset class for my portfolio. The returns have been exceptional, outperforming many traditional investments.",
    author: "Marcus Johnson",
    role: "Portfolio Manager",
    company: "Heritage Capital",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4,
    verified: true,
  },
  {
    quote: "What sets Scene Capital apart is their rigorous vetting process. Knowing that each project has undergone thorough due diligence gives me peace of mind as an investor.",
    author: "Emma Rodriguez",
    role: "Art Collector",
    company: "Gallery X",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 5,
    verified: true,
  },
  {
    quote: "The platform's user experience is exceptional. From discovery to investment tracking, every aspect has been carefully designed with both creators and investors in mind.",
    author: "David Lee",
    role: "Tech Entrepreneur",
    company: "Innovate Labs",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    rating: 4,
    verified: false,
  },
  {
    quote: "Scene Capital's blockchain-based royalty distribution system has revolutionized how I monetize my music. I now receive payments in real-time as my tracks are streamed or licensed.",
    author: "Jasmine Taylor",
    role: "Independent Musician",
    company: "Rhythm Collective",
    avatar: "https://randomuser.me/api/portraits/women/36.jpg",
    rating: 5,
    verified: true,
  },
  {
    quote: "As a game developer, I was skeptical about tokenization, but Scene Capital made the process incredibly straightforward. Our investors are now active community members who help shape our game's future.",
    author: "Ryan Patel",
    role: "Game Developer",
    company: "Pixel Pioneers",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 4,
    verified: true,
  },
  {
    quote: "The analytics dashboard provides incredible insights into how my investment is performing. I can track engagement metrics, revenue streams, and projected returns all in one place.",
    author: "Olivia Washington",
    role: "Financial Analyst",
    company: "Strategic Investments",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    verified: true,
  },
  {
    quote: "What impressed me most was how Scene Capital helped us structure our documentary funding to align investor incentives with our social impact goals. It's a win-win for everyone involved.",
    author: "Michael Nguyen",
    role: "Documentary Filmmaker",
    company: "Truth Lens Productions",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 5,
    verified: false,
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <Star
            key={i}
            className={`h-5 w-5 mr-0.5 ${
              i < rating
                ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                : "text-slate-300 dark:text-slate-700"
            }`}
            aria-hidden="true"
          />
        </motion.div>
      ))}
      <span className="sr-only">{rating} out of 5 stars</span>
    </div>
  );
}

function TestimonialCard({ testimonial, index, isActive }: { testimonial: TestimonialProps; index: number; isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get appropriate icon based on role
  const getRoleIcon = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('investor')) return Heart;
    if (roleLower.includes('producer')) return Award;
    if (roleLower.includes('manager')) return Users;
    if (roleLower.includes('collector')) return ThumbsUp;
    if (roleLower.includes('entrepreneur')) return Sparkles;
    return MessageSquare;
  };
  
  const RoleIcon = getRoleIcon(testimonial.role);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full overflow-hidden transition-all duration-300 ${isActive ? 'shadow-lg' : ''} ${isHovered ? 'shadow-xl border-blue-200 dark:border-blue-800' : ''}`}
        role="article"
        aria-label={`Testimonial from ${testimonial.author}`}
      >
        <CardContent className="p-6 flex flex-col h-full relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/40 dark:from-blue-900/20 to-transparent rounded-bl-full -z-0" />
          
          <div className="mb-4 flex justify-between items-center relative z-10">
            <RatingStars rating={testimonial.rating} />
            {testimonial.verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 text-xs flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Verified</span>
              </Badge>
            )}
          </div>
          
          <div className="flex-grow">
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 h-10 w-10 text-blue-100 dark:text-blue-900/50 rotate-180" aria-hidden="true" />
              <motion.p 
                className="text-slate-700 dark:text-slate-300 pt-4 relative z-10 mb-6 leading-relaxed"
                animate={{ scale: isHovered ? 1.01 : 1 }}
                transition={{ duration: 0.3 }}
              >
                "{testimonial.quote}"
              </motion.p>
            </div>
          </div>
          
          <CardFooter className="p-0 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center">
            <Avatar className="h-12 w-12 mr-4 ring-2 ring-offset-2 ring-slate-100 dark:ring-slate-800">
              <AvatarImage src={testimonial.avatar} alt={`${testimonial.author}'s profile picture`} />
              <AvatarFallback>{testimonial.author.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <p className="font-medium text-slate-900 dark:text-white">
                  {testimonial.author}
                </p>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-1">
                <RoleIcon className="h-3 w-3" aria-hidden="true" />
                <span>{testimonial.role}, {testimonial.company}</span>
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const testimonialsPerView = 3;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerView);

  // Auto-scroll testimonials
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setActiveTestimonial(null);
    }, 8000);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsPaused(true);
    setActiveTestimonial(null);
    setTimeout(() => setIsPaused(false), 10000); // Resume auto-scroll after 10 seconds
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setIsPaused(true);
    setActiveTestimonial(null);
    setTimeout(() => setIsPaused(false), 10000); // Resume auto-scroll after 10 seconds
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section 
      className="py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden"
      id="testimonials"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <BadgeWithIcon
              icon={Star}
              text="TESTIMONIALS"
              variant="warning"
              className="mb-4"
            />
            <h3 className="text-3xl md:text-4xl font-bold font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500">
              Trusted by investors worldwide
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Hear what our community of investors and creators have to say about their experience with Scene Capital.
            </p>
          </div>
        </FadeIn>

        <div className="relative" ref={containerRef}>
          {/* Navigation buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          
          <div 
            className="overflow-hidden py-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-roledescription="carousel"
            aria-label="Customer testimonials"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
                aria-live="polite"
              >
                {testimonials
                  .slice(
                    currentSlide * testimonialsPerView,
                    (currentSlide * testimonialsPerView) + testimonialsPerView
                  )
                  .map((testimonial, index) => (
                    <motion.div 
                      key={index} 
                      variants={itemVariants}
                      onClick={() => setActiveTestimonial(index)}
                      onKeyDown={(e) => e.key === 'Enter' && setActiveTestimonial(index)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={activeTestimonial === index}
                    >
                      <TestimonialCard 
                        testimonial={testimonial} 
                        index={index}
                        isActive={activeTestimonial === index}
                      />
                    </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center mt-10 gap-2" role="tablist" aria-label="Testimonial navigation">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 w-8' 
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsPaused(true);
                  setActiveTestimonial(null);
                  setTimeout(() => setIsPaused(false), 10000);
                }}
                aria-label={`Go to testimonial group ${index + 1}`}
                aria-selected={currentSlide === index}
                role="tab"
              />
            ))}
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <motion.div 
                className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                500+
              </motion.div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Active Investors</p>
            </div>
            <div className="p-4">
              <motion.div 
                className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                $25M+
              </motion.div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Invested</p>
            </div>
            <div className="p-4">
              <motion.div 
                className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                98%
              </motion.div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Satisfaction Rate</p>
            </div>
            <div className="p-4">
              <motion.div 
                className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                45+
              </motion.div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Countries Served</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}