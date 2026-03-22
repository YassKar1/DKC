import { useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import { RegisterRequest } from '../types/auth.types';

// Interface qui définit ce que le hook retourne
interface UseAuthReturn {
  token: string | null;
  user: { username: string; roles: string[] } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
login: (username: string, password: string) => Promise<void>;
register: (data: RegisterRequest) => Promise<void>;
logout: () => void;
clearError: () => void;
hasRole: (role: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
// TODO: États
const [token, setToken] = useState<string | null>(null);
const [user, setUser] = useState<{ username: string; roles: string[] } | null>(null);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
/**
 * INITIALISATION : Vérifier si l'utilisateur est déjà connecté
 * S'exécute UNE SEULE FOIS au montage du composant
 */
useEffect(() => {
  const initAuth = () => {
    try {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();
      
      // Vérifier si le token est valide
      if (storedToken && authService.isAuthenticated()) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        // Token expiré, nettoyer
        authService.logout();
      }
    } catch (err) {
      console.error('Erreur initialisation auth:', err);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };
  
  initAuth();
}, []); // Tableau vide = exécuté UNE SEULE FOIS
/**
 * FONCTION 1 : LOGIN
 */
const login = useCallback(async (username: string, password: string) => {
setIsLoading(true);
setError(null);
try {
const decoded = await authService.login(username, password);
// Mettre à jour les états
const newToken = authService.getToken();
setToken(newToken);
setUser({
      username: decoded.sub,
      roles: decoded.roles,
});
} catch (err: unknown) {
    if (err instanceof Error){
        setError(err.message);
    } else {
        setError('Erreur de connexion');
    }
throw err; // Re-throw pour que le composant puisse gérer l'erreur
} finally {
setIsLoading(false);
}
}, []);
/**
 * FONCTION 2 : REGISTER
 */
const register = useCallback(async (data: RegisterRequest) => {
  setIsLoading(true);
  setError(null);
  
  try {
    await authService.register(data);
    // Après inscription, connecter automatiquement
    await login(data.username, data.password);
    
  } catch (err: unknown) {
    if (err instanceof Error) {
        setError(err.message);
    } else {
    setError("Erreur d'inscription");
    }
    throw err;
  } finally {
    setIsLoading(false);
  }
}, [login]); // Dépend de login
/**
 * FONCTION 3 : LOGOUT
 */
const logout = useCallback(() => {
  authService.logout();
  setToken(null);
  setUser(null);
  setError(null);
}, []);
/**
 * FONCTION 4 : CLEAR ERROR
 */
const clearError = useCallback(() => {
setError(null);
}, []);
/**
 * FONCTION 5 : CHECK ROLE
 */
const hasRole = useCallback((role: string): boolean => {
return authService.hasRole(role);
}, []);
// État dérivé : isAuthenticated
const isAuthenticated = !!token && !!user;
return {
// TODO: Valeurs retournées
token,
user,
isAuthenticated,
isLoading,
error,
login,
register,
logout,
clearError,
hasRole,
};
};