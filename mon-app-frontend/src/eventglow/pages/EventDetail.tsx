import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import apiService from "../../services/api";
import type { Evenement } from "../lib/types";
import { mockEvents } from "../lib/mockData";
import { useAuth } from "../../hooks/useAuth";
import EventglowNavbar from "../components/EventglowNavbar";
import EventCoverImage from "../components/EventCoverImage";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState<Evenement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);

  const eventId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    if (!Number.isFinite(eventId)) {
      setError("Id événement invalide");
      return;
    }

    let cancelled = false;
    setError(null);

    apiService
      .getEvenementById(eventId)
      .then((data) => {
        if (!cancelled) setEvent(data);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        // fallback mock pour garder le visuel
        const fallback = mockEvents.find((m) => m.id === eventId) ?? null;
        setEvent(fallback);
        setError(e instanceof Error ? e.message : "Erreur récupération événement");
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  useEffect(() => {
    if (!isAuthenticated || !Number.isFinite(eventId) || error) {
      setIsRegistered(false);
      return;
    }
    let cancelled = false;
    setCheckingRegistration(true);
    apiService
      .isRegisteredForEvent(eventId)
      .then((registered) => {
        if (!cancelled) setIsRegistered(registered);
      })
      .catch(() => {
        if (!cancelled) setIsRegistered(false);
      })
      .finally(() => {
        if (!cancelled) setCheckingRegistration(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId, isAuthenticated, error]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{error ? `Erreur: ${error}` : "Chargement…"}</p>
      </div>
    );
  }

  const dateDebut = new Date(event.dateHeureDebut);
  const dateFin = new Date(event.dateHeureFin);
  const placesRestantes = (event.capaciteMax ?? 0) - (event.inscrits ?? 0);
  const isFull = (event.capaciteMax ?? 0) > 0 ? placesRestantes <= 0 : false;
  const fullAddress = event.lieu ? `${event.lieu.adresse}, ${event.lieu.codePostal} ${event.lieu.ville}` : "";

  const refreshEvent = () => {
    if (!Number.isFinite(eventId)) return;
    apiService
      .getEvenementById(eventId)
      .then(setEvent)
      .catch(() => {});
  };

  const handleInscriptionClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isRegistered) {
      if (!confirm("Se désinscrire de cet événement ?")) return;
      setUnsubscribing(true);
      try {
        await apiService.deleteMyInscription(eventId);
        setIsRegistered(false);
        refreshEvent();
      } catch (e: unknown) {
        alert(e instanceof Error ? e.message : "Erreur lors de la désinscription");
      } finally {
        setUnsubscribing(false);
      }
      return;
    }
    navigate(`/events/${eventId}/register`);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <EventglowNavbar />
      {/* Hero image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <EventCoverImage
          src={event.image}
          alt={event.nomEvenement}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute top-20 left-4 md:left-8 z-10">
          <Link
            to="/events"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors glass-thin px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 -mt-32 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em]">
              {event.typeEvenement?.libelle ?? "Événement"}
            </span>
            {error ? <span className="text-xs text-muted-foreground">(fallback mock: {error})</span> : null}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4" style={{ letterSpacing: "-0.04em" }}>
            {event.nomEvenement}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Main info */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass rounded-[20px] p-6 md:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">À propos</h3>
                <p className="text-foreground text-pretty leading-relaxed">{event.description}</p>
              </div>

              <div className="glass rounded-[20px] p-6 md:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Détails</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{format(dateDebut, "EEEE d MMMM yyyy", { locale: fr })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-foreground tabular-nums">
                      {format(dateDebut, "HH:mm", { locale: fr })} — {format(dateFin, "HH:mm", { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-foreground">
                      {event.lieu?.nom ? `${event.lieu.nom}${fullAddress ? `, ${fullAddress}` : ""}` : "Lieu à confirmer"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="glass rounded-[20px] p-6 sticky top-24">
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold tabular-nums text-foreground">
                    {event.prix === 0 || event.prix === undefined ? "—" : `${Number(event.prix).toFixed(2)}€`}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">Tarif</p>
                </div>

                <button
                  onClick={handleInscriptionClick}
                  disabled={
                    unsubscribing ||
                    (isAuthenticated && checkingRegistration && !error) ||
                    (isFull && !isRegistered)
                  }
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    isFull && !isRegistered
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : isRegistered
                        ? "bg-secondary text-secondary-foreground ring-1 ring-border hover:bg-secondary/80"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isFull && !isRegistered
                    ? "Complet"
                    : isAuthenticated && checkingRegistration && !error
                      ? "…"
                      : isRegistered
                        ? unsubscribing
                          ? "Désinscription…"
                          : "Se désinscrire"
                        : "S'inscrire"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

