import { motion } from 'framer-motion';

interface ProjectFiltersProps {
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function ProjectFilters({ currentFilter, onFilterChange }: ProjectFiltersProps) {
  const filters = [
    { id: "all", label: "All Projects" },
    { id: "film", label: "Film" },
    { id: "music", label: "Music" },
    { id: "art", label: "Art" },
    { id: "games", label: "Games" }
  ];

  return (
    <motion.div 
      className="flex flex-wrap items-center gap-3 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {filters.map((filter, index) => (
        <motion.button
          key={filter.id}
          onClick={() => onFilterChange?.(filter.id)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${currentFilter === filter.id
              ? "bg-gradient-modern text-white shadow-lg"
              : "bg-card/50 backdrop-blur-sm hover:bg-card text-muted-foreground hover:text-foreground"
            }
          `}
        >
          {filter.label}
        </motion.button>
      ))}
    </motion.div>
  );
}