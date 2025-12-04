// App.tsx

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import Homepage from "./components/Homepage";
import { Login } from "./screens/Login";
import { HousingListings } from "./screens/HouseListings";

import { RoommateSearch } from "./screens/RoommateSearch/RoommateSearch";
import CompatibilityQuiz from "./screens/RoommateSearch/CompatibilityQuiz";
import RoommateProfileEditor from "./screens/RoommateSearch/RoommateProfileEditor";

import { LeaseTransfer } from "./screens/LeaseTransfer/LeaseTransfer";
import { Profile } from "./screens/Profile/Profile";
import { BottomNav, TabId } from "./navigation/BottomNav";
import ProfileCreation from "./screens/Profile/ProfileCreation";
import EditProfileScreen from "./screens/Profile/EditProfileScreen";

import { MOCK_USER_ID } from "./lib/mockUser";
import { upsertProfile } from "./lib/profiles";
import { supabase } from "./lib/supabase";

// app stage
type Stage = "home" | "login" | "profileCreate" | "main" | "profileEdit" | "roommateProfileEdit";

// The shape of answers your CompatibilityQuiz returns
type CompatibilityAnswers = {
  sleepSchedule: number;
  noiseTolerance: number;
  cleanliness: number;
  guestFrequency: number;
  overnightGuests: number;
  studyEnvironment: number;
  socialEnergy: number;
};

export default function App() {
  const [stage, setStage] = useState<Stage>("home");
  const [activeTab, setActiveTab] = useState<TabId>("housing");

  // --- Roommates flow state ---
  const [roommateProfileCompleted, setRoommateProfileCompleted] =
    useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [compatibilityAnswers, setCompatibilityAnswers] =
    useState<CompatibilityAnswers | null>(null);

  let content: React.ReactNode = null;

  if (stage === "home") {
    content = <Homepage onGetStarted={() => setStage("login")} />;
  } else if (stage === "login") {
    content = <Login onLogin={() => setStage("profileCreate")} />;
  } else if (stage === "profileCreate") {
    content = (
      <ProfileCreation
        onSaveProfile={async (profile) => {
          try {
            // ---- 1) Upload avatar if user picked one ----
            let avatarUrl: string | null = null;

            if (profile.avatarUri) {
              const uri = profile.avatarUri;
              const ext = uri.split(".").pop() || "jpg";
              const path = `avatars/${MOCK_USER_ID}.${ext}`;
              const contentType =
                ext.toLowerCase() === "png" ? "image/png" : "image/jpeg";

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
              } else {
                const { data } =
                  supabase.storage.from("avatars").getPublicUrl(path);
                avatarUrl = `${data.publicUrl}?t=${Date.now()}`;
              }
            }

            // ---- 2) Upsert profile row ----
            await upsertProfile(MOCK_USER_ID, {
              first_name: profile.firstName,
              last_name: profile.lastName,
              phone: profile.phone || null,
              contact_notes: profile.social || null,
              major: profile.major || null,
              age: profile.age ? Number(profile.age) : null,
              class_year: profile.year ? Number(profile.year) : null,
              housing_preference: profile.housing || null,
              budget_range: profile.budget || null,
              hobbies:
                profile.hobbies && profile.hobbies.length > 0
                  ? profile.hobbies
                  : null,
              avatar_url: avatarUrl,
            });
          } catch (e) {
            console.error("Failed to save profile", e);
          } finally {
            setStage("main");
            setActiveTab("housing");
          }
        }}
        onBackToLogin={() => setStage("login")}
      />
    );
  }   else if (stage === "profileEdit") {
    content = (
      <EditProfileScreen
        onCancel={() => {
          setStage("main");
          setActiveTab("profile");
        }}
        onSaved={() => {
          setStage("main");
          setActiveTab("profile");
        }}
      />
    );
  } else if (stage === "roommateProfileEdit") {
    // full-screen roommate profile editor (no bottom nav)
    content = (
      <RoommateProfileEditor
        onCancel={() => {
          setStage("main");
          setActiveTab("roommates");
        }}
        onSaved={() => {
          setStage("main");
          setActiveTab("roommates");
        }}
        onDone={() => setStage("main")}
      />
    );
  } else {
    // stage === "main": show tab content
    switch (activeTab) {

      case "housing":
        content = <HousingListings />;
        break;

      case "roommates": {
        // 1) First-time: show Roommate Profile Editor
        if (!roommateProfileCompleted) {
          content = (
            <RoommateProfileEditor
              onCancel={() => {
                // bounce them back to Housing if they bail
                setActiveTab("housing");
              }}
              onSaved={() => {
                // once saved, move to quiz
                setRoommateProfileCompleted(true);
              }}
              onDone={() => setStage("main")}
            />
          );
        }
        // 2) Then the Compatibility Quiz
        else if (!quizCompleted || !compatibilityAnswers) {
          content = (
            <CompatibilityQuiz
              onComplete={async (answers: CompatibilityAnswers) => {
                setCompatibilityAnswers(answers);
                setQuizCompleted(true);
                // later: upsert into roommate_profiles for the logged-in user
              }}
            />
          );
        }
        // 3) Finally, the swipe-based RoommateSearch
        else {
          content = (
            <RoommateSearch
              compatibilityFilters={compatibilityAnswers}
              onEditQuiz={() => setQuizCompleted(false)}
              onEditProfile={() => setStage("roommateProfileEdit")}   // NEW
            />

          );
        }
        break;
      }

      case "transfer":
        content = <LeaseTransfer />;
        break;

      case "profile":
        content = <Profile onEditProfile={() => setStage("profileEdit")} />;
        break;

      default:
        content = <HousingListings />;
    }
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.mainArea}>{content}</View>
      {stage === "main" && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainArea: {
    flex: 1,
  },
});
