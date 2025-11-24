import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ImageProps,
  StyleProp,
  ImageStyle,
} from "react-native";

type ImageWithFallbackProps = {
  source: any;
  alt?: string;
  style?: StyleProp<ImageStyle>;
  fallbackText?: string;
} & Omit<ImageProps, "source">;

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  source,
  alt,
  style,
  fallbackText = "Image unavailable",
  ...rest
}) => {
  const [didError, setDidError] = useState(false);

  if (didError || !source) {
    return (
      <View style={styles.fallback} pointerEvents="none">
        <Text style={styles.fallbackText}>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <Image
      source={ source }
      style={style}
      onError={() => setDidError(true)}
      accessibilityLabel={alt}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
