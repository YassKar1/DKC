import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createEvenement } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { colors, radius, buttonPresets } from "../theme";
import { EVENT_CATEGORIES } from "../constants/eventCategories";
import { getEventImageForType } from "../constants/eventTypeImages";

const STEPS = ["Informations", "Lieu", "Billetterie", "Aperçu"];

const emptyForm = {
  nom: "",
  type: "",
  description: "",
  adresse: "",
  codePostal: "",
  ville: "",
  prix: "",
  promo: "",
  capacite: "",
};

function defaultStartDate() {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(0);
  d.setHours(d.getHours() + 1);
  return d;
}

function defaultEndDate() {
  const d = defaultStartDate();
  d.setHours(d.getHours() + 2);
  return d;
}

/** Affichage lisible (fr) */
function formatDateTimeFr(d) {
  if (!d || !(d instanceof Date) || Number.isNaN(d.getTime())) return "—";
  try {
    return d.toLocaleString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d.toISOString();
  }
}

/** Format attendu par le backend (LocalDateTime) */
function dateToApiString(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

export default function CreateEventScreen({ navigation }) {
  const { token } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [debutAt, setDebutAt] = useState(() => defaultStartDate());
  const [finAt, setFinAt] = useState(() => defaultEndDate());
  /** 'debut' | 'fin' | null — ouverture du sélecteur (Android = dialogue natif, iOS = modal) */
  const [pickerTarget, setPickerTarget] = useState(null);

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!form.nom.trim()) errs.nom = "Requis";
      if (!form.type) errs.type = "Requis";
      if (!form.description.trim()) errs.description = "Requis";
      if (finAt.getTime() <= debutAt.getTime()) {
        errs.dateFin = "La fin doit être après le début";
      }
    } else if (s === 1) {
      if (!form.adresse.trim()) errs.adresse = "Requis";
      if (!form.codePostal.trim()) errs.codePostal = "Requis";
      if (!form.ville.trim()) errs.ville = "Requis";
    } else if (s === 2) {
      if (!form.capacite.trim() || Number(form.capacite) <= 0) errs.capacite = "Capacité requise";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      setStep(0);
      Alert.alert("Formulaire incomplet", "Vérifiez les champs obligatoires.");
      return;
    }
    const dateHeureDebut = dateToApiString(debutAt);
    const dateHeureFin = dateToApiString(finAt);
    try {
      setSubmitting(true);
      await createEvenement(token, {
        nomEvenement: form.nom.trim(),
        description: form.description.trim(),
        dateHeureDebut,
        dateHeureFin,
        prix: form.prix ? parseFloat(form.prix) : undefined,
        promo: form.promo ? parseFloat(form.promo) : undefined,
        lieuDto: {
          adresse: form.adresse.trim(),
          codePostal: form.codePostal.trim(),
          ville: form.ville.trim(),
        },
        typeEvenementDto: { libelle: form.type },
      });
      Alert.alert("Succès", "Événement publié !", [
        { text: "OK", onPress: () => navigation.navigate("EventList") },
      ]);
    } catch (e) {
      Alert.alert("Erreur", e.message || "Création impossible");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer l'expérience</Text>
      </View>

      <View style={styles.stepRow}>
        {STEPS.map((label, i) => (
          <TouchableOpacity
            key={label}
            style={[styles.stepChip, i === step && styles.stepChipActive, i < step && styles.stepChipDone]}
            onPress={() => i < step && setStep(i)}
            disabled={i > step}
          >
            <Text
              style={[styles.stepChipText, i === step && styles.stepChipTextActive]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={styles.card}>
            <Text style={styles.label}>Nom de l'événement *</Text>
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              placeholder="Ex: Nuit Électronique"
              placeholderTextColor={colors.muted}
              value={form.nom}
              onChangeText={setField("nom")}
            />
            {errors.nom ? <Text style={styles.err}>{errors.nom}</Text> : null}

            <Text style={styles.label}>Type d'événement *</Text>
            <View style={styles.typeGrid}>
              {EVENT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.typeBtn, form.type === cat && styles.typeBtnActive]}
                  onPress={() => setField("type")(cat)}
                >
                  <Text style={[styles.typeBtnText, form.type === cat && styles.typeBtnTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.type ? <Text style={styles.err}>{errors.type}</Text> : null}

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.textarea, errors.description && styles.inputError]}
              placeholder="Décrivez votre événement..."
              placeholderTextColor={colors.muted}
              value={form.description}
              onChangeText={setField("description")}
              multiline
              numberOfLines={4}
            />
            {errors.description ? <Text style={styles.err}>{errors.description}</Text> : null}

            <Text style={styles.label}>Date et heure de début *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setPickerTarget("debut")}
              activeOpacity={0.8}
            >
              <Text style={styles.dateButtonHint}>Appuyez pour choisir</Text>
              <Text style={styles.dateButtonValue}>{formatDateTimeFr(debutAt)}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Date et heure de fin *</Text>
            <TouchableOpacity
              style={[styles.dateButton, errors.dateFin && styles.inputError]}
              onPress={() => setPickerTarget("fin")}
              activeOpacity={0.8}
            >
              <Text style={styles.dateButtonHint}>Appuyez pour choisir</Text>
              <Text style={styles.dateButtonValue}>{formatDateTimeFr(finAt)}</Text>
            </TouchableOpacity>
            {errors.dateFin ? <Text style={styles.err}>{errors.dateFin}</Text> : null}

            {Platform.OS === "android" && pickerTarget === "debut" && (
              <DateTimePicker
                value={debutAt}
                mode="datetime"
                display="default"
                onChange={(event, date) => {
                  setPickerTarget(null);
                  if (event.type === "set" && date) {
                    setDebutAt(date);
                    if (finAt.getTime() <= date.getTime()) {
                      const next = new Date(date);
                      next.setHours(next.getHours() + 1);
                      setFinAt(next);
                    }
                  }
                }}
              />
            )}
            {Platform.OS === "android" && pickerTarget === "fin" && (
              <DateTimePicker
                value={finAt}
                mode="datetime"
                display="default"
                minimumDate={debutAt}
                onChange={(event, date) => {
                  setPickerTarget(null);
                  if (event.type === "set" && date) setFinAt(date);
                }}
              />
            )}
          </View>
        )}

        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.label}>Adresse *</Text>
            <TextInput
              style={[styles.input, errors.adresse && styles.inputError]}
              placeholder="12 Rue des Arts"
              placeholderTextColor={colors.muted}
              value={form.adresse}
              onChangeText={setField("adresse")}
            />
            {errors.adresse ? <Text style={styles.err}>{errors.adresse}</Text> : null}

            <Text style={styles.label}>Code postal *</Text>
            <TextInput
              style={[styles.input, errors.codePostal && styles.inputError]}
              placeholder="75011"
              placeholderTextColor={colors.muted}
              value={form.codePostal}
              onChangeText={setField("codePostal")}
              keyboardType="numeric"
            />
            {errors.codePostal ? <Text style={styles.err}>{errors.codePostal}</Text> : null}

            <Text style={styles.label}>Ville *</Text>
            <TextInput
              style={[styles.input, errors.ville && styles.inputError]}
              placeholder="Paris"
              placeholderTextColor={colors.muted}
              value={form.ville}
              onChangeText={setField("ville")}
            />
            {errors.ville ? <Text style={styles.err}>{errors.ville}</Text> : null}
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.label}>Capacité maximale *</Text>
            <TextInput
              style={[styles.input, errors.capacite && styles.inputError]}
              placeholder="200"
              placeholderTextColor={colors.muted}
              value={form.capacite}
              onChangeText={setField("capacite")}
              keyboardType="number-pad"
            />
            {errors.capacite ? <Text style={styles.err}>{errors.capacite}</Text> : null}

            <Text style={styles.label}>Prix d'entrée (€)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              value={form.prix}
              onChangeText={setField("prix")}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Promotion (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={colors.muted}
              value={form.promo}
              onChangeText={setField("promo")}
              keyboardType="decimal-pad"
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.card}>
            {form.type ? (
              <Image
                source={{ uri: getEventImageForType(form.type) }}
                style={styles.previewCover}
                resizeMode="cover"
              />
            ) : null}
            <Text style={styles.previewBadge}>{form.type || "Type"}</Text>
            <Text style={styles.previewTitle}>{form.nom || "Nom de l'événement"}</Text>
            <Text style={styles.previewDesc}>{form.description || "…"}</Text>
            <Text style={styles.previewMeta}>{formatDateTimeFr(debutAt)}</Text>
            <Text style={styles.previewMeta}>→ {formatDateTimeFr(finAt)}</Text>
            <Text style={styles.previewMeta}>
              {form.adresse}, {form.codePostal} {form.ville}
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          {step > 0 ? (
            <TouchableOpacity
              style={[buttonPresets.secondary, styles.btnSecondary]}
              onPress={() => setStep(step - 1)}
              activeOpacity={0.88}
            >
              <Text style={[buttonPresets.secondaryText, styles.btnSecondaryText]}>Précédent</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 100 }} />
          )}
          {step < 3 ? (
            <TouchableOpacity style={[buttonPresets.primary, styles.btnPrimary]} onPress={goNext} activeOpacity={0.88}>
              <Text style={[buttonPresets.primaryText, styles.btnPrimaryText]}>Suivant</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[buttonPresets.primary, styles.btnPrimary, submitting && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.88}
            >
              {submitting ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={[buttonPresets.primaryText, styles.btnPrimaryText]}>Publier l'événement</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {Platform.OS === "ios" && (
        <Modal visible={pickerTarget !== null} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {pickerTarget === "debut" ? "Début de l'événement" : "Fin de l'événement"}
              </Text>
              {pickerTarget ? (
                <DateTimePicker
                  value={pickerTarget === "debut" ? debutAt : finAt}
                  mode="datetime"
                  display="spinner"
                  locale="fr-FR"
                  minimumDate={pickerTarget === "fin" ? debutAt : undefined}
                  onChange={(event, date) => {
                    if (date) {
                      if (pickerTarget === "debut") {
                        setDebutAt(date);
                        if (finAt.getTime() <= date.getTime()) {
                          const next = new Date(date);
                          next.setHours(next.getHours() + 1);
                          setFinAt(next);
                        }
                      } else {
                        setFinAt(date);
                      }
                    }
                  }}
                />
              ) : null}
              <TouchableOpacity style={[buttonPresets.primary, styles.modalOk]} onPress={() => setPickerTarget(null)} activeOpacity={0.88}>
                <Text style={[buttonPresets.primaryText, styles.modalOkText]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { color: colors.primary, fontSize: 14, marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: colors.foreground },
  stepRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
    backgroundColor: colors.background,
  },
  stepChip: {
    flex: 1,
    minWidth: "22%",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  stepChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepChipDone: { opacity: 0.9 },
  stepChipText: { fontSize: 10, color: colors.muted, fontWeight: "600" },
  stepChipTextActive: { color: colors.primaryForeground },
  scroll: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    fontSize: 16,
    color: colors.foreground,
  },
  inputError: { borderColor: colors.destructive },
  textarea: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    fontSize: 16,
    color: colors.foreground,
    minHeight: 100,
    textAlignVertical: "top",
  },
  err: { color: colors.destructive, fontSize: 12, marginTop: 4 },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeBtnText: { fontSize: 12, color: colors.muted, fontWeight: "600" },
  typeBtnTextActive: { color: colors.primaryForeground },
  previewCover: {
    width: "100%",
    height: 160,
    borderRadius: radius.lg,
    marginBottom: 12,
    backgroundColor: colors.input,
  },
  previewBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "700",
    overflow: "hidden",
    marginBottom: 12,
  },
  previewTitle: { fontSize: 22, fontWeight: "bold", color: colors.foreground, marginBottom: 12 },
  previewDesc: { fontSize: 14, color: colors.muted, lineHeight: 22, marginBottom: 12 },
  previewMeta: { fontSize: 13, color: colors.muted, marginBottom: 6 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  btnPrimary: {
    minWidth: 140,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { fontSize: 15 },
  btnSecondary: {
    minWidth: 140,
  },
  btnSecondaryText: { fontSize: 15 },
  dateButton: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
  },
  dateButtonHint: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 6,
  },
  dateButtonValue: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 20,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 12,
    textAlign: "center",
  },
  modalOk: {
    marginTop: 16,
  },
  modalOkText: {
    fontSize: 16,
  },
});
