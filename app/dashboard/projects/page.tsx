"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Calendar, TrendingUp, Clock, Film, Music, BookOpen, Palette, Code, Gamepad2, Tv2, Theater, Sparkles } from "lucide-react";

// Extended project interface with more detailed information
interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  progress: number;
  target: number;
  raised: number;
  daysLeft: number;
  image: string;
  creator: string;
  creatorAvatar: string;
  status: "active" | "completed" | "draft";
  featured?: boolean;
  trending?: boolean;
  tags: string[];
  licenseType: string;
  releaseDate?: string;
  lastUpdated: string;
  collaborators?: number;
  investors?: number;
}

// Comprehensive mock data with various categories and statuses
const projectsData: Project[] = [
  {
    id: 1,
    title: "Ethereal Echoes: The Documentary",
    description: "A groundbreaking documentary exploring the intersection of blockchain technology and traditional art markets.",
    category: "Film",
    subcategory: "Documentary",
    progress: 78,
    target: 150000,
    raised: 117000,
    daysLeft: 12,
    image: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg",
    creator: "Aria Visuals",
    creatorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "active",
    featured: true,
    tags: ["blockchain", "art", "documentary", "technology"],
    licenseType: "Creative Commons",
    releaseDate: "2025-08-15",
    lastUpdated: "2025-04-25",
    collaborators: 8,
    investors: 142
  },
  {
    id: 2,
    title: "Decentralized Symphony Orchestra",
    description: "The world's first orchestra with tokenized ownership, allowing fans to participate in creative decisions.",
    category: "Music",
    subcategory: "Classical",
    progress: 65,
    target: 200000,
    raised: 130000,
    daysLeft: 18,
    image: "https://images.pexels.com/photos/164693/pexels-photo-164693.jpeg",
    creator: "Harmony Collective",
    creatorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "active",
    trending: true,
    tags: ["orchestra", "classical", "tokenized", "community"],
    licenseType: "Exclusive Rights",
    releaseDate: "2025-07-30",
    lastUpdated: "2025-04-22",
    collaborators: 45,
    investors: 215
  },
  {
    id: 3,
    title: "Neon Nights: Cyberpunk Novel Series",
    description: "A dystopian cyberpunk novel series exploring themes of technology, identity, and corporate power.",
    category: "Literature",
    subcategory: "Science Fiction",
    progress: 100,
    target: 75000,
    raised: 75000,
    daysLeft: 0,
    image: "https://images.pexels.com/photos/1637439/pexels-photo-1637439.jpeg",
    creator: "Nova Writers",
    creatorAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    status: "completed",
    tags: ["cyberpunk", "novel", "sci-fi", "dystopian"],
    licenseType: "Standard Licensing",
    releaseDate: "2025-03-10",
    lastUpdated: "2025-03-10",
    investors: 320
  },
  {
    id: 4,
    title: "Quantum Realm: Interactive VR Experience",
    description: "An immersive VR experience that takes users through the quantum world with educational elements.",
    category: "Gaming",
    subcategory: "VR",
    progress: 45,
    target: 300000,
    raised: 135000,
    daysLeft: 30,
    image: "https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg",
    creator: "Quantum Studios",
    creatorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    status: "active",
    trending: true,
    tags: ["VR", "quantum", "educational", "interactive"],
    licenseType: "Proprietary",
    releaseDate: "2025-10-05",
    lastUpdated: "2025-04-26",
    collaborators: 12,
    investors: 89
  },
  {
    id: 5,
    title: "Abstract Realities: Digital Art Collection",
    description: "A curated collection of digital art pieces exploring the boundaries between reality and abstraction.",
    category: "Art",
    subcategory: "Digital",
    progress: 90,
    target: 50000,
    raised: 45000,
    daysLeft: 5,
    image: "https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg",
    creator: "Digital Dreamers",
    creatorAvatar: "https://randomuser.me/api/portraits/women/56.jpg",
    status: "active",
    featured: true,
    tags: ["digital art", "abstract", "NFT", "collection"],
    licenseType: "NFT License",
    releaseDate: "2025-05-15",
    lastUpdated: "2025-04-24",
    collaborators: 5,
    investors: 178
  },
  {
    id: 6,
    title: "Code Odyssey: Open Source Framework",
    description: "A revolutionary open-source development framework designed to streamline blockchain application development.",
    category: "Technology",
    subcategory: "Software",
    progress: 82,
    target: 120000,
    raised: 98400,
    daysLeft: 8,
    image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
    creator: "TechNexus",
    creatorAvatar: "https://randomuser.me/api/portraits/men/46.jpg",
    status: "active",
    tags: ["open-source", "blockchain", "development", "framework"],
    licenseType: "MIT License",
    releaseDate: "2025-06-01",
    lastUpdated: "2025-04-27",
    collaborators: 24,
    investors: 112
  },
  {
    id: 7,
    title: "Chromatic Harmony: Experimental Music Album",
    description: "An experimental music album blending electronic, classical, and world music with innovative sound design.",
    category: "Music",
    subcategory: "Electronic",
    progress: 35,
    target: 80000,
    raised: 28000,
    daysLeft: 40,
    image: "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg",
    creator: "Sonic Explorers",
    creatorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    status: "active",
    tags: ["experimental", "electronic", "album", "sound design"],
    licenseType: "Creative Commons",
    releaseDate: "2025-09-20",
    lastUpdated: "2025-04-20",
    collaborators: 7,
    investors: 65
  },
  {
    id: 8,
    title: "Mythic Realms: Fantasy Series",
    description: "A high-fantasy television series with elaborate world-building and character-driven narratives.",
    category: "Television",
    subcategory: "Fantasy",
    progress: 15,
    target: 500000,
    raised: 75000,
    daysLeft: 60,
    image: "https://images.pexels.com/photos/6272219/pexels-photo-6272219.jpeg",
    creator: "Epic Narratives",
    creatorAvatar: "https://randomuser.me/api/portraits/men/62.jpg",
    status: "active",
    tags: ["fantasy", "series", "television", "world-building"],
    licenseType: "Exclusive Rights",
    releaseDate: "2026-01-15",
    lastUpdated: "2025-04-15",
    collaborators: 35,
    investors: 42
  },
  {
    id: 9,
    title: "Renaissance Revival: Theater Production",
    description: "A modern reinterpretation of Renaissance theater with innovative staging and immersive elements.",
    category: "Theater",
    subcategory: "Drama",
    progress: 68,
    target: 180000,
    raised: 122400,
    daysLeft: 22,
    image: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg",
    creator: "Stage Visionaries",
    creatorAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    status: "active",
    tags: ["theater", "renaissance", "immersive", "production"],
    licenseType: "Performance Rights",
    releaseDate: "2025-07-10",
    lastUpdated: "2025-04-23",
    collaborators: 18,
    investors: 95
  },
  {
    id: 10,
    title: "Cosmic Pioneers: Sci-Fi Game",
    description: "An expansive space exploration game with procedurally generated worlds and complex resource management.",
    category: "Gaming",
    subcategory: "Strategy",
    progress: 0,
    target: 250000,
    raised: 0,
    daysLeft: 0,
    image: "https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg",
    creator: "Stellar Games",
    creatorAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
    status: "draft",
    tags: ["space", "exploration", "strategy", "procedural"],
    licenseType: "Proprietary",
    lastUpdated: "2025-04-10",
    collaborators: 9
  }
];

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "Film": <Film className="h-4 w-4" />,
  "Music": <Music className="h-4 w-4" />,
  "Literature": <BookOpen className="h-4 w-4" />,
  "Art": <Palette className="h-4 w-4" />,
  "Technology": <Code className="h-4 w-4" />,
  "Gaming": <Gamepad2 className="h-4 w-4" />,
  "Television": <Tv2 className="h-4 w-4" />,
  "Theater": <Theater className="h-4 w-4" />
};

