// src/components/BottomNav.tsx (React Native)

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import {
  Home,
  Users,
  ArrowLeftRight,
  User as UserIcon,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type TabId = "housing" | "roommates" | "transfer" | "profile";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  style?: ViewStyle;
}

export function BottomNav({ activeTab, onTabChange, style }: BottomNavProps) {
  const tabs: { id: TabId; label: string; Icon: any }[] = [
    { id: "housing", label: "Housing", Icon: Home },
    { id: "roommates", label: "Roommates", Icon: Users },
    { id: "transfer", label: "Transfer", Icon: ArrowLeftRight },
    { id: "profile", label: "Profile", Icon: UserIcon },
  ];

  return (
    <SafeAreaView style={[styles.container, style]} edges={["bottom"]}>
      <View style={styles.inner}>
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <TouchableOpacity
              key={id}
              onPress={() => onTabChange(id)}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <Icon
                size={22}
                color={isActive ? "#2563EB" : "#9CA3AF"}
                // optional fill on active
                // @ts-ignore
                fill={isActive ? "#2563EB" : "none"}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  inner: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 480,
    alignSelf: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    color: "#9CA3AF",
  },
  tabLabelActive: {
    color: "#2563EB",
    fontWeight: "500",
  },
});
