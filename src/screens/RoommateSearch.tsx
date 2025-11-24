// src/components/RoommateSearch.tsx

import React, { useState, useRef } from "react";
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
import { Info } from "lucide-react-native";
import { Button } from "../ui/Button";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { ConnectionSuccessDialog } from "../ui/ConnectionSuccessDialog";
import { SafeAreaView } from "react-native-safe-area-context";

interface RoommateProfile {
  id: number;
  name: string;
  age: number;
  year: string;
  gender: string;
  mainPhoto: string;
  photos: string[];
  introduction: string;
  cleanliness: string;
  studyHabits: string;
  conflictResolution: string;
  hobbies: string;
  idealWeekend: string;
  funFacts: string[];
}

const roommateProfiles: RoommateProfile[] = [
  {
    id: 1,
    name: "David Corenswet",
    age: 20,
    year: "'26",
    gender: "M",
    // TODO: replace with your own asset or URL later
    mainPhoto:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=1080&q=80",
    photos: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400",
    ],
    introduction:
      "My name is Chanel and I am a Music major! I am an extremely extroverted person and often have my friends at my place/room.",
    cleanliness: "I am a very organized and clean person!",
    studyHabits: "Usually study in the library :)",
    conflictResolution:
      "You can text me or we can talk about it in person.",
    hobbies: "I love to watch movies and read.",
    idealWeekend:
      "I go out on the weekends and stay out pretty late.",
    funFacts: [
      "I love horror movies!",
      "Vanilla is my favorite ice cream flavor",
      "I love to go on long walks, especially during the fall",
      "I have two dogs and 1 cat",
    ],
  },
  {
    id: 2,
    name: "Sarah Martinez",
    age: 21,
    year: "'25",
    gender: "F",
    mainPhoto:
      "https://images.unsplash.com/photo-1655977237812-ee6beb137203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    photos: [
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400",
    ],
    introduction:
      "Hi! I'm Sarah, a Biology major with a passion for environmental science. I'm pretty chill and enjoy a good balance between studying and social life.",
    cleanliness:
      "I like things tidy but I'm not obsessive about it. Weekly cleaning works for me!",
    studyHabits:
      "I study best at home with some background music, usually late at night.",
    conflictResolution:
      "I prefer talking things out calmly and finding solutions together.",
    hobbies:
      "Photography, hiking, and trying new coffee shops around campus.",
    idealWeekend:
      "Brunch with friends, some outdoor activities, and Netflix at night.",
    funFacts: [
      "I've visited 15 national parks!",
      "I make the best chocolate chip cookies",
      "I'm learning to play ukulele",
      "I collect vintage cameras",
    ],
  },
];

export function RoommateSearch() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(true); // no localStorage yet
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);


  const startX = useRef(0);
  const lastTap = useRef(0);

  const currentProfile = roommateProfiles[currentIndex];

  const handleTouchStart = (e: GestureResponderEvent) => {
    startX.current = e.nativeEvent.pageX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: GestureResponderEvent) => {
    if (!isDragging) return;
    const currentX = e.nativeEvent.pageX;
    const offset = currentX - startX.current;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Swipe threshold
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        // Swipe right - previous
        goToPrevious();
      } else {
        // Swipe left - next
        goToNext();
      }
    }

    setDragOffset(0);
  };

  const goToNext = () => {
    if (currentIndex < roommateProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLike = () => {
    setShowSuccessDialog(true);
  };

  const handleCardTap = () => {
    const now = Date.now();
    const diff = now - lastTap.current;

    if (diff > 0 && diff < 300) {
      // double tap
      handleLike();
    }

    lastTap.current = now;
  };

  if (!currentProfile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.mutedText}>No more profiles to show</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
    <View style={styles.root}>

      {/* Info button */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setShowInfoModal(true)}
      >
        <Info size={20} color={styles.infoIcon.color}  />
      </TouchableOpacity>

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

          {/* Card content with horizontal drag offset */}
          <View
            style={[
              styles.cardContainer,
              {
                transform: [{ translateX: dragOffset }],
              },
            ]}
          >
            {/* Main photo */}
            <View style={styles.mainPhotoWrapper}>
              <ImageWithFallback
                source={currentProfile.mainPhoto}
                alt={currentProfile.name}
                style={styles.mainPhoto}
              />
            </View>

            {/* Age / Gender */}
            <View style={styles.ageGenderRow}>
              <Text style={styles.labelText}>
                <Text style={styles.bold}>Age: </Text>
                {currentProfile.age}
              </Text>
              <Text style={styles.labelText}>
                <Text style={styles.bold}>Gender: </Text>
                {currentProfile.gender}
              </Text>
            </View>

            {/* Info sections */}
            <View style={styles.sections}>
              {/* Introduction */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Introduction:</Text>
                <Text style={styles.sectionBody}>
                  {currentProfile.introduction}
                </Text>
              </View>

              {/* Cleanliness */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Cleanliness Habits:</Text>
                <Text style={styles.sectionBody}>
                  {currentProfile.cleanliness}
                </Text>
              </View>

              {/* Photos */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Photos:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.photosRow}
                >
                  {currentProfile.photos.map((photo, index) => (
                    <ImageWithFallback
                      key={index}
                      source={photo}
                      style={styles.photoThumb}
                    />
                  ))}
                </ScrollView>
              </View>

              {/* Study Habits */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Study Habits:</Text>
                <Text style={styles.sectionBody}>
                  {currentProfile.studyHabits}
                </Text>
              </View>

              {/* Conflict Resolution */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  Conflict Resolution Style:
                </Text>
                <Text style={styles.sectionBody}>
                  {currentProfile.conflictResolution}
                </Text>
              </View>

              {/* Hobbies */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Hobbies:</Text>
                <Text style={styles.sectionBody}>
                  {currentProfile.hobbies}
                </Text>
              </View>

              {/* Ideal Weekend */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Ideal Weekend:</Text>
                <Text style={styles.sectionBody}>
                  {currentProfile.idealWeekend}
                </Text>
              </View>

              {/* Fun Facts */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Fun Facts:</Text>
                {currentProfile.funFacts.map((fact, index) => (
                  <Text key={index} style={styles.sectionBody}>
                    • {fact}
                  </Text>
                ))}
              </View>
            </View>

            {/* Bottom spacing */}
            <View style={{ height: 24 }} />
          </View>
        </Pressable>
      </ScrollView>

      {/* Navigation dots */}
      <View style={styles.dotsRow}>
        {roommateProfiles.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Info / tutorial modal */}
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
                  After sending a like, check your messages for responses
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
  backgroundColor: "#E5E7EB40", // same as your root background
  paddingTop: 8, // or 12/16 if you want more spacing
},
  root: {
    flex: 1,
    backgroundColor: "#E5E7EB40", // secondary/30-ish
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
  infoButton: {
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
});
