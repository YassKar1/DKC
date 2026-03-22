/**
 * Visuels fixes par type d'événement (front uniquement — pas de champ en base).
 * URLs Unsplash stables ; même logique côté app mobile.
 */
const DEFAULT_IMAGE = "/placeholder.svg";

/** Clés = libellés normalisés (minuscules, sans accent pour robustesse) */
const IMAGES: Record<string, string> = {
  musique: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80&auto=format&fit=crop",
  art: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80&auto=format&fit=crop",
  social: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80&auto=format&fit=crop",
  // Photo + params ixlib : l’ancienne URL (conférence) renvoyait souvent 404 / blocage hotlink
  tech: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  gastronomie: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop",
};

function normalizeTypeLabel(libelle: string): string {
  return libelle
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Retourne l’URL d’image à afficher pour un libellé de type (ex. « Musique »).
 */
export function getEventImageForType(libelle: string | undefined | null): string {
  if (!libelle) return DEFAULT_IMAGE;
  const key = normalizeTypeLabel(libelle);
  return IMAGES[key] ?? DEFAULT_IMAGE;
}
