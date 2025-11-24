// src/components/ListingCard.tsx

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MapPin, Bed, Bath } from "lucide-react-native";


interface ListingCardProps {
  image: any; // ImageSourcePropType
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  availableDate: string;
  tags?: string[];
  onPress?: () => void;
}

export function ListingCard({
  image,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  availableDate,
  tags = [],
  onPress,
}: ListingCardProps) {
  return (
     <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.row}>
          <MapPin size={14} color="#777" />
          <Text style={styles.location}>{location}</Text>
        </View>

        <View style={styles.row}>
          <Bed size={14} color="#777" />
          <Text style={styles.detail}>{bedrooms} bd</Text>

          <Bath size={14} color="#777" />
          <Text style={styles.detail}>{bathrooms} ba</Text>
        </View>

        <Text style={styles.price}>${price} / mo</Text>

        <View style={styles.tags}>
          {tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  location: {
    fontSize: 13,
    color: "#777",
  },
  detail: {
    fontSize: 13,
    color: "#777",
    marginLeft: 4,
    marginRight: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    gap: 6,
  },
  tag: {
    backgroundColor: "#EEF3FF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: "#3A5AE0",
  },
});
