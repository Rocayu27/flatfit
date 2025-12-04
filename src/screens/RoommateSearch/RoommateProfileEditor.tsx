// src/screens/Roommate/RoommateProfileEditor.tsx

import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../ui/Button";

type RoommateDetails = {
  intro: string;
  cleanliness: string;
  studyHabits: string;
  conflictResolution: string;
  idealWeekend: string;
  funFacts: string;
};

type Props = {
  onCancel: () => void;
  onSaved: () => void;
  onDone: () => void;
};

export default function RoommateProfileEditor({ onCancel, onSaved, onDone }: Props) {
  const [form, setForm] = useState<RoommateDetails>({
    intro: "",
    cleanliness: "",
    studyHabits: "",
    conflictResolution: "",
    idealWeekend: "",
    funFacts: "",
  });

  const updateField = (key: keyof RoommateDetails, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const [photo, setPhoto] = useState<string | null>(null);


  const handleSave = async () => {
    // 🚧 TODO: upsert into Supabase (roommate_details or extended roommate_profiles)
    // For now, just confirm and return to RoommateSearch
    Alert.alert(
      "Roommate profile saved",
      "These details will be used to improve your roommate matches.",
      [{ text: "OK", onPress: onSaved }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Roommate Profile</Text>
        <Text style={styles.subtitle}>
          Share how you like to live and study so FlatFit can find better
          roommate matches for you.
        </Text>

        {/* Intro */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Short introduction
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical="top"
            placeholder="Tell potential roommates a bit about you..."
            placeholderTextColor="#A0A5B5"
            value={form.intro}
            onChangeText={(v) => updateField("intro", v)}
          />
        </View>

        {/* Cleanliness */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Cleanliness expectations
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical="top"
            placeholder="How tidy do you like shared spaces to be? How often do you clean?"
            placeholderTextColor="#A0A5B5"
            value={form.cleanliness}
            onChangeText={(v) => updateField("cleanliness", v)}
          />
        </View>

        {/* Study habits */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Study habits
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical="top"
            placeholder="Where and when do you usually study? Quiet or with background noise?"
            placeholderTextColor="#A0A5B5"
            value={form.studyHabits}
            onChangeText={(v) => updateField("studyHabits", v)}
          />
        </View>

        {/* Conflict resolution */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Conflict-resolution style
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical="top"
            placeholder="If there's an issue (noise, dishes, guests), how do you prefer to address it?"
            placeholderTextColor="#A0A5B5"
            value={form.conflictResolution}
            onChangeText={(v) => updateField("conflictResolution", v)}
          />
        </View>

        {/* Ideal weekend */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Ideal weekend
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical="top"
            placeholder="Are you more into going out, chilling at home, or a mix of both?"
            placeholderTextColor="#A0A5B5"
            value={form.idealWeekend}
            onChangeText={(v) => updateField("idealWeekend", v)}
          />
        </View>

        {/* Fun facts */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Fun facts (optional)</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            textAlignVertical="top"
            placeholder="Any fun facts you'd like to share? (You can separate them by lines or commas.)"
            placeholderTextColor="#A0A5B5"
            value={form.funFacts}
            onChangeText={(v) => updateField("funFacts", v)}
          />
        </View>

        {/* Photo Upload */}
<View style={{ marginTop: 24 }}>
  <Text style={styles.label}>Profile Photo</Text>

  {/* Preview */}
  {photo ? (
    <Image
      source={{ uri: photo }}
      style={{
        width: 140,
        height: 140,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#D1D5DB",
      }}
    />
  ) : (
    <View
      style={{
        width: 140,
        height: 140,
        borderRadius: 16,
        backgroundColor: "#F3F4F6",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#9CA3AF" }}>No photo</Text>
    </View>
  )}

      {/* Pick Photo Button */}
          <Pressable
            onPress={async () => {
              // Ask for permission
              const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!permission.granted) {
                alert("Permission to access photos is required.");
                return;
              }

              // Open picker
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
              });

              if (!result.canceled) {
                setPhoto(result.assets[0].uri);
              }
            }}
            style={{
              backgroundColor: "#2563EB",
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Upload Photo
            </Text>
          </Pressable>
        </View>



        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Button
            variant="outline"
            size="lg"
            style={[styles.button, { marginRight: 8 }]}
            onPress={onCancel}
          >
            Cancel
          </Button>
          <Button size="lg" style={styles.button} onPress={handleSave}>
            Save
          </Button>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  multiline: {
    minHeight: 80,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});
