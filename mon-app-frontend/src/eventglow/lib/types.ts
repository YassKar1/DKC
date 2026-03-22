export interface Lieu {
  id: number;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  lat?: number;
  lng?: number;
}

export interface TypeEvenement {
  id: number;
  libelle: string;
}

export interface Evenement {
  id: number;
  nomEvenement: string;
  description: string;
  dateHeureDebut: string;
  dateHeureFin: string;
  lieu?: Lieu;
  prix?: number;
  promo?: number;
  typeEvenement?: TypeEvenement;
  image: string;
  distance?: number;
  capaciteMax?: number;
  inscrits?: number;
}

