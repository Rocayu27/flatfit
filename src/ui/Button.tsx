// src/components/ui/button.tsx (React Native compatible)

import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
}

// Map variants to container + text styles
const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: "#2563EB" }, // primary
    text: { color: "#FFFFFF" },
  },
  destructive: {
    container: { backgroundColor: "#DC2626" },
    text: { color: "#FFFFFF" },
  },
  outline: {
    container: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB" },
    text: { color: "#111827" },
  },
  secondary: {
    container: { backgroundColor: "#E5E7EB" },
    text: { color: "#111827" },
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    text: { color: "#111827" },
  },
  link: {
    container: { backgroundColor: "transparent" },
    text: {
      color: "#2563EB",
      textDecorationLine: "underline",
      textDecorationColor: "#2563EB",
    },
  },
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  lg: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    paddingHorizontal: 0,
  },
};

// Helper roughly equivalent to original `buttonVariants`, now returning a style array
export const buttonVariants = ({
  variant = "default",
  size = "default",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} = {}): ViewStyle[] => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return [styles.base, v.container, s];
};

export const Button = React.forwardRef< React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  ({ variant = "default", size = "default", style, children, disabled, ...props }, ref) => {
    const v = variantStyles[variant];
    const s = sizeStyles[size];

    const containerStyles = [
      styles.base,
      v.container,
      s,
      disabled && styles.disabled,
      style as ViewStyle,
    ];

    // Convenience: if children is plain string, wrap in Text with button text styles
    const content =
      typeof children === "string" ? (
        <Text style={[styles.text, v.text]} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        children
      );

    return (
      <TouchableOpacity ref={ref} style={containerStyles} disabled={disabled} {...props}>
        <View style={styles.content}>{content}</View>
      </TouchableOpacity>
    );
  },
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, // requires RN 0.71+; if not available, replace with manual spacing
  } as ViewStyle,
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
});
