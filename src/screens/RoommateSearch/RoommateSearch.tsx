// src/components/RoommateSearch.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  GestureResponderEvent,
} from "react-native";
import { Info, Edit, ClipboardList } from "lucide-react-native";
import { Button } from "../../ui/Button";
import { ImageWithFallback } from "../../ui/ImageWithFallback";
import { ConnectionSuccessDialog } from "../../ui/ConnectionSuccessDialog";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { CompatibilityAnswers } from "./../RoommateSearch/CompatibilityQuiz";

interface SupabaseRoommate {
  id: string;
  display_name: string;
  age: number | null;
  class_year: number | null;
  gender: string | null;

  major: string | null;
  housing_preference: string | null;
  budget_range: string | null;

  main_photo_url: string | null;
  photo_urls: string[] | null;

  introduction: string | null;
  cleanliness_text: string | null;
  study_habits_text: string | null;
  conflict_resolution_text: string | null;
  hobbies_text: string | null;
  ideal_weekend_text: string | null;
  fun_facts: string[] | null;
}

interface RoommateProfile {
  id: string;
  name: string;
  age: number | null;
  year: string;
  gender: string | null;

  major?: string | null;
  housingPreference?: string | null;
  budgetRange?: string | null;

  mainPhoto: string | null;
  photos: string[];
  introduction: string;
  cleanliness: string;
  studyHabits: string;
  conflictResolution: string;
  hobbies: string;
  idealWeekend: string;
  funFacts: string[];
}

type Props = {
  compatibilityFilters: CompatibilityAnswers;
  onEditQuiz?: () => void;
  onEditProfile?: () => void;
  showTutorialInitially?: boolean;
  onTutorialSeen?: () => void;
};

