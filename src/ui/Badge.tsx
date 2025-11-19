// badge.tsx (React Native)

import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({
  children,
  variant = "default",
  style,
  textStyle,
}: BadgeProps) {
  const containerStyle = [
    styles.base,
    variantStyles[variant],
    style,
  ] as StyleProp<ViewStyle>;

  const textStyles = [
    styles.textBase,
    textVariantStyles[variant],
    textStyle,
  ] as StyleProp<TextStyle>;

  const renderChildren = () => {
    if (
      typeof children === "string" ||
      typeof children === "number"
    ) {
      return <Text style={textStyles}>{children}</Text>;
    }

    // If you pass your own <Text> / icons, they will use their own styles.
    return children;
  };

  return <View style={containerStyle}>{renderChildren()}</View>;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    gap: 4,
  },
  textBase: {
    fontSize: 12,
    fontWeight: "500",
  },
});

const variantStyles: Record<BadgeVariant, ViewStyle> = {
  default: {
    borderColor: "transparent",
    backgroundColor: "#000000", // primary
  },
  secondary: {
    borderColor: "transparent",
    backgroundColor: "#E5E7EB", // secondary-ish
  },
  destructive: {
    borderColor: "transparent",
    backgroundColor: "#EF4444",
  },
  outline: {
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
  },
};

const textVariantStyles: Record<BadgeVariant, TextStyle> = {
  default: {
    color: "#FFFFFF",
  },
  secondary: {
    color: "#111827",
  },
  destructive: {
    color: "#FFFFFF",
  },
  outline: {
    color: "#111827",
  },
};
