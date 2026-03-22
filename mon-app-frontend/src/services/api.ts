import axios from 'axios';
import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/constants';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/user.types';
import type { InscriptionReservation } from '../types/inscription.types';
import { Evenement } from '../eventglow/lib/types';
import type { EvenementDto } from '../eventglow/lib/backendDtos';
import { getEventImageForType } from '../eventglow/lib/eventTypeImages';

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const m = (error as { message?: unknown }).message;
    if (typeof m === 'string' && m.length > 0) return m;
  }
  return fallback;
}

class ApiService {
// Les méthodes CRUD seront ajoutées ici
/**
 * MÉTHODE 1 : GET ALL UTILISATEURS
 * GET /api/utilisateur
 */
async getAllUser(): Promise<User[]> {
try {
const response = await httpClient.get<User[]>(API_ENDPOINTS.USERS);
return response.data;
} catch (error: unknown) {
console.error('Erreur getAllUser:', error);
if (error instanceof Error) {
    throw new Error(error.message);
}
throw new Error('Erreur lors de la récupération des User');
}
}
/**
 * MÉTHODE 2 : GET UTILISATEUR BY ID
 * GET /api/utilisateur/{id}
 */
async getUserById(id: number): Promise<User> {
try {
const response = await httpClient.get<User>(
API_ENDPOINTS.USER_BY_ID(id)
);
return response.data;
} catch (error: unknown) {
console.error('Erreur getUserById:', error);
if (error instanceof Error) {
    throw new Error(error.message);
}
throw new Error(`User ${id} introuvable`);
}
}
/**
 * MÉTHODE 3 : CREATE UTILISATEUR
 * POST /api/utilisateur
 */
async createUser(data: CreateUserDTO): Promise<User> {
try {
const response = await httpClient.post<User>(
API_ENDPOINTS.USERS,
      data
);
return response.data;
} catch (error: unknown) {
console.error('Erreur createUtilisateur:', error);
if (error instanceof Error) {
    throw new Error(error.message);
}
throw new Error('Erreur lors de la création');
}
}
/**
 * MÉTHODE 4 : UPDATE UTILISATEUR
 * PUT /api/utilisateur/{id}
 */
async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
  try {
    const response = await httpClient.put<User>(
      API_ENDPOINTS.USER_BY_ID(id),
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur updateUser:', error);
    if (error instanceof Error) {
    throw new Error(error.message);
}
    throw new Error('Erreur lors de la mise à jour');
  }
}
/**
 * MÉTHODE 5 : DELETE UTILISATEUR
 * DELETE /api/utilisateur/{id}
 */
async deleteUser(id: number): Promise<void> {
try {
await httpClient.delete(API_ENDPOINTS.USER_BY_ID(id));
} catch (error: unknown) {
console.error('Erreur deleteUser:', error);
if (error instanceof Error) {
    throw new Error(error.message);
}
throw new Error('Erreur lors de la suppression');
}
}

/** Profil utilisateur connecté (GET /api/user/me) */
async getCurrentUserProfile(): Promise<User> {
  try {
    const response = await httpClient.get<User>('/api/user/me');
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur getCurrentUserProfile:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Impossible de charger le profil');
  }
}

/** Inscriptions de l'utilisateur connecté */
async getMyReservations(): Promise<InscriptionReservation[]> {
  try {
    const response = await httpClient.get<InscriptionReservation[]>('/api/inscription/me');
    return response.data ?? [];
  } catch (error: unknown) {
    console.error('Erreur getMyReservations:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Impossible de charger les réservations');
  }
}

/**
 * EVENTGLOW (Evenements)
 */
async getAllEvenements(): Promise<Evenement[]> {
  try {
    const response = await httpClient.get<EvenementDto[]>('/api/evenement');
    const data = response.data ?? [];
    return data.map(this.mapEvenementDtoToEventglow);
  } catch (error: unknown) {
    console.error('Erreur getAllEvenements:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Erreur lors de la récupération des événements');
  }
}

async getEvenementById(id: number): Promise<Evenement> {
  try {
    const response = await httpClient.get<EvenementDto>(`/api/evenement/${id}`);
    return this.mapEvenementDtoToEventglow(response.data);
  } catch (error: unknown) {
    console.error('Erreur getEvenementById:', error);
    throw new Error(toErrorMessage(error, "Erreur lors de la récupération de l'événement"));
  }
}

/** Suppression d'un événement (admin uniquement côté API). */
async deleteEvenement(id: number): Promise<void> {
  try {
    await httpClient.delete(`/api/evenement/${id}`);
  } catch (error: unknown) {
    console.error('Erreur deleteEvenement:', error);
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { message?: string; detail?: string } | undefined;
      const msg = data?.message ?? data?.detail ?? error.message;
      throw new Error(msg || "Impossible de supprimer l'événement");
    }
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Impossible de supprimer l'événement");
  }
}

