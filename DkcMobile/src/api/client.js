import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};
const API_URL = extra.apiUrl ?? "http://172.20.10.11:8080";

export async function loginUser(email, motDePasse) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password: motDePasse }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erreur de connexion");
  }
  const data = await response.json();
  return {
    data: {
      token: data.token,
      user: { username: email },
    },
  };
}

export async function registerUser(payload) {
  const response = await fetch(`${API_URL}/api/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors de la création du compte");
  }
  return response.json();
}

export async function getEvenements(token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}/api/evenement`, { headers });
  if (!response.ok) {
    throw new Error("Erreur lors du chargement des événements");
  }
  return response.json();
}

export async function getEvenementById(token, id) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}/api/evenement/${id}`, { headers });
  if (!response.ok) {
    throw new Error("Événement introuvable");
  }
  return response.json();
}

/**
 * Création d'événement — même payload que mon-app-frontend (api.createEvenement)
 */
export async function createEvenement(token, payload) {
  const response = await fetch(`${API_URL}/api/evenement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors de la création de l'événement");
  }
  return response.json();
}

export async function getProfile(token) {
  const response = await fetch(`${API_URL}/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Impossible de charger le profil");
  }
  return response.json();
}

export async function getMyReservations(token) {
  const response = await fetch(`${API_URL}/api/inscription/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Impossible de charger les réservations");
  }
  return response.json();
}

export async function deleteMyInscription(token, evenementId) {
  const response = await fetch(`${API_URL}/api/inscription/me/evenement/${evenementId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors de la désinscription");
  }
}

export async function isRegisteredForEvent(token, evenementId) {
  const response = await fetch(`${API_URL}/api/inscription/me/evenement/${evenementId}/registered`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return { registered: false };
  return response.json();
}

/** Inscription : le backend utilise le JWT ; nom/prénom/mail viennent du profil. */
export async function participerEvenement(evenementId, token) {
  const profile = await getProfile(token);
  const response = await fetch(`${API_URL}/api/inscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      evenementId,
      nom: profile.nom || "—",
      prenom: profile.prenom || "—",
      mail: profile.email || "—",
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erreur lors de l'inscription");
  }

  return response.json();
}