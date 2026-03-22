import type { Evenement } from "./types";
import { getEventImageForType } from "./eventTypeImages";

export const mockEvents: Evenement[] = [
  {
    id: 1,
    nomEvenement: "Nuit Électronique",
    description:
      "Une soirée immersive avec les meilleurs DJs de la scène underground. Ambiance sonore et visuelle à couper le souffle.",
    dateHeureDebut: "2026-03-28T22:00:00",
    dateHeureFin: "2026-03-29T05:00:00",
    lieu: { id: 1, nom: "Le Warehouse", adresse: "12 Rue des Arts", codePostal: "75011", ville: "Paris", lat: 48.8606, lng: 2.3781 },
    prix: 25.0,
    typeEvenement: { id: 1, libelle: "Musique" },
    image: getEventImageForType("Musique"),
    distance: 1.2,
    capaciteMax: 500,
    inscrits: 342,
  },
  {
    id: 2,
    nomEvenement: "Vernissage Contemporain",
    description: "Exposition d'artistes émergents mêlant peinture digitale et installations interactives.",
    dateHeureDebut: "2026-03-22T18:00:00",
    dateHeureFin: "2026-03-22T22:00:00",
    lieu: { id: 2, nom: "Galerie Nova", adresse: "45 Bd Voltaire", codePostal: "75003", ville: "Paris", lat: 48.8632, lng: 2.3694 },
    prix: 0,
    typeEvenement: { id: 2, libelle: "Art" },
    image: getEventImageForType("Art"),
    distance: 0.8,
    capaciteMax: 150,
    inscrits: 89,
  },
  {
    id: 3,
    nomEvenement: "Festival Sunset",
    description: "Festival en plein air avec musique live, food trucks et ambiance estivale au coucher du soleil.",
    dateHeureDebut: "2026-04-05T16:00:00",
    dateHeureFin: "2026-04-05T23:00:00",
    lieu: { id: 3, nom: "Parc Floral", adresse: "Route de la Pyramide", codePostal: "75012", ville: "Paris", lat: 48.8383, lng: 2.4453 },
    prix: 35.0,
    typeEvenement: { id: 1, libelle: "Musique" },
    image: getEventImageForType("Musique"),
    distance: 3.5,
    capaciteMax: 2000,
    inscrits: 1847,
  },
];

export const categories = ["Tous", "Musique", "Art", "Social", "Tech", "Gastronomie"];

