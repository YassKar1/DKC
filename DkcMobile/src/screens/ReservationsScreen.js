import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMyReservations, deleteMyInscription } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { colors, radius, buttonPresets } from "../theme";

export default function ReservationsScreen({ navigation }) {
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getMyReservations(token);
      setList(Array.isArray(data) ? data : []);
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

  const onUnsubscribe = (evenementId) => {
    Alert.alert("Désinscription", "Se désinscrire de cet événement ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se désinscrire",
        style: "destructive",
        onPress: async () => {
          try {
            setBusyId(evenementId);
            await deleteMyInscription(token, evenementId);
            await load();
          } catch (e) {
            Alert.alert("Erreur", e.message);
          } finally {
            setBusyId(null);
          }
        },
      },
    ]);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(iso);
    }
  };

  if (loading && list.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[buttonPresets.outline, styles.profileLink]}
        onPress={() => navigation.navigate("Profile")}
        activeOpacity={0.85}
      >
        <Text style={buttonPresets.outlineText}>Voir mon profil</Text>
      </TouchableOpacity>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucune réservation</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.evenementNom || `Événement #${item.evenementId}`}</Text>
            {item.dateInscription ? (
              <Text style={styles.cardDate}>Inscrit le {formatDate(item.dateInscription)}</Text>
            ) : null}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EventDetail", {
                    evenement: { id: item.evenementId },
                  })
                }
              >
                <Text style={styles.link}>Voir l&apos;événement</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonPresets.dangerOutline, busyId === item.evenementId && styles.unsubBtnDisabled]}
                disabled={busyId === item.evenementId}
                onPress={() => onUnsubscribe(item.evenementId)}
                activeOpacity={0.85}
              >
                <Text style={buttonPresets.dangerOutlineText}>
                  {busyId === item.evenementId ? "…" : "Se désinscrire"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  profileLink: { marginHorizontal: 16, marginBottom: 8, paddingVertical: 12 },
  list: { padding: 16, paddingTop: 0 },
  empty: { textAlign: "center", color: colors.muted, marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: colors.foreground, marginBottom: 6 },
  cardDate: { fontSize: 13, color: colors.muted, marginBottom: 12 },
  actions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  link: { color: colors.primary, fontSize: 14, fontWeight: "600" },
  unsubBtnDisabled: { opacity: 0.5 },
});