export function RoommateSearch({
  compatibilityFilters,
  onEditQuiz,
  onEditProfile,
  showTutorialInitially = false,
  onTutorialSeen,
}: Props) {



  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(showTutorialInitially);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const startX = useRef(0);
  const lastTap = useRef(0);

  const SWIPE_THRESHOLD = 50;   
  const MAX_DRAG_OFFSET = 80; 



  useEffect(() => {
  let mounted = true;

  async function loadFilteredProfiles() {
    const { data, error } = await supabase
      .from("roommate_profiles")
      .select("*")
      .eq("is_visible", true);

    if (error) {
      console.error("Error loading roommate_profiles:", error);
      return;
    }
    if (!mounted || !data) return;

    // --- COMPATIBILITY FILTER LOGIC ---
    const MAX_DIFF = 3;
    const diff = (dbVal: number | null, userVal: number) =>
      dbVal !== null && Math.abs(dbVal - userVal) <= MAX_DIFF;

    const filtered = data.filter((p) =>
      diff(p.sleep_schedule, compatibilityFilters.sleepSchedule) &&
      diff(p.noise_tolerance, compatibilityFilters.noiseTolerance) &&
      diff(p.cleanliness_score, compatibilityFilters.cleanliness) &&
      diff(p.guest_frequency, compatibilityFilters.guestFrequency) &&
      diff(p.overnight_guests, compatibilityFilters.overnightGuests) &&
      diff(p.study_environment, compatibilityFilters.studyEnvironment) &&
      diff(p.social_energy, compatibilityFilters.socialEnergy)
    );

    // --- MAP DB → UI FORMAT ---
    const mapped: RoommateProfile[] = filtered.map((r) => ({
      id: r.id,
      name: r.display_name,
      age: r.age,
      year: r.class_year ? `'${String(r.class_year).slice(2)}` : "",
      gender: r.gender,
      major: r.major,
      housingPreference: r.housing_preference,
      budgetRange: r.budget_range,
      mainPhoto: r.main_photo_url,
      photos: r.photo_urls ?? [],
      introduction: r.introduction ?? "",
      cleanliness: r.cleanliness_text ?? "",
      studyHabits: r.study_habits_text ?? "",
      conflictResolution: r.conflict_resolution_text ?? "",
      hobbies: r.hobbies_text ?? "",
      idealWeekend: r.ideal_weekend_text ?? "",
      funFacts: r.fun_facts ?? [],
    }));

    setProfiles(mapped);
    setCurrentIndex(0);
  }

  loadFilteredProfiles();
  return () => { mounted = false };
}, [compatibilityFilters]);


  const currentProfile = profiles[currentIndex];
  const handleCloseInfo = () => {
  setShowInfoModal(false);
  if (showTutorialInitially && onTutorialSeen) {
    onTutorialSeen();
  }
};

  // --------------------------------------------------
  // TOUCH EVENTS (unchanged)
  // --------------------------------------------------
    const handleTouchStart = (e: GestureResponderEvent) => {
      startX.current = e.nativeEvent.pageX;
      setIsDragging(true);
    };

    const handleTouchMove = (e: GestureResponderEvent) => {
      if (!isDragging) return;

      const currentX = e.nativeEvent.pageX;
      let offset = currentX - startX.current;

      // clamp how far the card can visually move so we don’t see huge white gaps
      if (offset > MAX_DRAG_OFFSET) offset = MAX_DRAG_OFFSET;
      if (offset < -MAX_DRAG_OFFSET) offset = -MAX_DRAG_OFFSET;

      setDragOffset(offset);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);

      // smaller threshold → “more sensitive” swipe
      if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
        if (dragOffset > 0) {
          // swipe right → previous
          goToPrevious();
        } else {
          // swipe left → next
          goToNext();
        }
      }

      // snap card back into place
      setDragOffset(0);
    };


  const goToNext = () => {
    if (currentIndex < profiles.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // --------------------------------------------------
  // DOUBLE TAP LIKE
  // --------------------------------------------------
  const handleLike = () => setShowSuccessDialog(true);

  const handleCardTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) handleLike();
    lastTap.current = now;
  };

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------
  if (!currentProfile) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.root}>
        {/* Top-left button → directly retake quiz */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            onEditQuiz?.();
          }}
        >
          <ClipboardList size={20} color={styles.infoIcon.color} />
        </TouchableOpacity>

        <View style={styles.emptyContainer}>
          <Text style={styles.mutedText}>No more profiles to show</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}



    const transformProfile = (p: any) => ({
    name: `${p.display_name}, '${String(p.class_year).slice(2)}`,
    age: p.age,
    year: `'${String(p.class_year).slice(2)}`,
    gender: p.gender,
    mainPhoto: p.main_photo_url,
    photos: p.photo_urls || [],
    introduction: p.introduction,
    cleanliness: p.cleanliness_text,
    studyHabits: p.study_habits_text,
    conflictResolution: p.conflict_resolution_text,
    hobbies: p.hobbies_text,
    idealWeekend: p.ideal_weekend_text,
    funFacts: p.fun_facts || [],
  });

  

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.root}>


      {/* Top buttons row: Edit (left) + Info (right) */}
      <View style={styles.topButtonsRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            // go to roommate profile editor
            setShowEditDialog(true);
          }}
        >
          <Edit size={20} color={styles.infoIcon.color} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowInfoModal(true)}
        >
          <Info size={20} color={styles.infoIcon.color} />
        </TouchableOpacity>
      </View>


        {/* Swipeable profile */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Pressable onPress={handleCardTap}>
            {/* Header - name badge */}
            <View style={styles.nameBadgeWrapper}>
              <View style={styles.nameBadge}>
                <Text style={styles.nameBadgeText}>
                  {currentProfile.name}, {currentProfile.year}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.cardContainer,
                { transform: [{ translateX: dragOffset }] },
              ]}
            >
              {/* Main photo */}
              <View style={styles.mainPhotoWrapper}>
                <ImageWithFallback
                  key={currentProfile.id}   
                  source={{ uri: currentProfile.mainPhoto ?? "" }}
                  alt={currentProfile.name}
                  style={styles.mainPhoto}
                />
              </View>

              {/* Age / Gender */}
              <View style={styles.ageGenderRow}>
                <Text style={styles.labelText}>
                  <Text style={styles.bold}>Age: </Text>
                  {currentProfile.age ?? "-"}
                </Text>
                <Text style={styles.labelText}>
                  <Text style={styles.bold}>Gender: </Text>
                  {currentProfile.gender ?? "-"}
                </Text>
              </View>

              {/* Academic info */}
              {(currentProfile.major || currentProfile.year) && (
                <View style={styles.academicRow}>
                  <Text style={styles.labelText}>
                    {currentProfile.major ?? ""}
                    {currentProfile.major && currentProfile.year ? " • " : ""}
                    {currentProfile.year ? `Class of 20${currentProfile.year.replace("'", "")}` : ""}
                  </Text>
                </View>
              )}

              {/* Housing & budget */}
              {(currentProfile.housingPreference ||
                currentProfile.budgetRange) && (
                <View style={styles.housingRow}>
                  {currentProfile.housingPreference && (
                    <Text style={styles.labelText}>
                      <Text style={styles.bold}>Housing: </Text>
                      {currentProfile.housingPreference}
                    </Text>
                  )}
                  {currentProfile.budgetRange && (
                    <Text style={styles.labelText}>
                      <Text style={styles.bold}>Budget: </Text>
                      {currentProfile.budgetRange}
                    </Text>
                  )}
                </View>
              )}

              {/* Info sections */}
              <View style={styles.sections}>
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Introduction:</Text>
                  <Text style={styles.sectionBody}>
                    {currentProfile.introduction}
                  </Text>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Cleanliness Habits:</Text>
                  <Text style={styles.sectionBody}>
                    {currentProfile.cleanliness}
                  </Text>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Photos:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.photosRow}
                  >
                    {currentProfile.photos.map((p, i) => (
                      <ImageWithFallback
                        key={i}
                        source={{ uri: p }}
                        style={styles.photoThumb}
                      />
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Study Habits:</Text>
                  <Text style={styles.sectionBody}>
                    {currentProfile.studyHabits}
                  </Text>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>
                    Conflict Resolution Style:
                  </Text>
                  <Text style={styles.sectionBody}>
                    {currentProfile.conflictResolution}
                  </Text>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Hobbies:</Text>
                  <Text style={styles.sectionBody}>
                    {currentProfile.hobbies}
                  </Text>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Ideal Weekend:</Text>
                  <Text style={styles.sectionBody}>
                    {currentProfile.idealWeekend}
                  </Text>
                </View>

                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Fun Facts:</Text>
                  {currentProfile.funFacts.map((f, i) => (
                    <Text key={i} style={styles.sectionBody}>
                      • {f}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={{ height: 24 }} />
            </View>
          </Pressable>
        </ScrollView>

        {/* Navigation dots */}
        <View style={styles.dotsRow}>
          {profiles.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex
                  ? styles.dotActive
                  : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Edit options modal */}
        <Modal
          visible={showEditDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEditDialog(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { marginBottom: 8 }]}>
                Edit your roommate matching
              </Text>

              {/* Edit roommate profile */}
              <TouchableOpacity
                style={styles.editOptionRow}
                onPress={() => {
                  setShowEditDialog(false);
                  onEditProfile?.();
                }}
              >
                <View style={styles.editIconBubble}>
                  <Edit size={18} color="#2563EB" />
                </View>
                <View style={styles.editTextCol}>
                  <Text style={styles.modalItemTitle}>Edit roommate profile</Text>
                  <Text style={styles.modalItemBody}>
                    Update your intro, habits, and fun facts.
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Retake compatibility quiz */}
              <TouchableOpacity
                style={styles.editOptionRow}
                onPress={() => {
                  setShowEditDialog(false);
                  onEditQuiz?.();
                }}
              >
                <View style={styles.editIconBubble}>
                  <ClipboardList size={18} color="#2563EB" />
                </View>
                <View style={styles.editTextCol}>
                  <Text style={styles.modalItemTitle}>Retake compatibility quiz</Text>
                  <Text style={styles.modalItemBody}>
                    Update your matching preferences.
                  </Text>
                </View>
              </TouchableOpacity>

              <Button
                style={{ marginTop: 16, width: "100%" }}
                onPress={() => setShowEditDialog(false)}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>


        {/* Info modal */}
        <Modal
          visible={showInfoModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { marginBottom: 12 }]}>
                How to Use Roommate Search
              </Text>

              <View style={styles.modalItemRow}>
                <View style={styles.modalIconBubble}>
                  <Text style={styles.modalIconText}>👈</Text>
                </View>
                <View style={styles.modalTextCol}>
                  <Text style={styles.modalItemTitle}>Swipe Left/Right</Text>
                  <Text style={styles.modalItemBody}>
                    Navigate between different roommate profiles
                  </Text>
                </View>
              </View>

              <View style={styles.modalItemRow}>
                <View style={styles.modalIconBubble}>
                  <Text style={styles.modalIconText}>👆</Text>
                </View>
                <View style={styles.modalTextCol}>
                  <Text style={styles.modalItemTitle}>Double Tap</Text>
                  <Text style={styles.modalItemBody}>
                    Like a profile to send a connection request
                  </Text>
                </View>
              </View>

              <View style={styles.modalItemRow}>
                <View style={styles.modalIconBubble}>
                  <Text style={styles.modalIconText}>📱</Text>
                </View>
                <View style={styles.modalTextCol}>
                  <Text style={styles.modalItemTitle}>Check Messages</Text>
                  <Text style={styles.modalItemBody}>
                    After sending a like, the roommate will reach out to you if they see a match.
                  </Text>
                </View>
              </View>

              <Button
                style={{ marginTop: 16, width: "100%" }}
                onPress={() => setShowInfoModal(false)}
              >
                Got it!
              </Button>
            </View>
          </View>
        </Modal>

        <ConnectionSuccessDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          message="Your connection request has been sent! Check your messages for responses."
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E5E7EB40",
    paddingTop: 8,
  },
  root: {
    flex: 1,
    backgroundColor: "#E5E7EB40",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  mutedText: {
    color: "#6B7280",
    fontSize: 14,
  },
  topButtonsRow: {
  position: "absolute",
  top: 16,
  left: 16,
  right: 16,
  zIndex: 20,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  infoIcon: {
    color: "#2563EB",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  nameBadgeWrapper: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 16,
  },
  nameBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  nameBadgeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardContainer: {
    paddingHorizontal: 32,
  },
  mainPhotoWrapper: {
    marginBottom: 24,
  },
  mainPhoto: {
    width: "100%",
    height: 335,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  ageGenderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  labelText: {
    fontSize: 14,
    color: "#111827",
  },
  bold: {
    fontWeight: "600",
  },
  sections: {
    paddingHorizontal: 8,
    paddingBottom: 24,
    gap: 12,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 14,
    color: "#4B5563",
  },
  photosRow: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  photoThumb: {
    width: 151,
    height: 160,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginRight: 12,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 16,
    gap: 8,
  },
  dot: {
    height: 4,
    borderRadius: 999,
  },
  dotActive: {
    width: 32,
    backgroundColor: "#2563EB",
  },
  dotInactive: {
    width: 16,
    backgroundColor: "#D1D5DB",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
    textAlign: "center",
  },
  modalItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
  modalIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(37,99,235,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  modalIconText: {
    fontSize: 18,
    color: "#2563EB",
  },
  modalTextCol: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalItemBody: {
    fontSize: 13,
    color: "#6B7280",
  },
  academicRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  housingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  editButtonsWrapper: {
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 30,
},
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  editButtonText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "600",
  },
    emptyRetakeButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 16,
  },
  emptyRetakeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

editOptionRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginTop: 12,
},
editIconBubble: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: "rgba(37,99,235,0.08)",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 10,
},
editTextCol: {
  flex: 1,
},



});
