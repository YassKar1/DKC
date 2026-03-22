import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import EventCard from "../components/EventCard";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import EventglowNavbar from "../components/EventglowNavbar";
import apiService from "../../services/api";
import type { Evenement } from "../lib/types";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState("Tous");
  /** Vide au départ : les liens utilisent uniquement les ids renvoyés par l’API (pas les mocks 1,2,3). */
  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    apiService
      .getAllEvenements()
      .then((data) => {
        if (cancelled) return;
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setEvents([]);
        setLoadError(e instanceof Error ? e.message : "Erreur chargement événements");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "Tous") return events.slice(1);
    return events.filter((e) => e.typeEvenement?.libelle === activeFilter);
  }, [activeFilter, events]);

  const featuredEvent = events[0];

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <EventglowNavbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-28">
        {/* Hero */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-2"
            style={{ letterSpacing: "-0.04em" }}
          >
            Vibrez ici. <span className="text-glow text-primary">Maintenant.</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-4">Découvrez les événements près de chez vous</p>
          {/* Mobile search */}
          <div className="md:hidden">
            <SearchBar events={events} />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div
              className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary"
              aria-hidden
            />
          </div>
        ) : (
          <>
            {/* Featured */}
            <div className="mb-10">{featuredEvent ? <EventCard event={featuredEvent} featured /> : null}</div>

            {/* Filters */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Près de vous</h2>
                <div className="hidden md:block">
                  <SearchBar events={events} />
                </div>
              </div>
              <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>

            {loadError ? (
              <div className="mb-6 glass-thin rounded-xl px-4 py-3 text-sm text-muted-foreground">
                Impossible de charger les événements depuis l’API. ({loadError})
              </div>
            ) : null}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="text-muted-foreground">
                  {events.length === 0
                    ? "Aucun événement pour le moment."
                    : "Aucun événement dans cette catégorie pour le moment."}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;

