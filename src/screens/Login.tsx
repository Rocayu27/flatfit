// src/Login.tsx (React Native)

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../ui/Button";

interface LoginProps {
  onLogin: () => void;
  // optional logo so you can pass require("../../assets/ur-logo.png")
  logoSource?: ImageSourcePropType;
}

export function Login({ onLogin, logoSource }: LoginProps) {
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    // TODO: validate email / integrate auth
    onLogin();
  };

  const handleNetIDLogin = () => {
    // TODO: NetID SSO integration
    onLogin();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header with Logo and Title */}
        <View style={styles.header}>
          {logoSource && (
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <Text style={styles.appTitle}>FlatFit</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formWrapper}>
          <View style={styles.formCard}>
            {/* Copy */}
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Create an account</Text>
              <Text style={styles.formSubtitle}>
                Enter your college email to sign up for this app
              </Text>
            </View>

            {/* Input + Button */}
            <View style={styles.formBody}>
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="email@domain.com"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <Button onPress={handleContinue} style={styles.primaryButton}>
                Continue
              </Button>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* NetID Button */}
            <Button
              onPress={handleNetIDLogin}
              variant="outline"
              style={styles.netidButton}
            >
              Continue with NetID
            </Button>

            {/* Terms */}
            <Text style={styles.termsText}>
              By clicking continue, you agree to our{" "}
              <Text style={styles.linkText}>Terms of Service</Text> and{" "}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  root: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  formWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  formCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  formHeader: {
    marginBottom: 16,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  formBody: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    marginBottom: 10,
  },
  primaryButton: {
    width: "100%",
    height: 40,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: "#9CA3AF",
  },
  netidButton: {
    width: "100%",
    height: 40,
    marginBottom: 12,
  },
  termsText: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },
  linkText: {
    color: "#111827",
    fontWeight: "500",
  },
});
