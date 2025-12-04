// src/screens/ProfileCreationScreen.tsx

import React, { useState, useMemo } from "react";
import * as ImagePicker from "expo-image-picker"; 
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,          
  Alert, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/Avatar";
import { X } from "lucide-react-native";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  social: string;
  major: string;
  age: string;
  year: string;
  housing: string;
  budget: string;
  hobbies: string[];
  avatarUri?: string | null;
}


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

interface ProfileCreationScreenProps {
  onSaveProfile: (profile: ProfileData) => void;
  onBackToLogin: () => void;
}

export default function ProfileCreationScreen({
  onSaveProfile,
  onBackToLogin,
}: ProfileCreationScreenProps) {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    social: "",
    major: "",
    age: "",
    year: "",
    housing: "",
    budget: "",
    hobbies: [],
  });

  const [majorQuery, setMajorQuery] = useState("");
  const [hobbyQuery, setHobbyQuery] = useState("");

  const [showYearSheet, setShowYearSheet] = useState(false);
  const [showAgeSheet, setShowAgeSheet] = useState(false);
  const [showHousingSheet, setShowHousingSheet] = useState(false);
  const [showBudgetSheet, setShowBudgetSheet] = useState(false);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const updateField = (field: keyof ProfileData, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Image Picker
  const handlePickAvatar = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission needed",
      "We need access to your photos so you can choose a profile picture."
    );
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const uri = result.assets[0].uri;
    setAvatarUri(uri);
    updateField("avatarUri", uri); 
  }
};


  // Format phone number into (XXX) XXX-XXXX
  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6)
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
      6
    )}`;
  };

  // Filter majors
  const filteredMajors = useMemo(() => {
    if (!majorQuery.trim()) return [];
    return MAJORS.filter((m) =>
      m.toLowerCase().includes(majorQuery.toLowerCase())
    );
  }, [majorQuery]);

  // Filter hobby suggestions
  const filteredHobbies = useMemo(() => {
    if (!hobbyQuery.trim()) return [];
    return HOBBY_LIBRARY.filter(
      (h) =>
        h.toLowerCase().includes(hobbyQuery.toLowerCase()) &&
        !profile.hobbies.includes(h)
    );
  }, [hobbyQuery, profile.hobbies]);

  const addHobby = (hobby: string) => {
    updateField("hobbies", [...profile.hobbies, hobby]);
    setHobbyQuery("");
  };

  const removeHobby = (hobby: string) => {
    updateField(
      "hobbies",
      profile.hobbies.filter((h) => h !== hobby)
    );
  };

  const handleSave = () => {
      const requiredFields: { key: keyof typeof profile; label: string }[] = [
      { key: "firstName", label: "First name" },
      { key: "lastName", label: "Last name" },
      { key: "major", label: "Major" },
      { key: "year", label: "Class year" },
      { key: "age", label: "Age" },
      { key: "housing", label: "Housing preference" },
      { key: "budget", label: "Budget range" },
    ];

    for (const field of requiredFields) {
      const value = profile[field.key];
      if (!value || String(value).trim() === "") {
        Alert.alert(
          "Missing information",
          `Please fill in your ${field.label} before continuing.`
        );
        return;
      }
    }

      onSaveProfile({
        ...profile,
        avatarUri, 
      });
    };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>Create Your Profile</Text>

            <Avatar size={96}>
                {avatarUri ? (
                  <AvatarImage src={avatarUri} />
                ) : (
                  <AvatarFallback>
                    <Text style={{ fontSize: 18, color: "#6B7280" }}>Add</Text>
                  </AvatarFallback>
                )}
              </Avatar>

              <TouchableOpacity
                onPress={handlePickAvatar}
                style={{
                  marginTop: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: "#EEF2FF",
                  borderRadius: 999,
                  alignSelf: "center",
                }}
              >
                <Text style={{ color: "#4C6FFF", fontWeight: "600" }}>Choose Photo</Text>
              </TouchableOpacity>


          {/* Name */}
          <Text style={styles.label}>
            First Name
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={profile.firstName}
            onChangeText={(v) => updateField("firstName", v)}
            placeholder="Alex Thompson"
            placeholderTextColor="#A0A5B5"
          />

          {/* Name */}
          <Text style={styles.label}>
            Last Name
            <Text style={styles.required}> *</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={profile.lastName}
            onChangeText={(v) => updateField("lastName", v)}
            placeholder="Alex Thompson"
            placeholderTextColor="#A0A5B5"
          />

          {/* Phone */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={profile.phone}
            onChangeText={(v) => updateField("phone", formatPhone(v))}
            keyboardType="phone-pad"
            placeholder="(123) 456-7890"
            placeholderTextColor="#A0A5B5"
          />

          {/* Social Contact */}
          <Text style={styles.label}>Contact / Social Media</Text>
          <TextInput
            style={styles.input}
            value={profile.social}
            onChangeText={(v) => updateField("social", v)}
            placeholder="ins: @alex.thompson, email me at..."
            placeholderTextColor="#A0A5B5"
          />

          {/* Major */}
          <Text style={styles.label}>
            Major
            <Text style={styles.required}> *</Text>
          </Text>
          <View>
            <TextInput
              style={styles.input}
              value={majorQuery || profile.major}
              onChangeText={(v) => {
                setMajorQuery(v);
                updateField("major", "");
              }}
              placeholder="Search your major..."
              placeholderTextColor="#A0A5B5"
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

          {/* Class Year */}
          <Text style={styles.label}>
            Class Year
            <Text style={styles.required}> *</Text>
          </Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowYearSheet(true)}>
            <Text style={styles.pickerText}>
              {profile.year || "Select"}
            </Text>
          </TouchableOpacity>

          {/* Age */}
          <Text style={styles.label}>
            Age
            <Text style={styles.required}> *</Text>
          </Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowAgeSheet(true)}>
            <Text style={styles.pickerText}>
              {profile.age || "Select"}
            </Text>
          </TouchableOpacity>

          {/* Year Sheet */}
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
                        updateField("year", y);
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

          {/* Age Sheet */}
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



          {/* Housing Preference */}
          <Text style={styles.label}>
            Housing Preference
            <Text style={styles.required}> *</Text>
          </Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowHousingSheet(true)}
          >
            <Text style={styles.pickerText}>
              {profile.housing || "Select"}
            </Text>
          </TouchableOpacity>

          {/* Budget */}
          <Text style={styles.label}>
            Budget Range
            <Text style={styles.required}> *</Text>
          </Text>

          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowBudgetSheet(true)}
          >
            <Text style={styles.pickerText}>
              {profile.budget || "Select"}
            </Text>
          </TouchableOpacity>

          {/* Hobbies */}
          <Text style={styles.label}>Hobbies & Interests</Text>
          <View>
            <TextInput
              style={styles.input}
              value={hobbyQuery}
              onChangeText={(v) => setHobbyQuery(v)}
              placeholder="Type a hobby..."
              placeholderTextColor="#A0A5B5"
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
          </View>

          {/* Hobby Chips */}
          <View style={styles.chipContainer}>
            {profile.hobbies.map((h) => (
              <Badge key={h} variant="secondary" style={styles.chip}>
                <Text>{h}</Text>
                <TouchableOpacity onPress={() => removeHobby(h)}>
                  <X size={14} color="#555" />
                </TouchableOpacity>
              </Badge>
            ))}
          </View>

          {/* Save */}
          <Button style={styles.saveButton} size="lg" onPress={handleSave}>
            Save Profile
          </Button>

          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToLogin}
          >
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Housing Sheet */}
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

        {/* Budget Sheet */}
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
  safeArea: { flex: 1, backgroundColor: "#F5F7FB" },
  root: { flex: 1 },
  content: { padding: 20, paddingBottom: 50 },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  label: { fontSize: 13, color: "#6A7084", marginTop: 14, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#E3E7F2",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  picker: {
    backgroundColor: "#fff",
    borderColor: "#E3E7F2",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  pickerText: { fontSize: 14, color: "#1F2430" },
  saveButton: { marginTop: 30, width: "100%" },
  backButton: {
    width: "100%",
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4C6FFF",
  },
  backText: { color: "#4C6FFF", fontSize: 15, fontWeight: "600" },

  dropdownCard: {
    marginTop: 4,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
  dropdownText: { fontSize: 14, color: "#1F2430" },

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
