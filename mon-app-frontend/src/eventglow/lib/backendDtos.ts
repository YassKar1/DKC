export interface LieuDto {
  id?: number;
  adresse?: string;
  ville?: string;
  codePostal?: string;
}

export interface TypeEvenementDto {
  id?: number;
  libelle?: string;
}

export interface EvenementDto {
  id: number;
  nomEvenement: string;
  dateHeureDebut: string;
  dateHeureFin: string;
  description: string;
  prix?: number;
  promo?: number;
  lieuDto?: LieuDto;
  typeEvenementDto?: TypeEvenementDto;
  inscriptionCount?: number;
}
