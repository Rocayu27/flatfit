// screens/RoommatesScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type RoommateProfile = {
  id: number;
  name: string;
  age: number;
  year: string;
  gender: string;
  mainPhoto: string;      // URL
  photos: string[];       // URLs
  introduction: string;
  cleanliness: string;
  studyHabits: string;
  conflictResolution: string;
  hobbies: string;
  idealWeekend: string;
  funFacts: string[];
};

const roommateProfiles: RoommateProfile[] = [
  // 1
  {
    id: 1,
    name: "David Corenswet",
    age: 20,
    year: "'26",
    gender: "M",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
    photos: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=400",
      "https://images.unsplash.com/photo-1522204502588-0d44c4a5aa47?w=400",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400",
    ],
    introduction:
      "My name is Chanel and I am a Music major! I am an extremely extroverted person and often have my friends at my place/room.",
    cleanliness: "I am a very organized and clean person!",
    studyHabits: "Usually study in the library :)",
    conflictResolution:
      "You can text me or we can talk about it in person.",
    hobbies: "I love to watch movies and read.",
    idealWeekend: "I go out on the weekends and stay out pretty late.",
    funFacts: [
      "I love horror movies!",
      "Vanilla is my favorite ice cream flavor.",
      "I love to go on long walks, especially during the fall.",
      "I have two dogs and 1 cat.",
    ],
  },

  // 2
  {
    id: 2,
    name: "Aiden Brooks",
    age: 21,
    year: "'26",
    gender: "M",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=901",
    photos: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=400",
      "https://images.unsplash.com/photo-1522204502588-0d44c4a5aa47?w=400",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400",
    ],
    introduction:
      "Hey, I’m Aiden, a Computer Science major who loves hackathons and gaming nights.",
    cleanliness:
      "Fridge organization is my love language, and I always take out the trash.",
    studyHabits:
      "I usually code in the CS labs or in my room with lo-fi music.",
    conflictResolution:
      "I prefer honest, straightforward conversations and making a plan together.",
    hobbies: "Weightlifting, indie games, and cooking simple meal-prep recipes.",
    idealWeekend:
      "Gym, brunch with friends, then gaming or a movie marathon at night.",
    funFacts: [
      "Peanut allergy; I always carry an EpiPen.",
      "I can solve a Rubik’s cube in under a minute.",
      "I’ve built my own PC.",
      "I will happily cook extra for a roommate.",
    ],
  },

  // 3
  {
    id: 3,
    name: "Maya Chen",
    age: 20,
    year: "'27",
    gender: "F",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=902",
    photos: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
      "https://images.unsplash.com/photo-1494797710133-75adf6c1f4a3?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    ],
    introduction:
      "Hi! I’m Maya, a Data Science major who loves art, tea, and quiet nights in.",
    cleanliness: "I keep common spaces neat and wipe down counters daily.",
    studyHabits:
      "I like quiet study spaces and usually reserve a library carrel.",
    conflictResolution:
      "I prefer calm conversations after everyone has had time to cool off.",
    hobbies: "Digital drawing, boba runs, and K-dramas.",
    idealWeekend:
      "Finishing assignments early, then painting or hanging out with close friends.",
    funFacts: [
      "Lactose intolerant, so I keep oat milk in the fridge.",
      "I collect washi tape and stickers.",
      "I can write my name in three different scripts.",
      "I love organizing shared calendars for the apartment.",
    ],
  },

  // 4 – ADHD
  {
    id: 4,
    name: "Jordan Patel",
    age: 19,
    year: "'28",
    gender: "M",
    mainPhoto:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900",
    photos: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=400",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400",
    ],
    introduction:
      "I’m Jordan, a Mechanical Engineering major who is always tinkering with something.",
    cleanliness:
      "I’m good about dishes and trash as long as we have a clear system posted.",
    studyHabits:
      "I study in short, focused sprints and like having a whiteboard in the apartment.",
    conflictResolution:
      "Text me first, then we can talk in person — I like having a heads-up.",
    hobbies: "Intramural soccer, 3D printing, and cooking spicy food.",
    idealWeekend:
      "Daytime projects in the maker space, nighttime board-game hangouts.",
    funFacts: [
      "ADHD (well managed with medication) — I love using shared to-do lists.",
      "I always bring snacks to group study sessions.",
      "I can’t function without my mechanical keyboard.",
      "I’ve built three custom drones so far.",
    ],
  },

  // 5
  {
    id: 5,
    name: "Leah Robinson",
    age: 18,
    year: "'29",
    gender: "F",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=903",
    photos: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
    ],
    introduction:
      "I’m Leah, a first-year Public Health major who loves plants and podcasts.",
    cleanliness: "I like to keep surfaces clutter-free and vacuum weekly.",
    studyHabits:
      "I usually study with noise-canceling headphones in coffee shops.",
    conflictResolution: "I’m big on compromise and talking things out early.",
    hobbies: "Houseplants, yoga, and true-crime podcasts.",
    idealWeekend:
      "Farmers market in the morning and a chill movie night at home.",
    funFacts: [
      "Seasonal pollen allergies — I use an air purifier in the spring.",
      "I name all my plants.",
      "I’ve run two half marathons.",
      "I love experimenting with homemade granola recipes.",
    ],
  },

  // 6
  {
    id: 6,
    name: "Samir Khalil",
    age: 21,
    year: "'27",
    gender: "M",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=904",
    photos: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400",
    ],
    introduction:
      "I’m Samir, a Business major who loves cooking and late-night talks.",
    cleanliness:
      "I wipe the kitchen after I cook and prefer a shoes-off apartment.",
    studyHabits:
      "I usually work at the dining table with coffee and headphones.",
    conflictResolution:
      "I appreciate direct, respectful conversations and brainstorming solutions together.",
    hobbies: "Soccer, cooking Mediterranean food, and photography.",
    idealWeekend:
      "Pickup soccer, cooking for friends, and exploring new restaurants.",
    funFacts: [
      "Mild cat allergy; hypoallergenic pets are okay.",
      "I make a mean hummus from scratch.",
      "I speak three languages.",
      "I love hosting small dinner parties.",
    ],
  },

  // 7 – Dyslexia
  {
    id: 7,
    name: "Olivia Russo",
    age: 22,
    year: "'26",
    gender: "F",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=905",
    photos: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      "https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=400",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    ],
    introduction:
      "I’m Olivia, a Psychology major who loves studying how people think and learn.",
    cleanliness:
      "I like a tidy space and usually do a quick reset each night.",
    studyHabits:
      "I use color-coding and audiobooks; I’m most productive in the morning.",
    conflictResolution:
      "I like to journal first, then talk when I’ve sorted my thoughts.",
    hobbies: "Journaling, Pilates, and baking banana bread.",
    idealWeekend:
      "Morning workouts, afternoon studying, and board games with friends.",
    funFacts: [
      "I have dyslexia and use text-to-speech a lot — clear written notes help.",
      "I’ve volunteered as a peer mentor for first-years.",
      "I own way too many highlighters.",
      "I bring leftover baked goods to roommates.",
    ],
  },

  // 8
  {
    id: 8,
    name: "Noah Fernandez",
    age: 19,
    year: "'28",
    gender: "M",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=906",
    photos: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    ],
    introduction:
      "I’m Noah, an Economics major who loves pickup basketball and stand-up comedy specials.",
    cleanliness:
      "I’m neat with shared spaces and like to keep the bathroom organized.",
    studyHabits:
      "I study in the library and like to block out time on Google Calendar.",
    conflictResolution:
      "I prefer to talk things through quickly instead of letting them build up.",
    hobbies: "Basketball, fantasy football, and trying new coffee drinks.",
    idealWeekend:
      "Afternoon games at the gym, then a chill night watching movies.",
    funFacts: [
      "Tree-nut allergy; I always check labels in the kitchen.",
      "I once made it to intramural finals.",
      "I’m weirdly good at mental math.",
      "I make cold brew for the whole apartment.",
    ],
  },

  // 9
  {
    id: 9,
    name: "Chloe Nguyen",
    age: 18,
    year: "'29",
    gender: "F",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=907",
    photos: [
      "https://images.unsplash.com/photo-1522204502588-0d44c4a5aa47?w=400",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400",
    ],
    introduction:
      "I’m Chloe, a first-year Computer Science major who loves design and UI.",
    cleanliness:
      "I keep things pretty minimalist and hate dirty dishes piling up.",
    studyHabits: "I code best late at night with chill playlists.",
    conflictResolution:
      "I like group chats for logistics and quick check-ins in person.",
    hobbies: "Graphic design, bubble tea, and taking photos around campus.",
    idealWeekend:
      "Designing side projects, grabbing desserts, and exploring new study spots.",
    funFacts: [
      "Gluten sensitive — I stick to gluten-free snacks.",
      "I run a small sticker shop online.",
      "I love matching color themes for our apartment.",
      "I’m always down to help with Canva or Figma.",
    ],
  },

  // 10 – Anxiety
  {
    id: 10,
    name: "Ethan Morales",
    age: 21,
    year: "'27",
    gender: "M",
    mainPhoto:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=908",
    photos: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=400",
    ],
    introduction:
      "I’m Ethan, a Political Science major who cares a lot about campus advocacy.",
    cleanliness:
      "I like shared chores with a schedule so things feel predictable.",
    studyHabits:
      "I alternate between the library and my room; I like quiet spaces.",
    conflictResolution:
      "I appreciate gentle check-ins and time to think before big conversations.",
    hobbies: "Campus activism, podcasts, and long city walks.",
    idealWeekend:
      "Sleep in, brunch, and a walk by the river listening to podcasts.",
    funFacts: [
      "I have generalized anxiety (in therapy, well managed) and appreciate advance notice for big changes or guests.",
      "I make extremely organized Google Docs.",
      "I love trying new tea flavors.",
      "I’m always down for a debrief walk.",
    ],
  },
];

