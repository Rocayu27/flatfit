// src/screens/Profile/EditProfileScreen.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/Avatar";
import { X } from "lucide-react-native";

import { MOCK_USER_ID } from "../../lib/mockUser";
import { getProfile, upsertProfile, ProfileRecord } from "../../lib/profiles";
import { supabase } from "../../lib/supabase";

type Props = {
  onCancel: () => void;
  onSaved: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  social: string;
  major: string;
  age: string;
  classYear: string;
  housing: string;
  budget: string;
  hobbies: string[];
};

// same “library” options as ProfileCreation :contentReference[oaicite:0]{index=0}
const MAJORS = [
  "Computer Science",
  "Data Science",
  "Business",
  "Finance",
  "Marketing",
  "Biology",
  "Neuroscience",
  "Psychology",
  "Political Science",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
  "English",
  "Education",
  "Music",
  "Brain & Cognitive Sciences",
  "Mathematics",
  "Statistics",
  "Optics",
  "Art History",
  "Computer Engineering",
  "Biochemistry",
  "Physics",
  "Economics",
  "Public Health",
  "Undecided",
];

const HOUSING_OPTIONS = [
  "Studio",
  "1B1B",
  "2B1B",
  "2B2B",
  "3B1B",
  "3B2B",
  "4B2B",
  "On-campus Dorm",
  "Off-campus Apartment",
  "Townhouse",
];

const BUDGET_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const low = 400 + i * 100;
  const high = low + 200;
  return `$${low}-${high}`;
});

const HOBBY_LIBRARY = [
  "Rock Climbing",
  "Cooking",
  "Gym / Lifting",
  "Reading",
  "Photography",
  "Music",
  "Gaming",
  "Painting",
  "Hiking",
  "Running",
  "Dancing",
  "Volleyball",
  "Tennis",
  "Singing",
  "Piano",
  "Travel",
  "Thrifting",
  "Yoga",
  "Swimming",
  "Coding",
  "Baking",
  "Fashion",
  "K-pop",
  "Anime",
  "Board Games",
  "Robotics",
  "Rowing",
  "Film Making",
  "Writing",
];

const YEARS = Array.from({ length: 11 }, (_, i) => `${2022 + i}`);
const AGES = Array.from({ length: 14 }, (_, i) => `${17 + i}`);