/**
 * Inscription à un événement (utilisateur = JWT ; ne pas envoyer utilisateurId).
 */
async createInscription(payload: {
  evenementId: number;
  nom: string;
  prenom: string;
  mail: string;
}): Promise<void> {
  try {
    await httpClient.post('/api/inscription', {
      evenementId: payload.evenementId,
      nom: payload.nom.trim(),
      prenom: payload.prenom.trim(),
      mail: payload.mail.trim(),
    });
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      const data = e.response?.data as { message?: string; detail?: string } | undefined;
      const msg = data?.message ?? data?.detail ?? e.message;
      throw new Error(msg || "Erreur lors de l'inscription");
    }
    throw e;
  }
}

/** Indique si l'utilisateur connecté est inscrit à cet événement. */
async isRegisteredForEvent(evenementId: number): Promise<boolean> {
  const { data } = await httpClient.get<{ registered: boolean }>(
    `/api/inscription/me/evenement/${evenementId}/registered`
  );
  return data.registered;
}

/** Désinscription (utilisateur connecté). */
async deleteMyInscription(evenementId: number): Promise<void> {
  try {
    await httpClient.delete(`/api/inscription/me/evenement/${evenementId}`);
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      const data = e.response?.data as { message?: string; detail?: string } | undefined;
      const msg = data?.message ?? data?.detail ?? e.message;
      throw new Error(msg || 'Erreur lors de la désinscription');
    }
    throw e;
  }
}

async createEvenement(payload: {
  nomEvenement: string;
  description: string;
  dateHeureDebut: string;
  dateHeureFin: string;
  prix?: number;
  promo?: number;
  lieuDto?: { adresse?: string; ville?: string; codePostal?: string };
  typeEvenementDto?: { libelle?: string };
}): Promise<Evenement> {
  try {
    const response = await httpClient.post<EvenementDto>('/api/evenement', payload);
    return this.mapEvenementDtoToEventglow(response.data);
  } catch (error: unknown) {
    console.error('Erreur createEvenement:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création de l'événement");
  }
}

private mapEvenementDtoToEventglow(dto: EvenementDto): Evenement {
  return {
    id: dto.id,
    nomEvenement: dto.nomEvenement,
    description: dto.description,
    dateHeureDebut: dto.dateHeureDebut,
    dateHeureFin: dto.dateHeureFin,
    lieu: dto.lieuDto
      ? {
          id: dto.lieuDto.id ? Number(dto.lieuDto.id) : 0,
          nom: dto.lieuDto.ville ?? 'Lieu',
          adresse: dto.lieuDto.adresse ?? '',
          codePostal: dto.lieuDto.codePostal ?? '',
          ville: dto.lieuDto.ville ?? '',
        }
      : undefined,
    typeEvenement: dto.typeEvenementDto?.libelle
      ? {
          id: dto.typeEvenementDto.id ? Number(dto.typeEvenementDto.id) : 0,
          libelle: dto.typeEvenementDto.libelle,
        }
      : undefined,
    prix: dto.prix != null ? Number(dto.prix) : undefined,
    promo: dto.promo != null ? Number(dto.promo) : undefined,
    image: getEventImageForType(dto.typeEvenementDto?.libelle),
    inscrits: dto.inscriptionCount ? Number(dto.inscriptionCount) : 0,
  };
}
}
// Exporter une instance unique (singleton)
export default new ApiService();