export default function RoommatesScreen() {
  const [showHelp, setShowHelp] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const lastTap = useRef(0);

  const current = roommateProfiles[currentIndex];
  const total = roommateProfiles.length;

  const goToNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
          // double-tap => like
          console.log("Liked", current.name);
          goToNext();
        }
        lastTap.current = now;
      },
      onPanResponderMove: (_, gesture) => {
        setDragX(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        const threshold = 80;
        if (gesture.dx > threshold) {
          goToPrevious();
        } else if (gesture.dx < -threshold) {
          goToNext();
        }
        setDragX(0);
      },
      onPanResponderTerminate: () => setDragX(0),
    })
  ).current;

  if (!current) {
    return (
      <View style={styles.root}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No more profiles to show</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* info button */}
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setShowHelp(true)}
      >
        <Ionicons name="information-circle-outline" size={22} color="#2563EB" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* name pill */}
        <View style={styles.namePillWrapper}>
          <View style={styles.namePill}>
            <Text style={styles.namePillText}>
              {current.name}, {current.year}
            </Text>
          </View>
        </View>

        {/* swipable card */}
        <View
          style={[styles.card, { transform: [{ translateX: dragX }] }]}
          {...panResponder.panHandlers}
        >
          {/* main photo */}
          <Image
            source={{ uri: current.mainPhoto }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />

          {/* age & gender */}
          <View style={styles.ageGenderRow}>
            <Text style={styles.ageGenderText}>Age: {current.age}</Text>
            <Text style={styles.ageGenderText}>Gender: {current.gender}</Text>
          </View>

          {/* sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction:</Text>
            <Text style={styles.sectionBody}>{current.introduction}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cleanliness Habits:</Text>
            <Text style={styles.sectionBody}>{current.cleanliness}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosRow}
            >
              {current.photos.map((p, idx) => (
                <Image
                  key={idx}
                  source={{ uri: p }}
                  style={styles.smallPhoto}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Study Habits:</Text>
            <Text style={styles.sectionBody}>{current.studyHabits}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conflict Resolution Style:</Text>
            <Text style={styles.sectionBody}>
              {current.conflictResolution}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hobbies:</Text>
            <Text style={styles.sectionBody}>{current.hobbies}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ideal Weekend:</Text>
            <Text style={styles.sectionBody}>{current.idealWeekend}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fun Facts:</Text>
            {current.funFacts.map((fact, idx) => (
              <Text key={idx} style={styles.sectionBody}>
                • {fact}
              </Text>
            ))}
          </View>

          {/* buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={goToNext}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => {
                console.log("Liked", current.name);
                goToNext();
              }}
            >
              <Text style={styles.likeText}>Send Like</Text>
            </TouchableOpacity>
          </View>

          {/* progress */}
          <Text style={styles.counterText}>
            {currentIndex + 1} of {total} profiles
          </Text>

          <View style={styles.dotsRow}>
            {roommateProfiles.map((p, idx) => (
              <View
                key={p.id}
                style={[
                  styles.dot,
                  idx === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.helperText}>
          Swipe left/right to move between profiles. Double-tap the card or tap
          “Send Like” to send a connection request.
        </Text>
      </ScrollView>

      {/* tutorial overlay */}
      {showHelp && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>How to Use Roommate Search</Text>
              <TouchableOpacity onPress={() => setShowHelp(false)}>
                <Ionicons name="close" size={18} color="#8A90A5" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalLine}>
              <View style={styles.modalIconBubble}>
                <Text style={styles.modalEmoji}>👈</Text>
              </View>
              <View style={styles.modalTextBlock}>
                <Text style={styles.modalItemTitle}>Swipe Left/Right</Text>
                <Text style={styles.modalItemBody}>
                  Navigate between different roommate profiles.
                </Text>
              </View>
            </View>

            <View style={styles.modalLine}>
              <View style={styles.modalIconBubble}>
                <Text style={styles.modalEmoji}>👆</Text>
              </View>
              <View style={styles.modalTextBlock}>
                <Text style={styles.modalItemTitle}>Double Tap</Text>
                <Text style={styles.modalItemBody}>
                  Like a profile to send a connection request.
                </Text>
              </View>
            </View>

            <View style={styles.modalLine}>
              <View style={styles.modalIconBubble}>
                <Text style={styles.modalEmoji}>💬</Text>
              </View>
              <View style={styles.modalTextBlock}>
                <Text style={styles.modalItemTitle}>Check Messages</Text>
                <Text style={styles.modalItemBody}>
                  After sending a like, check your messages for responses.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  infoButton: {
    position: "absolute",
    top: 14,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  namePillWrapper: {
    alignItems: "center",
    marginTop: 56,
    marginBottom: 8,
  },
  namePill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  namePillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: "#F5F7FB",
    borderRadius: 32,
    paddingBottom: 24,
  },
  mainPhoto: {
    marginHorizontal: 24,
    height: 320,
    borderRadius: 36,
    backgroundColor: "#DDE3F4",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  ageGenderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginHorizontal: 32,
  },
  ageGenderText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    marginHorizontal: 24,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },
  sectionBody: {
    fontSize: 13,
    color: "#6B7280",
  },
  photosRow: {
    flexDirection: "row",
    gap: 10,
  },
  smallPhoto: {
    width: 140,
    height: 140,
    borderRadius: 24,
    backgroundColor: "#DDE3F4",
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 18,
    marginHorizontal: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: "center",
  },
  skipButton: {
    borderWidth: 1,
    borderColor: "#D0D4E3",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  likeButton: {
    marginLeft: 8,
    backgroundColor: "#4C6FFF",
  },
  skipText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  likeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  counterText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 11,
    color: "#9CA3AF",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
  },
  dotActive: {
    width: 14,
    backgroundColor: "#4C6FFF",
  },
  helperText: {
    fontSize: 11,
    color: "#8A90A5",
    marginTop: 8,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2430",
  },
  modalLine: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "flex-start",
  },
  modalIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  modalEmoji: {
    fontSize: 18,
  },
  modalTextBlock: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2430",
  },
  modalItemBody: {
    fontSize: 12,
    color: "#6A7084",
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
  },
});
