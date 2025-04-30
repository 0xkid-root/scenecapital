import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, Film, Music, BookOpen, Palette, Code, Gamepad2, Tv2, Theater, Star, TrendingUp, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced Project interface matching the data structure
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

interface ProjectCardProps {
  project: Project;
}

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

// Status badge variants
const statusVariants: Record<string, { bg: string, text: string, border: string }> = {
  "active": { 
    bg: "bg-blue-50 dark:bg-blue-950", 
    text: "text-blue-700 dark:text-blue-300", 
    border: "border-blue-200 dark:border-blue-800" 
  },
  "completed": { 
    bg: "bg-green-50 dark:bg-green-950", 
    text: "text-green-700 dark:text-green-300", 
    border: "border-green-200 dark:border-green-800" 
  },
  "draft": { 
    bg: "bg-amber-50 dark:bg-amber-950", 
    text: "text-amber-700 dark:text-amber-300", 
    border: "border-amber-200 dark:border-amber-800" 
  }
};

export function ProjectCard({ project }: ProjectCardProps) {
  // Get status styling
  const statusStyle = statusVariants[project.status] || statusVariants.active;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-xl border bg-card/30 backdrop-blur-md backdrop-filter transition-all hover:shadow-xl">
      
      {/* Featured and Trending Badges */}
      <div className="absolute top-3 left-3 z-20 flex gap-2">
        {project.featured && (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
            <Star className="h-3 w-3 mr-1" /> Featured
          </Badge>
        )}
        {project.trending && (
          <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
            <TrendingUp className="h-3 w-3 mr-1" /> Trending
          </Badge>
        )}
      </div>
      
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-20">
        <Badge variant="outline" className={cn("font-medium", statusStyle.bg, statusStyle.text, statusStyle.border)}>
          {project.status === "active" && "Active"}
          {project.status === "completed" && "Completed"}
          {project.status === "draft" && "Draft"}
        </Badge>
      </div>
      
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        <img 
          src={project.image} 
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 z-20">
          <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-sm">
            {categoryIcons[project.category]}
            <span className="ml-1.5">{project.category}</span>
            {project.subcategory && <span className="opacity-70"> · {project.subcategory}</span>}
          </Badge>
        </div>
        
        {/* Creator Info */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-white/20">
            <AvatarImage src={project.creatorAvatar} alt={project.creator} />
            <AvatarFallback>{project.creator.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-white/90 backdrop-blur-sm bg-black/30 px-2 py-0.5 rounded-full">
            {project.creator}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Title & Description */}
        <h3 className="font-display text-xl font-bold tracking-tight mb-2 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>
        
        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal px-2 py-0.5">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Progress Bar */}
        {project.status !== "draft" && (
          <div className="space-y-2 mb-4">
            <div className="h-2 w-full rounded-full bg-slate-200/20 dark:bg-slate-700/20 backdrop-blur-sm">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className={cn(
                  "h-full rounded-full", 
                  project.status === "completed" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                    : "bg-gradient-to-r from-blue-500 to-indigo-500"
                )}
              />
            </div>
            <div className="flex justify-between text-sm">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-medium text-foreground">
                {formatCurrency(project.raised)}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground">
                {formatCurrency(project.target)}
              </motion.span>
            </div>
          </div>
        )}
        
        {/* License Type */}
        <div className="flex items-center mb-4 text-sm text-muted-foreground">
          <FileText className="h-4 w-4 mr-1.5" />
          <span>{project.licenseType}</span>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {project.status !== "draft" && (
              <>
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  project.status === "completed" ? "bg-green-500" : "bg-blue-500"
                )} />
                <span className="text-sm font-medium">{project.progress}% Funded</span>
              </>
            )}
            {project.status === "draft" && (
              <span className="text-sm font-medium text-muted-foreground">In Development</span>
            )}
          </div>
          
          <div className="flex gap-3">
            {project.investors && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{project.investors}</span>
              </div>
            )}
            
            {project.status === "active" && project.daysLeft > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{project.daysLeft} days left</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}