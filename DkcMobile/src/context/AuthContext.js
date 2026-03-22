import { createContext, useState, useContext } from "react"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 
 
const AuthContext = createContext(); 
 
export function AuthProvider({ children }) { 
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(null); 
 
  const saveAuth = async (userData, tokenValue) => { 
    setUser(userData); 
    setToken(tokenValue); 
    await AsyncStorage.setItem("token", tokenValue); 
    await AsyncStorage.setItem("user", JSON.stringify(userData)); 
  }; 
 
  const logout = async () => { 
    setUser(null); 
    setToken(null); 
    await AsyncStorage.removeItem("token"); 
    await AsyncStorage.removeItem("user"); 
  }; 
 
  return ( 
    <AuthContext.Provider value={{ user, token, saveAuth, logout }}> 
      {children} 
    </AuthContext.Provider> 
  ); 
} 

export const useAuth = () => useContext(AuthContext); 
