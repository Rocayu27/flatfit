// src/screens/ProfileCreationScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileData {
  name: string;
  age: string;
  major: string;
  year: string;
  housing: string;
  budget: string;
  hobbies: string;
}

interface ProfileCreationScreenProps {
  onSaveProfile: (profile: ProfileData) => void;
  onBackToLogin: () => void;
}

export default function ProfileCreationScreen({
  onSaveProfile,
  onBackToLogin,
}: ProfileCreationScreenProps) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    age: "",
    major: "",
    year: "",
    housing: "",
    budget: "",
    hobbies: "",
  });

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // later: save to backend or AsyncStorage
    onSaveProfile(profile);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>Create Your Profile</Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(v) => updateField("name", v)}
            placeholder="John Doe"
            placeholderTextColor="#A0A5B5"
          />

          {/* Age */}
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={profile.age}
            onChangeText={(v) => updateField("age", v)}
            keyboardType="numeric"
            placeholder="21"
            placeholderTextColor="#A0A5B5"
          />

          {/* Major */}
          <Text style={styles.label}>Major</Text>
          <TextInput
            style={styles.input}
            value={profile.major}
            onChangeText={(v) => updateField("major", v)}
            placeholder="Computer Science"
            placeholderTextColor="#A0A5B5"
          />

          {/* Class Year */}
          <Text style={styles.label}>Class Year</Text>
          <TextInput
            style={styles.input}
            value={profile.year}
            onChangeText={(v) => updateField("year", v)}
            placeholder="2026"
            placeholderTextColor="#A0A5B5"
          />

          {/* Housing Preference */}
          <Text style={styles.label}>Housing Preference</Text>
          <TextInput
            style={styles.input}
            value={profile.housing}
            onChangeText={(v) => updateField("housing", v)}
            placeholder="2B1B, Single, On-Campus…"
            placeholderTextColor="#A0A5B5"
          />

          {/* Budget */}
          <Text style={styles.label}>Budget</Text>
          <TextInput
            style={styles.input}
            value={profile.budget}
            onChangeText={(v) => updateField("budget", v)}
            placeholder="$700–900/mo"
            placeholderTextColor="#A0A5B5"
          />

          {/* Hobbies */}
          <Text style={styles.label}>Hobbies & Interests</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={profile.hobbies}
            onChangeText={(v) => updateField("hobbies", v)}
            placeholder="Cooking, gaming, music…"
            placeholderTextColor="#A0A5B5"
            multiline
          />

          {/* Save Profile */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Profile</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  root: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2430",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    color: "#6A7084",
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E3E7F2",
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1F2430",
  },
  multiline: {
    height: 90,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#4C6FFF",
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    width: "100%",
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4C6FFF",
  },
  backText: {
    color: "#4C6FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
