import { motion } from "framer-motion";
import { categories } from "../lib/mockData";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar = ({ activeFilter, onFilterChange }: FilterBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-2 overflow-x-auto pb-2"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeFilter === cat ? "bg-primary text-primary-foreground" : "glass-thin text-muted-foreground hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </motion.div>
  );
};

export default FilterBar;

