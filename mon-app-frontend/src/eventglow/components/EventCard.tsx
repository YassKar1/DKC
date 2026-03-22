import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Evenement } from "../lib/types";
import EventCoverImage from "./EventCoverImage";

interface EventCardProps {
  event: Evenement;
  featured?: boolean;
}

const EventCard = ({ event, featured = false }: EventCardProps) => {
  const dateFormatted = format(new Date(event.dateHeureDebut), "d MMM · HH:mm", { locale: fr });

  if (featured) {
    return (
      <Link to={`/events/${event.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-[24px] glass cursor-pointer group"
        >
          <div className="relative h-[400px] md:h-[500px]">
            <EventCoverImage
              src={event.image}
              alt={event.nomEvenement}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em] mb-3">
                {event.typeEvenement?.libelle ?? "Événement"} · Featured
              </span>
              <h2
                className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3"
                style={{ letterSpacing: "-0.04em" }}
              >
                {event.nomEvenement}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl text-pretty mb-6">
                {event.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {dateFormatted}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {event.lieu?.nom} · {event.distance}km
                  </span>
                </div>
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {event.prix === 0 || event.prix == null ? "Gratuit" : `${Number(event.prix).toFixed(2)}€`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/events/${event.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative overflow-hidden rounded-[20px] glass cursor-pointer group h-full"
      >
        <div className="relative aspect-[4/5]">
          <EventCoverImage
            src={event.image}
            alt={event.nomEvenement}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider glass-thin text-foreground">
              {event.typeEvenement?.libelle ?? "Événement"}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 rounded-full text-sm font-bold tabular-nums bg-primary text-primary-foreground">
              {event.prix === 0 || event.prix == null ? "Gratuit" : `${Number(event.prix).toFixed(2)}€`}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="text-[11px] font-mono text-primary uppercase tracking-[0.15em]">{dateFormatted}</span>
            <h3 className="text-lg font-semibold tracking-tight text-foreground mt-1 leading-tight">{event.nomEvenement}</h3>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.lieu?.nom} · {event.distance}km
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default EventCard;
