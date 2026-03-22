import httpClient from '../utils/httpClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/constants';
import { LoginRequest, LoginResponse, RegisterRequest, DecodedToken } from '../types/auth.types';
import { User } from '../types/user.types';
class AuthService {
async login(username: string, password: string): Promise<DecodedToken> {
try {
const loginData: LoginRequest = {
        username,
        password,
};
const response = await httpClient.post<LoginResponse>(
API_ENDPOINTS.LOGIN,
        loginData
);
const { token } = response.data;
this.setToken(token);
const decoded = this.decodeToken(token);
this.setUser(decoded);
return decoded;
} catch (error: unknown) {
  console.error('Erreur login:', error);
  const err = error as { response?: { data?: { message?: string }; status?: number } };
  const message = err.response?.data?.message ?? (err.response?.status === 401 ? 'Identifiants incorrects' : 'Erreur de connexion');
  throw new Error(message);
}
}
async register(data: RegisterRequest): Promise<User> {
try {
const response = await httpClient.post<User>(
API_ENDPOINTS.USERS + "/register",
        data
);
return response.data;
} catch (error: unknown) {
  console.error('Erreur inscription:', error);
  const err = error as { response?: { data?: { message?: string }; status?: number } };
  const message = err.response?.data?.message ?? "Erreur lors de l'inscription";
  throw new Error(message);
}
  }
  
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
  
  decodeToken(token: string): DecodedToken {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const decoded: DecodedToken = JSON.parse(payloadJson);
      
      return decoded;
      
    } catch (error) {
      console.error('Erreur décodage token:', error);
      throw new Error('Token invalide');
    }
  }
  
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      const now = Date.now() / 1000;
      
      return decoded.exp < now;
      
    } catch {
      return true;
    }
  }
  
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
  
  private setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
  
  private setUser(decoded: DecodedToken): void {
    const user = {
      username: decoded.sub,
      roles: decoded.roles,
  };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
  
  getUser(): { username: string; roles: string[] } | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    return !this.isTokenExpired(token);
  }
  
  hasRole(role: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    return user.roles.includes(role);
  }
}
export default new AuthService();