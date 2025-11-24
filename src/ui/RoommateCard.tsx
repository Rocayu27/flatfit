// src/components/RoommateCard.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  GraduationCap,
  Calendar,
  Home,
  Sparkles,
} from "lucide-react-native";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../ui/avatar";

interface RoommateCardProps {
  name: string;
  age: number;
  major: string;
  year: string;
  bio: string;
  lookingFor: string;
  moveInDate: string;
  budget: string;
  interests: string[];
  avatar?: string;
  matchScore?: number;
  onConnect?: () => void;
}

export function RoommateCard({
  name,
  age,
  major,
  year,
  bio,
  lookingFor,
  moveInDate,
  budget,
  interests,
  avatar,
  matchScore,
  onConnect,
}: RoommateCardProps) {
  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar size={64}>
          <AvatarImage src={avatar} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>
              {name}, {age}
            </Text>

            {matchScore ? (
              <Badge variant="secondary" style={styles.matchBadge}>
                <Sparkles size={12} />
                <Text style={styles.matchBadgeText}>{matchScore}% match</Text>
              </Badge>
            ) : null}
          </View>

          <View style={styles.majorRow}>
            <GraduationCap size={16} color="#6B7280" />
            <Text style={styles.majorText}>
              {major} • {year}
            </Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.bioText}>{bio}</Text>

      {/* Details */}
      <View style={styles.detailSection}>
        <View style={styles.detailRow}>
          <Home size={16} color="#6B7280" />
          <Text style={styles.detailLabel}>Looking for:</Text>
          <Text style={styles.detailValue}>{lookingFor}</Text>
        </View>

        <View style={styles.detailRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.detailLabel}>Move-in:</Text>
          <Text style={styles.detailValue}>{moveInDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Budget:</Text>
          <Text style={styles.detailValue}>{budget}</Text>
        </View>
      </View>

      {/* Interests */}
      <View style={styles.interestRow}>
        {interests.map((interest) => (
          <Badge key={interest} variant="outline" style={styles.interestBadge}>
            {interest}
          </Badge>
        ))}
      </View>

      <Button style={styles.connectButton} onPress={onConnect}>
        Connect
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  matchBadgeText: {
    marginLeft: 4,
    fontSize: 12,
  },
  majorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  majorText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },
  bioText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailLabel: {
    marginLeft: 6,
    color: "#6B7280",
    fontSize: 14,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
  },
  interestRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  interestBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  connectButton: {
    width: "100%",
    marginTop: 12,
  },
});
