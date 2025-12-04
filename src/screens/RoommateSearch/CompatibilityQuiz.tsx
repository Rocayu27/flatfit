import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type CompatibilityAnswers = {
  sleepSchedule: number;      // early bird (0) – night owl (10)
  noiseTolerance: number;     // needs quiet (0) – ok with noise (10)
  cleanliness: number;        // messy (0) – very tidy (10)
  guestFrequency: number;     // rarely guests (0) – guests often (10)
  overnightGuests: number;    // never (0) – very often (10)
  studyEnvironment: number;   // social / noisy (0) – quiet / focused (10)
  socialEnergy: number;       // keeps to self (0) – very social (10)
};

type QuestionKey = keyof CompatibilityAnswers;

type QuestionConfig = {
  key: QuestionKey;
  title: string;
  subtitle: string;
  minLabel: string;
  maxLabel: string;
};

type Props = {
  onComplete?: (answers: CompatibilityAnswers) => void;
  navigation?: any; // if you pass navigation from React Navigation
};

const questions: QuestionConfig[] = [
  {
    key: "sleepSchedule",
    title: "Sleep Schedule",
    subtitle: "When do you usually go to bed and wake up?",
    minLabel: "Early bird",
    maxLabel: "Night owl",
  },
  {
    key: "noiseTolerance",
    title: "Noise Tolerance",
    subtitle: "How much background noise is okay in the room?",
    minLabel: "Need quiet",
    maxLabel: "Okay with noise",
  },
  {
    key: "cleanliness",
    title: "Cleanliness",
    subtitle: "How tidy do you keep your space on a daily basis?",
    minLabel: "More relaxed",
    maxLabel: "Very tidy",
  },
  {
    key: "guestFrequency",
    title: "Guests & Hangouts",
    subtitle: "How often do you like having friends over?",
    minLabel: "Rarely",
    maxLabel: "Very often",
  },
  {
    key: "overnightGuests",
    title: "Overnight Guests",
    subtitle: "How comfortable are you with overnight guests?",
    minLabel: "Never",
    maxLabel: "Totally fine",
  },
  {
    key: "studyEnvironment",
    title: "Study Environment",
    subtitle: "What kind of environment do you prefer when studying?",
    minLabel: "Social / noisy",
    maxLabel: "Quiet / focused",
  },
  {
    key: "socialEnergy",
    title: "Social Energy at Home",
    subtitle: "How much do you want to socialize with your roommate?",
    minLabel: "Keep to myself",
    maxLabel: "Very social",
  },
];

const scaleValues = Array.from({ length: 11 }, (_, i) => i); // 0–10

const CompatibilityQuiz: React.FC<Props> = ({ onComplete, navigation }) => {
  const [answers, setAnswers] = useState<CompatibilityAnswers>({
    sleepSchedule: 5,
    noiseTolerance: 5,
    cleanliness: 5,
    guestFrequency: 5,
    overnightGuests: 5,
    studyEnvironment: 5,
    socialEnergy: 5,
  });

  const handleChange = (key: QuestionKey, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleFinish = () => {
  // Notify App.tsx that the quiz is complete
  onComplete?.(answers);

  // Do NOT navigate here — App.tsx handles the flow after quiz completion
};


  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Roommate Compatibility</Text>
        <Text style={styles.headerSubtitle}>
          Answer a few questions to help us recommend compatible roommates.
        </Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {questions.map((q, index) => (
          <View key={q.key} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionTitle}>{q.title}</Text>
              <Text style={styles.questionProgress}>
                {index + 1} / {questions.length}
              </Text>
            </View>
            <Text style={styles.questionSubtitle}>{q.subtitle}</Text>

            {/* Scale */}
            <View style={styles.scaleRow}>
              {scaleValues.map((value) => {
                const selected = answers[q.key] === value;
                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleChange(q.key, value)}
                    style={[
                      styles.scaleDot,
                      selected && styles.scaleDotSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.scaleNumber,
                        selected && styles.scaleNumberSelected,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.scaleLabelsRow}>
              <Text style={styles.scaleLabelText}>{q.minLabel}</Text>
              <Text style={styles.scaleLabelText}>{q.maxLabel}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Continue button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
          <Text style={styles.primaryButtonText}>See Matches</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CompatibilityQuiz;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  questionProgress: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  questionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  scaleDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  scaleDotSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  scaleNumber: {
    fontSize: 11,
    color: "#4B5563",
  },
  scaleNumberSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  scaleLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  scaleLabelText: {
    fontSize: 12,
    color: "#6B7280",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
