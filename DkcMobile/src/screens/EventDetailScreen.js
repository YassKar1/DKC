import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { participerEvenement, getEvenementById, isRegisteredForEvent } from "../api/client";
import { getEventImageForType } from "../constants/eventTypeImages";
import { useAuth } from "../context/AuthContext";
import { colors, radius, buttonPresets } from "../theme";

function mapDtoToUi(e) {
  if (!e) return null;
  const typeLabel = e.typeEvenementDto?.libelle;
  return {
    id: e.id,
    nom: e.nomEvenement || e.nom,
    nomEvenement: e.nomEvenement,
    description: e.description || "",
    prix: e.prix,
    typeLibelle: typeLabel,
    coverImageUrl: getEventImageForType(typeLabel),
    dateDebut: e.dateHeureDebut || e.dateDebut,
    dateFin: e.dateHeureFin || e.dateFin,
    lieu: e.lieuDto
      ? {
          nom: e.lieuDto.ville || e.lieuDto.nom || "Lieu",
          adresse: e.lieuDto.adresse || "",
        }
      : e.lieu,
  };
}

function EventDetailScreen({ route }) {
  const initial = route.params?.evenement;
  const { token } = useAuth();
  const [evenement, setEvenement] = useState(() => mapDtoToUi(initial));
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [inscrit, setInscrit] = useState(false);

  const loadEvent = useCallback(async () => {
    if (!initial?.id) {
      setFetching(false);
      return;
    }
    let cancelled = false;
    try {
      setFetching(true);
      const raw = await getEvenementById(token, initial.id);
      if (!cancelled) setEvenement(mapDtoToUi(raw));
    } catch (e) {
      if (!cancelled && initial) setEvenement(mapDtoToUi(initial));
    } finally {
      if (!cancelled) setFetching(false);
    }
  }, [initial?.id, token]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  useEffect(() => {
    if (!evenement?.id || !token) return;
    let cancelled = false;
    isRegisteredForEvent(token, evenement.id)
      .then((r) => {
        if (!cancelled) setInscrit(!!r?.registered);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [evenement?.id, token]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleParticiper = async () => {
    try {
      setLoading(true);
      await participerEvenement(evenement.id, token);
      setInscrit(true);
      Alert.alert("Succès", "Vous êtes inscrit à cet événement !");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !evenement) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const title = evenement.nomEvenement || evenement.nom || "Événement";

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: evenement.coverImageUrl }}
        style={styles.heroCover}
        resizeMode="cover"
      />
      <View style={styles.header}>
        <View style={[styles.typeChipWrap, !evenement.typeLibelle && styles.typeChipWrapMuted]}>
          <Text style={[styles.typeChipText, !evenement.typeLibelle && styles.typeChipTextMuted]}>
            {evenement.typeLibelle || "Type non renseigné"}
          </Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.prix}>
          {evenement.prix != null && Number(evenement.prix) > 0 ? `${Number(evenement.prix)} €` : "Gratuit"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date de début</Text>
        <Text style={styles.value}>{formatDate(evenement.dateDebut)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date de fin</Text>
        <Text style={styles.value}>{formatDate(evenement.dateFin)}</Text>
      </View>

      {evenement.lieu && (
        <View style={styles.section}>
          <Text style={styles.label}>Lieu</Text>
          <Text style={styles.value}>{evenement.lieu.nom}</Text>
          {evenement.lieu.adresse ? <Text style={styles.subvalue}>{evenement.lieu.adresse}</Text> : null}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{evenement.description || "—"}</Text>
      </View>

      <TouchableOpacity
        style={[buttonPresets.primary, styles.button, (loading || inscrit) && styles.buttonDisabled]}
        onPress={handleParticiper}
        disabled={loading || inscrit}
        activeOpacity={0.88}
      >
        {loading ? (
          <ActivityIndicator color={colors.primaryForeground} />
        ) : (
          <Text style={[buttonPresets.primaryText, styles.buttonText]}>{inscrit ? "Déjà inscrit" : "Participer"}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroCover: { width: "100%", height: 200, backgroundColor: colors.card },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  header: {
    backgroundColor: colors.card,
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeChipWrap: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },
  typeChipWrapMuted: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryForeground,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  typeChipTextMuted: {
    color: colors.muted,
    textTransform: "none",
    fontWeight: "600",
  },
  title: { fontSize: 24, fontWeight: "bold", color: colors.foreground },
  prix: { fontSize: 18, color: colors.primary, marginTop: 5 },
  section: {
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { fontSize: 12, color: colors.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  value: { fontSize: 16, color: colors.foreground },
  subvalue: { fontSize: 14, color: colors.muted, marginTop: 2 },
  button: {
    margin: 16,
    marginTop: 24,
    paddingVertical: 18,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { fontSize: 18 },
});

export default EventDetailScreen;
