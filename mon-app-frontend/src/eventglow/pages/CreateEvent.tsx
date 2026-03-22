import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Tag, Type, FileText, Clock, Euro, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../services/api";
import { categories } from "../lib/mockData";
import { getEventImageForType } from "../lib/eventTypeImages";
import { useAuth } from "../../hooks/useAuth";
import EventglowNavbar from "../components/EventglowNavbar";

interface FormData {
  nom: string;
  type: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  adresse: string;
  codePostal: string;
  ville: string;
  prix: string;
  promo: string;
}

const emptyForm: FormData = {
  nom: "",
  type: "",
  description: "",
  dateDebut: "",
  dateFin: "",
  adresse: "",
  codePostal: "",
  ville: "",
  prix: "",
  promo: "",
};

export default function CreateEvent() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const steps = ["Informations", "Lieu", "Billetterie", "Aperçu"];

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validateStep = (s: number) => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!form.nom.trim()) errs.nom = "Requis";
      if (!form.type) errs.type = "Requis";
      if (!form.description.trim()) errs.description = "Requis";
      if (!form.dateDebut) errs.dateDebut = "Requis";
      if (!form.dateFin) errs.dateFin = "Requis";
    } else if (s === 1) {
      if (!form.adresse.trim()) errs.adresse = "Requis";
      if (!form.codePostal.trim()) errs.codePostal = "Requis";
      if (!form.ville.trim()) errs.ville = "Requis";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      setStep(0);
      return;
    }

    try {
      setSubmitting(true);
      await apiService.createEvenement({
        nomEvenement: form.nom,
        description: form.description,
        dateHeureDebut: form.dateDebut,
        dateHeureFin: form.dateFin,
        prix: form.prix ? parseFloat(form.prix) : undefined,
        promo: form.promo ? parseFloat(form.promo) : undefined,
        lieuDto: {
          adresse: form.adresse,
          codePostal: form.codePostal,
          ville: form.ville,
        },
        typeEvenementDto: { libelle: form.type },
      });
      navigate("/events");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Erreur création événement");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (key: string) =>
    `w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
      errors[key] ? "" : ""
    }`;

  const wrapClass = (key: string) =>
    `flex items-center gap-3 glass-thin rounded-xl px-4 py-3 ${errors[key] ? "ring-1 ring-destructive" : ""}`;

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <EventglowNavbar />
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-28 max-w-2xl">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2" style={{ letterSpacing: "-0.04em" }}>
            Créer l'expérience
          </h1>
          <p className="text-muted-foreground text-sm mb-8">Partagez votre événement avec le monde</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (i < step) setStep(i);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  i === step ? "bg-primary text-primary-foreground" : i < step ? "glass text-foreground" : "glass-thin text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {submitError ? (
            <div className="mb-6 glass-thin rounded-xl px-4 py-3 text-sm text-destructive ring-1 ring-destructive">
              {submitError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="glass rounded-[20px] p-6 space-y-5">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Nom de l'événement *</label>
                    <div className={wrapClass("nom")}>
                      <Type className="w-4 h-4 text-primary shrink-0" />
                      <input type="text" placeholder="Ex: Nuit Électronique" value={form.nom} onChange={set("nom")} className={fieldClass("nom")} />
                    </div>
                    {errors.nom && <p className="text-xs text-destructive mt-1">{errors.nom}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Type d'événement *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.filter((c) => c !== "Tous").map((cat) => {
                        const isActive = form.type === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, type: cat }))}
                            className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                              isActive ? "bg-primary text-primary-foreground" : "glass-thin text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                    {errors.type && <p className="text-xs text-destructive mt-1">{errors.type}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Description *</label>
                    <div className={`flex gap-3 glass-thin rounded-xl px-4 py-3 ${errors.description ? "ring-1 ring-destructive" : ""}`}>
                      <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <textarea
                        rows={4}
                        placeholder="Décrivez votre événement..."
                        value={form.description}
                        onChange={set("description")}
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                      />
                    </div>
                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Début *</label>
                      <div className={wrapClass("dateDebut")}>
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <input type="datetime-local" value={form.dateDebut} onChange={set("dateDebut")} className={fieldClass("dateDebut")} />
                      </div>
                      {errors.dateDebut && <p className="text-xs text-destructive mt-1">{errors.dateDebut}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Fin *</label>
                      <div className={wrapClass("dateFin")}>
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <input type="datetime-local" value={form.dateFin} onChange={set("dateFin")} className={fieldClass("dateFin")} />
                      </div>
                      {errors.dateFin && <p className="text-xs text-destructive mt-1">{errors.dateFin}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="glass rounded-[20px] p-6 space-y-5">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Adresse *</label>
                    <div className={wrapClass("adresse")}>
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <input type="text" placeholder="12 Rue des Arts" value={form.adresse} onChange={set("adresse")} className={fieldClass("adresse")} />
                    </div>
                    {errors.adresse && <p className="text-xs text-destructive mt-1">{errors.adresse}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Code postal *</label>
                      <input
                        type="text"
                        placeholder="75011"
                        value={form.codePostal}
                        onChange={set("codePostal")}
                        className={`w-full glass-thin rounded-xl px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                          errors.codePostal ? "ring-1 ring-destructive" : ""
                        }`}
                      />
                      {errors.codePostal && <p className="text-xs text-destructive mt-1">{errors.codePostal}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Ville *</label>
                      <input
                        type="text"
                        placeholder="Paris"
                        value={form.ville}
                        onChange={set("ville")}
                        className={`w-full glass-thin rounded-xl px-4 py-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                          errors.ville ? "ring-1 ring-destructive" : ""
                        }`}
                      />
                      {errors.ville && <p className="text-xs text-destructive mt-1">{errors.ville}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="glass rounded-[20px] p-6 space-y-5">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Prix d'entrée (€)</label>
                    <div className="flex items-center gap-3 glass-thin rounded-xl px-4 py-3">
                      <Euro className="w-4 h-4 text-primary shrink-0" />
                      <input type="number" step="0.01" min="0" placeholder="0.00" value={form.prix} onChange={set("prix")} className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none tabular-nums" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">Promotion (%)</label>
                    <div className="flex items-center gap-3 glass-thin rounded-xl px-4 py-3">
                      <Tag className="w-4 h-4 text-primary shrink-0" />
                      <input type="number" min="0" max="100" placeholder="0" value={form.promo} onChange={set("promo")} className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none tabular-nums" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="glass rounded-[20px] p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Eye className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Aperçu</h3>
                  </div>

                  <div className="space-y-5">
                    {form.type ? (
                      <div className="relative h-44 rounded-xl overflow-hidden border border-border">
                        <img
                          src={getEventImageForType(form.type)}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>
                    ) : null}
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-primary text-primary-foreground mb-3">
                        {form.type || "Type"}
                      </span>
                      <h2 className="text-2xl font-bold text-foreground" style={{ letterSpacing: "-0.04em" }}>
                        {form.nom || "Nom de l'événement"}
                      </h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{form.description || "Description..."}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between mt-6">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl glass-thin text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Précédent
                </button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <button type="button" onClick={goNext} className="px-6 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground transition-colors">
                  Suivant
                </button>
              ) : (
                <button type="submit" disabled={submitting} className="px-8 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground transition-colors disabled:opacity-60">
                  {submitting ? "Publication…" : "Publier l'événement"}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
