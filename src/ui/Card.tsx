// src/ui/card.tsx (React Native)

import React from "react";
import {
  View,
  ViewProps,
  Text,
  TextProps,
  StyleSheet,
  ViewStyle,
} from "react-native";

type CardProps = ViewProps;

export const Card: React.FC<CardProps> = ({ style, children, ...props }) => {
  return (
    <View style={[styles.card, style as ViewStyle]} {...props}>
      {children}
    </View>
  );
};

type CardSectionProps = ViewProps;

export const CardHeader: React.FC<CardSectionProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={[styles.cardHeader, style as ViewStyle]} {...props}>
      {children}
    </View>
  );
};

export const CardContent: React.FC<CardSectionProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={[styles.cardContent, style as ViewStyle]} {...props}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardSectionProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={[styles.cardFooter, style as ViewStyle]} {...props}>
      {children}
    </View>
  );
};

type CardTitleProps = TextProps;
type CardDescriptionProps = TextProps;

export const CardTitle: React.FC<CardTitleProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <Text style={[styles.cardTitle, style]} {...props}>
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<CardDescriptionProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <Text style={[styles.cardDescription, style]} {...props}>
      {children}
    </Text>
  );
};

// Optional, if you ever use it:
export const CardAction: React.FC<CardSectionProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={[styles.cardAction, style as ViewStyle]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardContent: {
    marginBottom: 8,
  },
  cardFooter: {
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  cardAction: {
    alignSelf: "flex-end",
  },
});
