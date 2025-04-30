import { motion } from 'framer-motion';
import { ProjectCard } from './project-card';

const projects = [
  {
    id: 1,
    title: "Urban Heights Development",
    description: "Luxury apartment complex in downtown metropolitan area",
    category: "Art",
    subcategory: "Architecture",
    progress: 75,
    target: 5000000,
    raised: 3750000,
    daysLeft: 15,
    image: "/projects/urban-heights.jpg",
    creator: "Jane Smith",
    creatorAvatar: "/avatars/jane-smith.jpg",
    status: "active" as const,
    featured: false,
    trending: true,
    tags: ["architecture", "urban", "development"],
    licenseType: "Commercial License",
    lastUpdated: "2025-04-15",
    collaborators: 5,
    investors: 42
  },
  {
    id: 2,
    title: "Green Valley Commercial",
    description: "Sustainable office space with LEED certification",
    category: "Technology",
    subcategory: "Green Tech",
    progress: 60,
    target: 8000000,
    raised: 4800000,
    daysLeft: 25,
    image: "/projects/green-valley.jpg",
    creator: "Michael Johnson",
    creatorAvatar: "/avatars/michael-johnson.jpg",
    status: "active" as const,
    featured: true,
    trending: false,
    tags: ["sustainable", "commercial", "green"],
    licenseType: "MIT License",
    lastUpdated: "2025-04-20",
    collaborators: 3,
    investors: 28
  },
  // Add more projects as needed
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function ProjectGrid() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.div>
  );
}
