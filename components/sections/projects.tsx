"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BadgeWithIcon } from "@/components/ui/badge-with-icon";
import { StaggerChildren } from "@/components/animations/stagger-children";
import { 
  Folder, Filter, ChevronRight, ChevronLeft, Film, 
  Music, Palette, Gamepad, ThumbsUp,
  TrendingUp, ArrowRight 
} from 'lucide-react';
import { FadeIn } from "@/components/animations/fade-in";
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  target: string;
  raised: string;
  days: number;
  index: number;
}

function ProjectCard({ 
  image, 
  title, 
  description, 
  category, 
  progress, 
  target, 
  raised, 
  days,
  index
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCategoryIcon = (cat: string) => {
    switch(cat.toLowerCase()) {
      case "film": return Film;
      case "music": return Music;
      case "book": return Palette;
      case "series": return Gamepad;
      case "tv": return ThumbsUp;
      default: return Folder;
    }
  };

  const CategoryIcon = getCategoryIcon(category);
  
  // Calculate color based on progress
  const getProgressColor = (value: number) => {
    if (value < 40) return "from-amber-500 to-red-500";
    if (value < 70) return "from-blue-500 to-indigo-500";
    return "from-emerald-500 to-green-500";
  };
  
  const progressColor = getProgressColor(progress);

  return (
    <FadeIn delay={0.1 * index}>
      <motion.div
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="group overflow-hidden bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 h-full">
          <div className="h-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 z-10" />
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute top-3 left-3 z-20">
              <BadgeWithIcon
                icon={CategoryIcon}
                text={category}
                variant={category === "Film" ? "default" : 
                  category === "Music" ? "success" : 
                  category === "Art" ? "warning" : "outline"}
                className="text-xs backdrop-blur-sm bg-white/10 border border-white/20"
              />
            </div>
            <motion.div 
              className="absolute bottom-3 right-3 z-20"
              animate={{ opacity: isHovered ? 1 : 0.8 }}
            >
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-sm text-xs font-medium text-white shadow-lg border border-white/20">
                {days} days left
              </span>
            </motion.div>
          </div>
          
          <CardContent className="p-5 relative">
            <h4 className="font-display font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
              {description}
            </p>
            
            <div className="space-y-3">
              <div className="relative pt-1">
                <div className="h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <motion.div 
                    className={`h-full rounded-full bg-gradient-to-r ${progressColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${progressColor}`} />
                    <span className="font-medium text-sm">{progress}% Funded</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {raised} / {target}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-5 pt-0">
            <Button 
              size="sm" 
              className="w-full font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
            >
              View Project
              <motion.div
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="ml-1 h-4 w-4" />
              </motion.div>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </FadeIn>
  );
}

const projectsData = [
  {
    image: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Nebula Rising: Sci-Fi Film Series",
    description: "A groundbreaking sci-fi film trilogy with tokenized IP rights, allowing investors to share in licensing and distribution revenue.",
    category: "Film",
    progress: 78,
    target: "$2,500,000",
    raised: "$1,950,000",
    days: 12,
  },
  {
    image: "https://images.pexels.com/photos/164693/pexels-photo-164693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Harmonic Revolution: Music Album",
    description: "A revolutionary music album with tokenized royalty rights, enabling fans to earn from streaming, licensing, and commercial use.",
    category: "Music",
    progress: 65,
    target: "$500,000",
    raised: "$325,000",
    days: 18,
  },
  {
    image: "https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Mystic Chronicles: Fantasy Novel Series",
    description: "A bestselling fantasy novel series with tokenized adaptation rights for film, TV, and merchandise licensing opportunities.",
    category: "Book",
    progress: 92,
    target: "$800,000",
    raised: "$736,000",
    days: 5,
  },
  {
    image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Quantum Nexus: Web Series",
    description: "An innovative sci-fi web series with fractional ownership of IP rights, revenue sharing, and cross-platform licensing opportunities.",
    category: "Series",
    progress: 45,
    target: "$1,200,000",
    raised: "$540,000",
    days: 24,
  },
  {
    image: "https://images.pexels.com/photos/7256634/pexels-photo-7256634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Metropolis 2050: TV Drama Series",
    description: "A premium TV drama series offering tokenized revenue rights from global distribution, syndication, and merchandise licensing.",
    category: "TV",
    progress: 38,
    target: "$3,500,000",
    raised: "$1,330,000",
    days: 30,
  },
  {
    image: "https://images.pexels.com/photos/1010519/pexels-photo-1010519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Sonic Frontiers: Music Licensing Platform",
    description: "A revolutionary music licensing platform that tokenizes rights for commercial use in films, games, and advertising.",
    category: "Music",
    progress: 82,
    target: "$1,500,000",
    raised: "$1,230,000",
    days: 9,
  },
  // New projects start here
  {
    image: "https://images.pexels.com/photos/1174996/pexels-photo-1174996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Ethereal Echoes: VR Concert Experience",
    description: "A groundbreaking virtual reality concert series that allows fans to experience live music in immersive digital environments with tokenized access rights.",
    category: "Music",
    progress: 71,
    target: "$1,800,000",
    raised: "$1,278,000",
    days: 15,
  },
  {
    image: "https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Legends of the Deep: Documentary Series",
    description: "An award-winning documentary series exploring ocean ecosystems with blockchain-verified carbon offset credits and conservation funding mechanisms.",
    category: "Film",
    progress: 58,
    target: "$1,200,000",
    raised: "$696,000",
    days: 22,
  },
  {
    image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Neon Dreams: Cyberpunk Game",
    description: "An immersive open-world cyberpunk game with player-owned in-game assets, tokenized rare items, and community governance of game development.",
    category: "Game",
    progress: 89,
    target: "$4,500,000",
    raised: "$4,005,000",
    days: 3,
  },
  {
    image: "https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Culinary Canvas: Food Culture Series",
    description: "A visually stunning TV series exploring global food cultures with tokenized merchandise rights and exclusive recipe NFTs for investors.",
    category: "TV",
    progress: 42,
    target: "$900,000",
    raised: "$378,000",
    days: 28,
  },
  {
    image: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Quantum Beats: AI Music Collaboration",
    description: "A revolutionary platform that enables musicians to collaborate with AI to create unique compositions with fair royalty distribution through smart contracts.",
    category: "Music",
    progress: 67,
    target: "$750,000",
    raised: "$502,500",
    days: 14,
  },
  {
    image: "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Arcane Archives: Fantasy Comic Series",
    description: "A visually stunning fantasy comic series with tokenized character rights, community-driven storylines, and cross-media adaptation opportunities.",
    category: "Book",
    progress: 81,
    target: "$350,000",
    raised: "$283,500",
    days: 7,
  },
  {
    image: "https://images.pexels.com/photos/3379943/pexels-photo-3379943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Celestial Harmony: Animated Feature",
    description: "A breathtaking animated feature film combining traditional and digital animation techniques with tokenized art collectibles and merchandise rights.",
    category: "Film",
    progress: 53,
    target: "$2,800,000",
    raised: "$1,484,000",
    days: 19,
  },
  {
    image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Digital Renaissance: AR Art Gallery",
    description: "An augmented reality art gallery showcasing digital artists with fractional ownership of exhibited works and secondary market royalties.",
    category: "Art",
    progress: 76,
    target: "$600,000",
    raised: "$456,000",
    days: 11,
  },
  {
    image: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Mythic Realms: Fantasy MMORPG",
    description: "A blockchain-integrated massively multiplayer online role-playing game with player-owned lands, tradable assets, and community governance.",
    category: "Game",
    progress: 94,
    target: "$5,000,000",
    raised: "$4,700,000",
    days: 2,
  },
  {
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Sonic Odyssey: Immersive Audio Experience",
    description: "A revolutionary spatial audio experience that transforms storytelling through sound with tokenized distribution rights and licensing opportunities.",
    category: "Music",
    progress: 61,
    target: "$400,000",
    raised: "$244,000",
    days: 16,
  },
  {
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Startup Chronicles: Entrepreneurship Series",
    description: "A compelling documentary series following tech entrepreneurs with tokenized profit participation and exclusive mentorship opportunities for investors.",
    category: "Series",
    progress: 49,
    target: "$850,000",
    raised: "$416,500",
    days: 25,
  },
  {
    image: "https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Eco Visions: Environmental Art Installation",
    description: "A global series of interactive environmental art installations with carbon credit generation, community engagement, and digital twin NFTs.",
    category: "Art",
    progress: 84,
    target: "$1,100,000",
    raised: "$924,000",
    days: 6,
  },
  {
    image: "https://images.pexels.com/photos/3127880/pexels-photo-3127880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Blockchain Pioneers: Tech Documentary",
    description: "An insightful documentary exploring the evolution of blockchain technology with tokenized viewing rights and exclusive community access.",
    category: "Film",
    progress: 72,
    target: "$700,000",
    raised: "$504,000",
    days: 13,
  },
  {
    image: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Culinary Fusion: Celebrity Chef Cookbook",
    description: "A multimedia cookbook featuring celebrity chefs with tokenized recipe rights, exclusive cooking classes, and restaurant partnership opportunities.",
    category: "Book",
    progress: 68,
    target: "$300,000",
    raised: "$204,000",
    days: 17,
  },
  {
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Digital Frontiers: Tech Innovation Series",
    description: "A cutting-edge TV series exploring breakthrough technologies with tokenized intellectual property rights and early access to featured innovations.",
    category: "TV",
    progress: 57,
    target: "$1,300,000",
    raised: "$741,000",
    days: 21,
  },
  {
    image: "https://images.pexels.com/photos/1601775/pexels-photo-1601775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Rhythm Revolution: Dance Competition Platform",
    description: "A global dance competition platform with tokenized voting rights, talent discovery mechanisms, and performance royalty distribution.",
    category: "Series",
    progress: 63,
    target: "$950,000",
    raised: "$598,500",
    days: 20,
  },
];

const featuredProjects = [
  {
    id: 1,
    title: "Blockbuster Movie Production",
    category: "Film",
    image: "/images/movie-project.jpg",
    progress: 75,
    target: "2.5M",
    raised: "1.875M",
    returns: "18-25%"
  },
];

export function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const projectsPerView = 4;
  
  // Filter projects by category if one is selected
  const filteredProjects = activeCategory 
    ? projectsData.filter(project => project.category.toLowerCase() === activeCategory.toLowerCase())
    : projectsData;
    
  const totalSlides = Math.ceil(filteredProjects.length / projectsPerView);
  
  // Get unique categories
  const categories = Array.from(new Set(projectsData.map(project => project.category)));

  useEffect(() => {
    if (isHovering) return; // Don't auto-rotate while user is interacting
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [totalSlides, isHovering]);
  
  // Reset to first page when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);
  
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      className="py-24 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden"
      id="projects"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <BadgeWithIcon
              icon={ThumbsUp}
              text="PROJECT SHOWCASE"
              className="mb-4"
            />
            <h3 className="text-4xl md:text-5xl font-bold font-display mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Featured Investment Opportunities
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore our carefully curated selection of high-potential creative projects.
              Each has been thoroughly vetted by our investment team.
            </p>
          </div>
        </FadeIn>
        
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            className="rounded-full px-4"
          >
            All Projects
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="rounded-full px-4"
            >
              <div className="flex items-center gap-1.5">
                {(() => {
                  const CategoryIcon = getCategoryIcon(category);
                  return <CategoryIcon className="h-4 w-4" />;
                })()}
                {category}
              </div>
            </Button>
          ))}
        </div>

        <div 
          className="relative overflow-hidden py-4"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
              aria-label="Previous projects"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:block">
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
              aria-label="Next projects"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProjects
                  .slice(
                    currentIndex * projectsPerView,
                    (currentIndex * projectsPerView) + projectsPerView
                  )
                  .map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProjectCard 
                        {...project}
                        index={index}
                      />
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 w-8' 
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-12 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              Explore All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Helper function to get category icon
function getCategoryIcon(category: string) {
  switch(category.toLowerCase()) {
    case "film": return Film;
    case "music": return Music;
    case "book": return Palette;
    case "series": return Gamepad;
    case "tv": return ThumbsUp;
    default: return Folder;
  }
}
