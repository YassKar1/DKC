import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  Image,
} from "react-native"; 
import { getEvenements } from "../api/client"; 
import { getEventImageForType } from "../constants/eventTypeImages";
import { useAuth } from "../context/AuthContext";
import { colors, radius, buttonPresets } from "../theme"; 
 
export default function EventListScreen({ navigation }) { 
  const [evenements, setEvenements] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const { token } = useAuth(); 

  const chargerEvenements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEvenements(token);
      setEvenements(data);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      chargerEvenements();
    }, [chargerEvenements])
  );
 
  const formatDate = (dateString) => { 
    const date = new Date(dateString); 
    return date.toLocaleDateString("fr-FR", { 
      day: "numeric", 
      month: "long", 
      year: "numeric", 
      hour: "2-digit", 
      minute: "2-digit", 
    }); 
  }; 
 
  const renderEvenement = ({ item }) => {
    const typeLabel = item.typeEvenementDto?.libelle;
    return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate("EventDetail", { evenement: item })} 
    > 
      <Image
        source={{ uri: getEventImageForType(typeLabel) }}
        style={styles.cardCover}
        resizeMode="cover"
      />
      {typeLabel ? (
        <View style={styles.typeChipWrap}>
          <Text style={styles.typeChipText}>{typeLabel}</Text>
        </View>
      ) : null}
      <Text style={styles.cardTitle}>{item.nomEvenement || item.nom}</Text>
      <Text style={styles.cardDate}>{formatDate(item.dateHeureDebut || item.dateDebut)}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}> 
        {item.description} 
      </Text> 
      <View style={styles.cardFooter}> 
        <Text style={styles.cardLieu}>
          {item.lieuDto?.ville || item.lieu?.ville || item.lieu?.nom || "Lieu non défini"}
        </Text>
        <Text style={styles.cardPrix}> 
          {(item.prix != null && Number(item.prix) > 0) ? `${Number(item.prix)} €` : "Gratuit"} 
        </Text> 
      </View>
    </TouchableOpacity>
    );
  };
  if (loading) { 
    return ( 
      <View style={styles.centered}> 
        <ActivityIndicator size="large" color={colors.primary} /> 
      </View> 
    ); 
  } 
 
  return ( 
    <View style={styles.container}> 
      <View style={styles.header}>
        <Text style={styles.title}>Evenements</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[buttonPresets.outline, styles.navChip]}
            onPress={() => navigation.navigate("Reservations")}
            activeOpacity={0.85}
          >
            <Text style={[buttonPresets.outlineText, styles.navChipText]}>Réservations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[buttonPresets.outline, styles.navChip]}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.85}
          >
            <Text style={[buttonPresets.outlineText, styles.navChipText]}>Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[buttonPresets.primary, styles.createBtn]}
            onPress={() => navigation.navigate("CreateEvent")}
            activeOpacity={0.88}
          >
            <Text style={[buttonPresets.primaryText, styles.createBtnText]}>Créer</Text>
          </TouchableOpacity>
        </View>
      </View>
 
      <FlatList 
        data={evenements} 
        keyExtractor={(item) => item.id.toString()} 
        renderItem={renderEvenement} 
        contentContainerStyle={styles.list} 
        ListEmptyComponent={ 
          <Text style={styles.emptyText}>Aucun evenement disponible</Text> 
        } 
      /> 
    </View> 
  ); 
} 
const styles = StyleSheet.create({ 
    container: { flex: 1, backgroundColor: colors.background }, 
    centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }, 
    header: { 
      flexDirection: "row", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: 20, 
      paddingTop: 50, 
      backgroundColor: colors.card, 
      borderBottomWidth: 1, 
      borderBottomColor: colors.border, 
    }, 
    title: { fontSize: 24, fontWeight: "bold", color: colors.foreground },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "68%" },
    navChip: {
      paddingVertical: 7,
      paddingHorizontal: 10,
    },
    navChipText: {
      fontSize: 11,
    },
    createBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      minWidth: 0,
      shadowColor: "#6366f1",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 5,
    },
    createBtnText: { fontSize: 13 },
    list: { padding: 16 }, 
    card: { 
      backgroundColor: colors.card, 
      borderRadius: radius.xl, 
      padding: 16, 
      marginBottom: 12, 
      borderWidth: 1, 
      borderColor: colors.border, 
      overflow: "hidden",
    },
    cardCover: {
      width: "100%",
      height: 130,
      borderRadius: radius.lg,
      marginBottom: 8,
      marginHorizontal: -16,
      marginTop: -16,
      backgroundColor: colors.input,
    },
    typeChipWrap: {
      alignSelf: "flex-start",
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      marginBottom: 8,
    },
    typeChipText: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.primaryForeground,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    cardTitle: { fontSize: 18, fontWeight: "600", color: colors.foreground, marginBottom: 6 }, 
    cardDate: { fontSize: 13, color: colors.primary, marginBottom: 6 }, 
    cardDescription: { fontSize: 14, color: colors.muted, marginBottom: 10 }, 
    cardFooter: { flexDirection: "row", justifyContent: "space-between" }, 
    cardLieu: { fontSize: 13, color: colors.muted }, 
    cardPrix: { fontSize: 14, fontWeight: "600", color: colors.primary }, 
    emptyText: { textAlign: "center", marginTop: 50, color: colors.muted, fontSize: 16 }, 
  });