// format phone same as ProfileCreation
const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6)
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function EditProfileScreen({ onCancel, onSaved }: Props) {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phone: "",
    social: "",
    major: "",
    age: "",
    classYear: "",
    housing: "",
    budget: "",
    hobbies: [],
  });

  const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const [majorQuery, setMajorQuery] = useState("");
  const [hobbyQuery, setHobbyQuery] = useState("");

  const [showYearSheet, setShowYearSheet] = useState(false);
  const [showAgeSheet, setShowAgeSheet] = useState(false);
  const [showHousingSheet, setShowHousingSheet] = useState(false);
  const [showBudgetSheet, setShowBudgetSheet] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // major search options
  const filteredMajors = useMemo(() => {
    if (!majorQuery.trim()) return [];
    return MAJORS.filter((m) =>
      m.toLowerCase().includes(majorQuery.toLowerCase())
    );
  }, [majorQuery]);

  // hobby suggestions
  const filteredHobbies = useMemo(() => {
    if (!hobbyQuery.trim()) return [];
    return HOBBY_LIBRARY.filter(
      (h) =>
        h.toLowerCase().includes(hobbyQuery.toLowerCase()) &&
        !form.hobbies.includes(h)
    );
  }, [hobbyQuery, form.hobbies]);

  const addHobby = (hobby: string) => {
    updateField("hobbies", [...form.hobbies, hobby]);
    setHobbyQuery("");
  };

  const removeHobby = (hobby: string) => {
    updateField(
      "hobbies",
      form.hobbies.filter((h) => h !== hobby)
    );
  };

  // load existing profile
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const profile = (await getProfile(MOCK_USER_ID)) as ProfileRecord | null;

        if (!mounted) return;

        if (profile) {
          setForm({
            firstName: profile.first_name ?? "",
            lastName: profile.last_name ?? "",
            phone: profile.phone ?? "",
            social: profile.contact_notes ?? "",
            major: profile.major ?? "",
            age: profile.age ? String(profile.age) : "",
            classYear: profile.class_year ? String(profile.class_year) : "",
            housing: profile.housing_preference ?? "",
            budget: profile.budget_range ?? "",
            hobbies: profile.hobbies ?? [],
          });
          setInitialAvatarUrl(profile.avatar_url ?? null);
        }
      } catch (e) {
        console.error("Error loading profile for edit", e);
        Alert.alert("Error", "Could not load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your photos to let you choose a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // new API – get rid of deprecated MediaTypeOptions
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLocalAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
      const requiredFields: { key: keyof typeof form; label: string }[] = [
      { key: "firstName", label: "First name" },
      { key: "lastName", label: "Last name" },
      { key: "major", label: "Major" },
      { key: "classYear", label: "Class year" },
      { key: "age", label: "Age" },
      { key: "housing", label: "Housing preference" },
      { key: "budget", label: "Budget range" },
    ];

    for (const field of requiredFields) {
      const value = form[field.key];
      if (!value || String(value).trim() === "") {
        Alert.alert(
          "Missing information",
          `Please fill in your ${field.label} before saving.`
        );
        return;
      }
    }

    if (saving) return;
    setSaving(true);

    try {
      let avatarUrl = initialAvatarUrl;

      // 1) upload avatar if changed – Expo/RN-friendly (no blob)
      if (localAvatarUri) {
        const uri = localAvatarUri;
        const ext = uri.split(".").pop() || "jpg";
        const path = `avatars/${MOCK_USER_ID}.${ext}`;
        const contentType =
          ext.toLowerCase() === "png" ? "image/png" : "image/jpeg";

        // Fetch the local image as binary data
        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();
        const fileData = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, fileData, {
            upsert: true,
            contentType,
          });

        if (uploadError) {
          console.error("Avatar upload error", uploadError);
          Alert.alert("Error", "Failed to upload profile photo.");
          setSaving(false);
          return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(path);

        avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

        setInitialAvatarUrl(avatarUrl);
        setLocalAvatarUri(null);
      }



      // 2) Upsert profile (keep hobbies!)
      await upsertProfile(MOCK_USER_ID, {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone || null,
        contact_notes: form.social || null,
        major: form.major || null,
        age: form.age ? Number(form.age) : null,
        class_year: form.classYear ? Number(form.classYear) : null,
        housing_preference: form.housing || null,
        budget_range: form.budget || null,
        hobbies: form.hobbies.length ? form.hobbies : null,
        avatar_url: avatarUrl ?? null,
      });

      onSaved();
    } catch (e) {
      console.error("Error saving profile", e);
      Alert.alert("Error", "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const avatarPreview = localAvatarUri || initialAvatarUrl || null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Avatar */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.avatarRow}>
              <Avatar size={72}>
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} />
                ) : (
                  <AvatarFallback>
                    <Text style={{ fontSize: 16, color: "#6B7280" }}>Add</Text>
                  </AvatarFallback>
                )}
              </Avatar>

              <Button
                variant="outline"
                size="sm"
                style={styles.changePhotoButton}
                onPress={handlePickImage}
              >
                Change Photo
              </Button>
            </View>
          </Card>



          {/* Basic info – same structure as creation */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Basic Info</Text>

            <Text style={styles.label}>
              First Name
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={(v) => updateField("firstName", v)}
              placeholder="Alex"
            />

            <Text style={styles.label}>
              Last Name
              <Text style={styles.required}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={(v) => updateField("lastName", v)}
              placeholder="Yu"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(v) => updateField("phone", formatPhone(v))}
              keyboardType="phone-pad"
              placeholder="(123) 456-7890"
            />

            <Text style={styles.label}>Contact / Social Media</Text>
            <TextInput
              style={styles.input}
              value={form.social}
              onChangeText={(v) => updateField("social", v)}
              placeholder="ins: @username, email me at..."
            />
          </Card>

          {/* Major + year + age */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>School & Housing</Text>

            {/* Major search */}
            <Text style={styles.label}>
              Major
              <Text style={styles.required}> *</Text>
            </Text>
            <View>
              <TextInput
                style={styles.input}
                value={majorQuery || form.major}
                onChangeText={(v) => {
                  setMajorQuery(v);
                  updateField("major", "");
                }}
                placeholder="Search your major..."
              />

              {filteredMajors.length > 0 && (
                <Card style={styles.dropdownCard}>
                  {filteredMajors.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={styles.dropdownItem}
                      onPress={() => {
                        updateField("major", m);
                        setMajorQuery("");
                      }}
                    >
                      <Text style={styles.dropdownText}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </Card>
              )}
            </View>

            {/* Class year */}
            <Text style={styles.label}>
              Class Year
              <Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowYearSheet(true)}
            >
              <Text style={styles.pickerText}>
                {form.classYear || "Select"}
              </Text>
            </TouchableOpacity>

            {/* Age */}
            <Text style={styles.label}>
              Age
              <Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowAgeSheet(true)}
            >
              <Text style={styles.pickerText}>{form.age || "Select"}</Text>
            </TouchableOpacity>

            {/* Housing */}
            <Text style={styles.label}>
              Housing Preference
              <Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowHousingSheet(true)}
            >
              <Text style={styles.pickerText}>
                {form.housing || "Select"}
              </Text>
            </TouchableOpacity>

            {/* Budget */}
            <Text style={styles.label}>
              Budget
              <Text style={styles.required}> *</Text>
            </Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowBudgetSheet(true)}
            >
              <Text style={styles.pickerText}>{form.budget || "Select"}</Text>
            </TouchableOpacity>
          </Card>

          {/* Hobbies */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Hobbies & Interests</Text>

            <TextInput
              style={styles.input}
              value={hobbyQuery}
              onChangeText={setHobbyQuery}
              placeholder="Type a hobby..."
            />

            {filteredHobbies.length > 0 && (
              <Card style={styles.dropdownCard}>
                {filteredHobbies.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={styles.dropdownItem}
                    onPress={() => addHobby(h)}
                  >
                    <Text style={styles.dropdownText}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </Card>
            )}

            <View style={styles.chipContainer}>
              {form.hobbies.map((h) => (
                <Badge key={h} variant="secondary" style={styles.chip}>
                  <Text>{h}</Text>
                  <TouchableOpacity onPress={() => removeHobby(h)}>
                    <X size={14} color="#555" />
                  </TouchableOpacity>
                </Badge>
              ))}
            </View>
          </Card>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Button
              variant="outline"
              style={[styles.button, { marginRight: 8 }]}
              onPress={onCancel}
            >
              Cancel
            </Button>
            <Button
              style={styles.button}
              onPress={handleSave}
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </View>
        </ScrollView>

        {/* Bottom sheets (year, age, housing, budget) */}
        <Modal transparent visible={showYearSheet} animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setShowYearSheet(false)}
          >
            <Pressable style={styles.sheet}>
              <Text style={styles.sheetTitle}>Select Class Year</Text>
              <ScrollView style={{ maxHeight: "60%" }}>
                {YEARS.map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={styles.sheetItem}
                    onPress={() => {
                      updateField("classYear", y);
                      setShowYearSheet(false);
                    }}
                  >
                    <Text style={styles.sheetItemText}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal transparent visible={showAgeSheet} animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setShowAgeSheet(false)}
          >
            <Pressable style={styles.sheet}>
              <Text style={styles.sheetTitle}>Select Age</Text>
              <ScrollView style={{ maxHeight: "60%" }}>
                {AGES.map((a) => (
                  <TouchableOpacity
                    key={a}
                    style={styles.sheetItem}
                    onPress={() => {
                      updateField("age", a);
                      setShowAgeSheet(false);
                    }}
                  >
                    <Text style={styles.sheetItemText}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal transparent visible={showHousingSheet} animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setShowHousingSheet(false)}
          >
            <Pressable style={styles.sheet}>
              <Text style={styles.sheetTitle}>Select Housing</Text>
              <ScrollView style={{ maxHeight: "60%" }}>
                {HOUSING_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.sheetItem}
                    onPress={() => {
                      updateField("housing", opt);
                      setShowHousingSheet(false);
                    }}
                  >
                    <Text style={styles.sheetItemText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        <Modal transparent visible={showBudgetSheet} animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setShowBudgetSheet(false)}
          >
            <Pressable style={styles.sheet}>
              <Text style={styles.sheetTitle}>Select Budget</Text>
              <ScrollView style={{ maxHeight: "60%" }}>
                {BUDGET_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.sheetItem}
                    onPress={() => {
                      updateField("budget", opt);
                      setShowBudgetSheet(false);
                    }}
                  >
                    <Text style={styles.sheetItemText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 12,
    color: "#6B7280",
  },
  changePhotoButton: {
    marginLeft: 16,
  },
  label: {
    fontSize: 13,
    color: "#6A7084",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#E3E7F2",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  dropdownCard: {
    marginTop: 4,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
  dropdownText: { fontSize: 14, color: "#1F2430" },
  picker: {
    backgroundColor: "#fff",
    borderColor: "#E3E7F2",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  pickerText: { fontSize: 14, color: "#1F2430" },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  required: {
  color: "#EF4444",
  },

  sheetTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  sheetItem: { paddingVertical: 14 },
  sheetItemText: { fontSize: 15 },
});
