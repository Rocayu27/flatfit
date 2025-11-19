// button.tsx (React Native)

import * as React from "react";
import {
  Pressable,
  PressableProps,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Button = React.forwardRef< React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      style,
      textStyle,
      children,
      ...props
    },
    ref,
  ) => {
    const containerStyle = [
      styles.base,
      sizeStyles[size],
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

      return children;
    };

    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          containerStyle,
          pressed && styles.pressed,
        ]}
        {...props}
      >
        {renderChildren()}
      </Pressable>
    );
  },
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    opacity: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  textBase: {
    fontSize: 14,
    fontWeight: "500",
  },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  default: {
    backgroundColor: "#000000",
  },
  destructive: {
    backgroundColor: "#EF4444",
  },
  outline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondary: {
    backgroundColor: "#E5E7EB",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  link: {
    backgroundColor: "transparent",
  },
};

const textVariantStyles: Record<ButtonVariant, TextStyle> = {
  default: {
    color: "#FFFFFF",
  },
  destructive: {
    color: "#FFFFFF",
  },
  outline: {
    color: "#111827",
  },
  secondary: {
    color: "#111827",
  },
  ghost: {
    color: "#111827",
  },
  link: {
    color: "#000000",
    textDecorationLine: "underline",
  },
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: {
    height: 36,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
  },
  lg: {
    height: 40,
    paddingHorizontal: 20,
  },
  icon: {
    width: 36,
    height: 36,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
};
