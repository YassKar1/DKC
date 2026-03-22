import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { registerUser, loginUser } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { colors, radius, buttonPresets } from "../theme";

export default function RegisterScreen({ navigation }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();

  const handleRegister = async () => {
    if (!nom.trim() || !prenom.trim() || !email.trim() || !telephone.trim() || !username.trim() || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        telephone: telephone.trim(),
        username: username.trim(),
        password,
      });
      const result = await loginUser(username.trim(), password);
      await saveAuth(result.data.user, result.data.token);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Inscription EventDKC</Text>

          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor={colors.muted}
            value={prenom}
            onChangeText={setPrenom}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor={colors.muted}
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor={colors.muted}
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            placeholderTextColor={colors.muted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe (6 caractères min.)"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor={colors.muted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[buttonPresets.primary, styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={[buttonPresets.primaryText, styles.buttonText]}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkWrap}
            onPress={() => navigation.navigate("Login")}
            disabled={loading}
          >
            <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingVertical: 40,
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
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});
