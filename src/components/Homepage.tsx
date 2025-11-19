// src/Homepage.tsx


import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// put your logo file at assets/ur-logo.png (or change the path)
// const urLogo = require("../assets/ur-logo.png");

type HomepageProps = {
  onGetStarted: () => void;
};

const Homepage: React.FC<HomepageProps> = ({ onGetStarted }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroWrapper}>
          <View style={styles.heroInner}>
            {/* <Image source={urLogo} style={styles.logo} resizeMode="contain" /> */}

            <View style={styles.heroTextBlock}>
              <Text style={styles.appTitle}>FlatFit</Text>
              <Text style={styles.appSubtitle}>
                Your all-in-one housing solution for college students
              </Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What We Offer</Text>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIconText}>🏠</Text>
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Find Housing</Text>
              <Text style={styles.cardSubtitle}>
                Browse verified off-campus apartments near campus
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIconText}>👥</Text>
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Match with Roommates</Text>
              <Text style={styles.cardSubtitle}>
                Connect with compatible students looking to share housing
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIconText}>🔁</Text>
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Transfer Your Lease</Text>
              <Text style={styles.cardSubtitle}>
                Graduating or studying abroad? Transfer your lease seamlessly
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made for college students</Text>
        </View>
      </ScrollView>
    </SafeAreaView>  
    );
};

export default Homepage;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
    paddingBottom: 40,
  },
  heroWrapper: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: "#f3f4ff",
  },
  heroInner: {
    alignItems: "center",
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  heroTextBlock: {
    alignItems: "center",
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#111827",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardIconText: {
    fontSize: 22,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#9ca3af",
  },
});
