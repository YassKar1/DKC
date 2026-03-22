/**
 * Même mapping que mon-app-frontend (eventTypeImages.ts) — visuels par type, sans backend.
 */
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80&auto=format&fit=crop";

const IMAGES = {
  musique:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80&auto=format&fit=crop",
  art: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80&auto=format&fit=crop",
  social:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop",
  tech: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  gastronomie:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
};

function normalizeTypeLabel(libelle) {
  if (!libelle || typeof libelle !== "string") return "";
  return libelle
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** URL d’image pour le type (libellé API : Musique, Art, …) */
export function getEventImageForType(libelle) {
  const key = normalizeTypeLabel(libelle || "");
  return IMAGES[key] || DEFAULT_IMAGE;
}
