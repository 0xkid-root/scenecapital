"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Film, 
  Music, 
  BookOpen, 
  Tv, 
  MoreHorizontal, 
  ExternalLink, 
  DollarSign,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

// Sample data for tokenized IP assets
const tokenizedIPs = [
  {
    id: 1,
    title: "Cosmic Odyssey",
    type: "Film",
    creator: "Elena Rodriguez",
    value: "$125,000",
    holders: 342,
    roi: "+18.5%",
    status: "Active",
    image: "/images/projects/cosmic-odyssey.jpg"
  },
  {
    id: 2,
    title: "Echoes of Tomorrow",
    type: "Music",
    creator: "Marcus Chen",
    value: "$48,500",
    holders: 215,
    roi: "+12.3%",
    status: "Active",
    image: "/images/projects/echoes-album.jpg"
  },
  {
    id: 3,
    title: "The Silent Protocol",
    type: "Book",
    creator: "Amara Johnson",
    value: "$67,200",
    holders: 189,
    roi: "+9.7%",
    status: "Active",
    image: "/images/projects/silent-protocol.jpg"
  },
  {
    id: 4,
    title: "Neon Shadows",
    type: "Web Series",
    creator: "Kai Nakamura",
    value: "$82,300",
    holders: 276,
    roi: "+21.4%",
    status: "Active",
    image: "/images/projects/neon-shadows.jpg"
  }
];

// Helper function to get the appropriate icon for each IP type
const getTypeIcon = (type: string) => {
  switch (type) {
    case "Film":
      return <Film className="h-5 w-5" />;
    case "Music":
      return <Music className="h-5 w-5" />;
    case "Book":
      return <BookOpen className="h-5 w-5" />;
    case "Web Series":
    case "TV":
      return <Tv className="h-5 w-5" />;
    default:
      return <Film className="h-5 w-5" />;
  }
};

// Helper function to get the appropriate color class for each IP type
const getTypeColorClass = (type: string) => {
  switch (type) {
    case "Film":
      return "bg-blue-500/10 text-blue-500";
    case "Music":
      return "bg-purple-500/10 text-purple-500";
    case "Book":
      return "bg-amber-500/10 text-amber-500";
    case "Web Series":
    case "TV":
      return "bg-emerald-500/10 text-emerald-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

export function TokenizedIPCards() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Tokenized IP Assets</h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tokenizedIPs.map((ip) => (
          <motion.div 
            key={ip.id} 
            variants={item} 
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="overflow-hidden h-full bg-card/80 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-float">
              {/* Image section with gradient overlay */}
              <div className="relative h-48 overflow-hidden">
                {/* This would be an actual image in production */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"
                  style={{
                    backgroundImage: `url(${ip.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${getTypeColorClass(ip.type)} border-0`}
                  >
                    {getTypeIcon(ip.type)}
                    <span>{ip.type}</span>
                  </Badge>
                </div>
                
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-0">
                    {ip.status}
                  </Badge>
                </div>
                
                {/* Title and creator */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white truncate">{ip.title}</h3>
                  <p className="text-sm text-white/80">by {ip.creator}</p>
                </div>
              </div>
              
              {/* Stats section */}
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Value
                    </p>
                    <p className="font-medium">{ip.value}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Holders
                    </p>
                    <p className="font-medium">{ip.holders}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-600 font-medium">
                    ROI: {ip.roi}
                  </div>
                  <div className="flex space-x-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
