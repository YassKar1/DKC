import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Evenement } from "../lib/types";
import EventCoverImage from "./EventCoverImage";

type SearchBarProps = {
  /** Événements réels (API) — les liens utilisent leurs ids en base */
  events: Evenement[];
};

const SearchBar = ({ events }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results =
    query.trim().length > 1
      ? events.filter(
          (e) =>
            e.nomEvenement.toLowerCase().includes(query.toLowerCase()) ||
            e.lieu?.nom.toLowerCase().includes(query.toLowerCase()) ||
            e.lieu?.ville.toLowerCase().includes(query.toLowerCase()) ||
            e.typeEvenement?.libelle.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 glass-thin rounded-xl px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Rechercher un événement..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="text-muted-foreground hover:text-foreground"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {results.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors"
              >
                <EventCoverImage src={event.image} alt={event.nomEvenement} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{event.nomEvenement}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.typeEvenement?.libelle} · {event.lieu?.ville}
                  </p>
                </div>
                <span className="text-xs font-bold tabular-nums text-primary">
                  {event.prix === 0 || event.prix == null ? "Gratuit" : `${Number(event.prix).toFixed(2)}€`}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;

