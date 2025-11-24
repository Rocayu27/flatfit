// src/components/ui/badge.tsx (React Native compatible)

import React from "react";
import { View, ViewProps, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children?: React.ReactNode;
}

// Map variants to container + text styles
const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: "#2563EB", borderColor: "transparent" },
    text: { color: "#FFFFFF" },
  },
  secondary: {
    container: { backgroundColor: "#E5E7EB", borderColor: "transparent" },
    text: { color: "#111827" },
  },
  destructive: {
    container: { backgroundColor: "#DC2626", borderColor: "transparent" },
    text: { color: "#FFFFFF" },
  },
  outline: {
    container: { backgroundColor: "transparent", borderColor: "#E5E7EB" },
    text: { color: "#111827" },
  },
};

// Helper similar to original `badgeVariants`, now returning a style array
export const badgeVariants = ({
  variant = "default",
}: {
  variant?: BadgeVariant;
} = {}): ViewStyle[] => {
  const v = variantStyles[variant];
  return [styles.base, v.container];
};

export function Badge({ variant = "default", style, children, ...props }: BadgeProps) {
  const v = variantStyles[variant];

  // If you often pass plain strings, this convenience wrapper helps
  const content =
    typeof children === "string" ? (
      <Text style={[styles.text, v.text]} numberOfLines={1}>
        {children}
      </Text>
    ) : (
      children
    );

  return (
    <View style={[styles.base, v.container, style as ViewStyle]} {...props}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
});
