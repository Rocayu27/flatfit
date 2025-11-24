// App.tsx

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import Homepage  from "./src/components/Homepage";
import { Login } from "./src/screens/Login";
import { HousingListings }  from "./src/screens/HouseListings";
import { RoommateSearch } from "./src/screens/RoommateSearch";
import { LeaseTransfer } from "./src/screens/LeaseTransfer/LeaseTransfer";
import { Profile } from "./src/screens/Profile";
import { BottomNav, TabId } from "./src/navigation/BottomNav";
import ProfileCreation from "./src/screens/ProfileCreation";

type Stage = "home" | "login" | "profileCreate" | "main";

export default function App() {
  const [stage, setStage] = useState<Stage>("home");
  const [activeTab, setActiveTab] = useState<TabId>("housing");

  let content: React.ReactNode = null;

  if (stage === "home") {
    content = (
      <Homepage
        onGetStarted={() => setStage("login")}
      />
    );
  } else if (stage === "login") {
    content = (
      <Login
        onLogin={() => setStage("profileCreate")}
      />
    );
  } else if (stage === "profileCreate") {
    content = (
      <ProfileCreation
        onSaveProfile={() => {
          // later: you could store this profile in state or AsyncStorage
          setStage("main");
          setActiveTab("housing"); // after profile, go to HousingListings tab
        }}
        onBackToLogin={() => setStage("login")}
      />
    );
  } else {
    // stage === "main": show tab content
    switch (activeTab) {
      case "housing":
        content = <HousingListings />;
        break;
      case "roommates":
        content = <RoommateSearch />;
        break;
      case "transfer":
        content = <LeaseTransfer />;
        break;
      case "profile":
        content = <Profile />;
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
