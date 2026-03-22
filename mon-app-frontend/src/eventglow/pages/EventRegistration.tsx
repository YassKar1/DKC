import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Wallet, Smartphone } from "lucide-react";
import apiService from "../../services/api";
import type { Evenement } from "../lib/types";
import { mockEvents } from "../lib/mockData";
import { useAuth } from "../../hooks/useAuth";
import EventglowNavbar from "../components/EventglowNavbar";

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState<Evenement | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checkingAlready, setCheckingAlready] = useState(false);

  const eventId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    if (!Number.isFinite(eventId)) {
      setLoadError("Id événement invalide");
      return;
    }

    let cancelled = false;
    setLoadError(null);

    apiService
      .getEvenementById(eventId)
      .then((data) => {
        if (!cancelled) {
          setEvent(data);
          setLoadError(null);
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const fallback = mockEvents.find((m) => m.id === eventId) ?? null;
        setEvent(fallback);
        setLoadError(e instanceof Error ? e.message : "Erreur chargement événement");
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  useEffect(() => {
    if (!event || !isAuthenticated || loadError) {
      setAlreadyRegistered(false);
      setCheckingAlready(false);
      return;
    }
    let cancelled = false;
    setCheckingAlready(true);
    apiService
      .isRegisteredForEvent(eventId)
      .then((registered) => {
        if (!cancelled) setAlreadyRegistered(registered);
      })
      .catch(() => {
        if (!cancelled) setAlreadyRegistered(false);
      })
      .finally(() => {
        if (!cancelled) setCheckingAlready(false);
      });
    return () => {
      cancelled = true;
    };
  }, [event, isAuthenticated, eventId, loadError]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{loadError ? `Erreur: ${loadError}` : "Chargement…"}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-[24px] p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Connexion requise</h2>
          <p className="text-sm text-muted-foreground mb-4">Vous devez être connecté pour vous inscrire à un événement.</p>
          <Link to="/login" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-block">
            Aller au login
          </Link>
        </div>
      </div>
    );
  }

  if (checkingAlready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Vérification de votre inscription…</p>
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen pb-24 md:pb-12">
        <EventglowNavbar />
        <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-28 max-w-lg">
          <div className="glass rounded-[24px] p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Déjà inscrit</h2>
            <p className="text-sm text-muted-foreground">Vous participez déjà à cet événement.</p>
            <Link
              to={`/events/${event.id}`}
              className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Retour à l&apos;événement
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = (event.prix ?? 0) > 0;
  const isFull = (event.capaciteMax ?? 0) > 0 ? (event.inscrits ?? 0) >= (event.capaciteMax ?? 0) : false;

  if (isFull) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-[24px] p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Complet !</h2>
          <p className="text-sm text-muted-foreground mb-4">Cet événement n'a plus de places disponibles.</p>
          <Link to={`/events/${event.id}`} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-block">
            Retour
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nom.trim()) errs.nom = "Requis";
    if (!prenom.trim()) errs.prenom = "Requis";
    if (!email.trim()) errs.email = "Requis";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Email invalide";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      await apiService.createInscription({
        evenementId: eventId,
        nom: nom.trim(),
        prenom: prenom.trim(),
        mail: email.trim(),
      });
      navigate(`/events/${eventId}`);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Inscription impossible");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: "card", label: "Carte bancaire", icon: CreditCard },
    { id: "paypal", label: "PayPal", icon: Wallet },
    { id: "apple", label: "Apple Pay", icon: Smartphone },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <EventglowNavbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-28 max-w-lg">
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1" style={{ letterSpacing: "-0.04em" }}>
            {isPaid ? "Paiement & Inscription" : "Inscription"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{event.nomEvenement}</p>

          {submitError ? (
            <div className="mb-6 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm ring-1 ring-destructive/30">
              {submitError}
            </div>
          ) : null}

          {isPaid && (
            <div className="glass rounded-[20px] p-6 mb-6 text-center">
              <span className="text-3xl font-bold tabular-nums text-foreground">{event.prix != null ? Number(event.prix).toFixed(2) : "0.00"}€</span>
              <p className="text-xs text-muted-foreground mt-1">Montant à payer</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="glass rounded-[20px] p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vos informations</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className={`w-full glass-thin rounded-xl px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                      errors.prenom ? "ring-1 ring-destructive" : ""
                    }`}
                  />
                  {errors.prenom && <p className="text-xs text-destructive mt-1">{errors.prenom}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className={`w-full glass-thin rounded-xl px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                      errors.nom ? "ring-1 ring-destructive" : ""
                    }`}
                  />
                  {errors.nom && <p className="text-xs text-destructive mt-1">{errors.nom}</p>}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full glass-thin rounded-xl px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                    errors.email ? "ring-1 ring-destructive" : ""
                  }`}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>

            {isPaid && (
              <div className="glass rounded-[20px] p-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Méthode de paiement</h3>
                <div className="space-y-2">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                        paymentMethod === pm.id ? "bg-primary/15 ring-1 ring-primary text-foreground" : "glass-thin text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <pm.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{pm.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-3 pt-2">
                    <input
                      type="text"
                      placeholder="Numéro de carte"
                      className="w-full glass-thin rounded-xl px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none tabular-nums"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full glass-thin rounded-xl px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none tabular-nums"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full glass-thin rounded-xl px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none tabular-nums"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:pointer-events-none"
            >
              {submitting
                ? "Enregistrement…"
                : isPaid
                  ? `Payer ${event.prix != null ? Number(event.prix).toFixed(2) : "0.00"}€`
                  : "Confirmer l'inscription"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

