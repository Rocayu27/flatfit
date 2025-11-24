// src/ui/avatar.tsx (React Native)

import React from "react";
import {
  View,
  ViewProps,
  Image,
  ImageProps,
  Text,
  TextProps,
  StyleSheet,
} from "react-native";

type AvatarProps = ViewProps & {
  size?: number; // optional: override default size
};

export const Avatar: React.FC<AvatarProps> = ({
  size = 40,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.root,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

type AvatarImageProps = Omit<ImageProps, "source"> & {
  src?: string; // keep web-like API: <AvatarImage src={avatar} />
};

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  style,
  ...props
}) => {
  if (!src) return null;

  // If src is a remote URL string
  const source =
    typeof src === "string"
      ? { uri: src }
      : (src as any); // in case you later pass require(...)

  return (
    <Image
      source={source}
      style={[styles.image, style]}
      resizeMode="cover"
      {...props}
    />
  );
};

type AvatarFallbackProps = TextProps & {
  children?: React.ReactNode;
};

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={styles.fallbackContainer}>
      <Text style={[styles.fallbackText, style]} {...props}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    backgroundColor: "#E5E7EB", // muted
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallbackContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },
});