export default function ProjectsPage() {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData);
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter and sort projects based on current criteria
  useEffect(() => {
    let result = [...projectsData];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by tab
    if (activeTab === "featured") {
      result = result.filter(project => project.featured);
    } else if (activeTab === "trending") {
      result = result.filter(project => project.trending);
    } else if (activeTab === "my-projects") {
      // In a real app, this would filter to show only the user's projects
      // For mock data, we'll just show some random ones
      result = result.filter(project => [1, 3, 5, 10].includes(project.id));
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(project => project.category === selectedCategory);
    }
    
    // Filter by status
    if (selectedStatus !== "all") {
      result = result.filter(project => project.status === selectedStatus);
    }
    
    // Sort projects
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
        break;
      case "most-funded":
        result.sort((a, b) => b.raised - a.raised);
        break;
      case "least-funded":
        result.sort((a, b) => a.raised - b.raised);
        break;
      case "ending-soon":
        result.sort((a, b) => {
          // Put completed projects at the end
          if (a.status === "completed" && b.status !== "completed") return 1;
          if (a.status !== "completed" && b.status === "completed") return -1;
          return a.daysLeft - b.daysLeft;
        });
        break;
      default:
        break;
    }
    
    setFilteredProjects(result);
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, activeTab]);

  // Get unique categories from projects
  const uniqueCategories = Array.from(new Set(projectsData.map(project => project.category)));
  const categories = ["all", ...uniqueCategories];

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      {/* Header with title and stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
          <p className="text-muted-foreground mt-1">Manage and track your creative projects</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="px-3 py-1 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Film className="h-3.5 w-3.5 mr-1.5" />
            <span className="font-medium">{projectsData.filter(p => p.status === "active").length} Active</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            <span className="font-medium">{projectsData.filter(p => p.status === "completed").length} Completed</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span className="font-medium">{projectsData.filter(p => p.status === "draft").length} Drafts</span>
          </Badge>
        </div>
      </div>
      
      {/* Tabs for different project views */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-auto md:inline-flex mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center">
                        {category !== "all" && categoryIcons[category]}
                        <span className={category !== "all" ? "ml-2" : ""}>
                          {category === "all" ? "All Categories" : category}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="most-funded">Most Funded</SelectItem>
                  <SelectItem value="least-funded">Least Funded</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Project grid with animation */}
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div 
                key="projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn't find any projects matching your current filters. Try adjusting your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedStatus("all");
                    setSortBy("newest");
                  }}
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
        
        {/* Other tab contents - they all use the same filtered projects based on the tab */}
        <TabsContent value="my-projects" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Your Created Projects</h3>
            <Button size="sm">
              <span className="mr-2">+</span> New Project
            </Button>
          </div>
          
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div 
                key="my-projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-my-projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <p className="text-muted-foreground">You don't have any projects yet.</p>
                <Button className="mt-4">
                  Create Your First Project
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div 
                key="featured-projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-featured"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <p className="text-muted-foreground">No featured projects available.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div 
                key="trending-projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-trending"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <p className="text-muted-foreground">No trending projects at the moment.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}