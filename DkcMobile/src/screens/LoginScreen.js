import { useState } from "react"; 
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
} from "react-native"; 
import { loginUser } from "../api/client"; 
import { useAuth } from "../context/AuthContext";
import { colors, radius, buttonPresets } from "../theme"; 

export default function LoginScreen({ navigation }) { 
    const [email, setEmail] = useState(""); 
    const [motDePasse, setMotDePasse] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const { saveAuth } = useAuth();
    const handleLogin = async () => { 
        if (!email || !motDePasse) { 
          Alert.alert("Erreur", "Veuillez remplir tous les champs"); 
          return; 
        } 
     
        setLoading(true); 
        try { 
          const result = await loginUser(email, motDePasse); 
          // result = { success, message, data: { token, user } } 
          await saveAuth(result.data.user, result.data.token); 
        } catch (error) { 
          Alert.alert("Erreur", error.message); 
        } finally { 
          setLoading(false); 
        } 
    }; 

    return ( 
        <View style={styles.container}> 
          <View style={styles.card}>
            <Text style={styles.title}>Connexion</Text> 
            <Text style={styles.subtitle}>Accédez à votre compte EventDKC</Text> 
            <TextInput 
              style={styles.input} 
              placeholder="Nom d'utilisateur ou email" 
              placeholderTextColor={colors.muted}
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address" 
              autoCapitalize="none"
            /> 
            <TextInput 
              style={styles.input} 
              placeholder="Mot de passe" 
              placeholderTextColor={colors.muted}
              value={motDePasse} 
              onChangeText={setMotDePasse} 
              secureTextEntry 
            /> 
            <TouchableOpacity 
              style={[buttonPresets.primary, styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin} 
              disabled={loading}
              activeOpacity={0.88}
            > 
              {loading ? ( 
                <ActivityIndicator color={colors.primaryForeground} /> 
              ) : ( 
                <Text style={[buttonPresets.primaryText, styles.buttonText]}>Se connecter</Text> 
              )} 
            </TouchableOpacity> 
            <TouchableOpacity
              style={styles.linkWrap}
              onPress={() => navigation.navigate("Register")}
              disabled={loading}
            >
              <Text style={styles.linkText}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </View> 
  ); 
}

const styles = StyleSheet.create({ 
    container: { 
      flex: 1, 
      justifyContent: "center", 
      padding: 20, 
      backgroundColor: colors.background, 
    }, 
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: { 
      fontSize: 24, 
      fontWeight: "bold", 
      marginBottom: 4, 
      color: colors.foreground, 
    }, 
    subtitle: { 
      fontSize: 14, 
      marginBottom: 24, 
      color: colors.muted, 
    }, 
    input: { 
      backgroundColor: colors.input, 
      borderWidth: 1, 
      borderColor: colors.border, 
      borderRadius: radius.lg, 
      padding: 14, 
      marginBottom: 12, 
      fontSize: 16, 
      color: colors.foreground,
    }, 
    button: { 
      marginTop: 8,
      paddingVertical: 14,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 4,
    }, 
    buttonDisabled: { opacity: 0.6 },
    buttonText: { 
      fontSize: 16, 
    },
    linkWrap: {
      marginTop: 16,
      alignItems: "center",
    },
    linkText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "500",
    },
  }); 
  