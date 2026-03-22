import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getProfile } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { colors, radius, buttonPresets } from "../theme";

export default function ProfileScreen({ navigation }) {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getProfile(token);
      setProfile(data);
    } catch (e) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Se déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", style: "destructive", onPress: () => logout() },
    ]);
  };

  if (loading && !profile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mon profil</Text>
      <Text style={styles.subtitle}>Vos informations</Text>

      <View style={styles.card}>
        <Row label="Nom d'utilisateur" value={profile?.username || "—"} />
        <Row label="Prénom" value={profile?.prenom || "—"} />
        <Row label="Nom" value={profile?.nom || "—"} />
        <Row label="E-mail" value={profile?.email || "—"} />
        {profile?.telephone ? <Row label="Téléphone" value={profile.telephone} /> : null}
      </View>

      <TouchableOpacity
        style={[buttonPresets.outline, styles.linkBtn]}
        onPress={() => navigation.navigate("Reservations")}
        activeOpacity={0.85}
      >
        <Text style={[buttonPresets.outlineText, { fontSize: 16 }]}>Mes réservations</Text>
      </TouchableOpacity>

      <View style={styles.logoutSection}>
        <Text style={styles.logoutHint}>Fin de session</Text>
        <TouchableOpacity
          style={[buttonPresets.danger, styles.logoutBtn]}
          onPress={handleLogout}
          activeOpacity={0.9}
        >
          <Text style={buttonPresets.dangerText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  title: { fontSize: 26, fontWeight: "bold", color: colors.foreground, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 20 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  row: { marginBottom: 16 },
  rowLabel: { fontSize: 11, fontWeight: "700", color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  rowValue: { fontSize: 17, color: colors.foreground, lineHeight: 24 },
  linkBtn: {
    marginBottom: 32,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  logoutSection: { marginTop: 8, paddingTop: 24, borderTopWidth: 1, borderTopColor: colors.border },
  logoutHint: { fontSize: 12, color: colors.muted, textAlign: "center", marginBottom: 12 },
  logoutBtn: {
    paddingVertical: 16,
  },
});
