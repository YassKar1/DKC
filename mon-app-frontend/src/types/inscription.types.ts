/** Réponse GET /api/inscription/me */
export interface InscriptionReservation {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  dateInscription: string;
  evenementId: number;
  evenementNom?: string | null;
  statut?: boolean;
}
