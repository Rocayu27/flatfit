// src/components/ListingDetails.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Bed,
  Bath,
  DollarSign,
} from "lucide-react-native";
import { Badge } from "../ui/Badge";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ListingDetailsProps {
  listing: {
    id: number;
    image: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    availableDate: string;
    tags: string[];
    description?: string;
    contactName?: string;
    contactPhone?: string;
    contactWebsite?: string;
  };
  onBack: () => void;
}

export function ListingDetails({ listing, onBack }: ListingDetailsProps) {
  const handleCall = () => {
    if (listing.contactPhone) {
      Linking.openURL(`tel:${listing.contactPhone}`);
    }
  };

  const handleOpenWebsite = () => {
    if (listing.contactWebsite) {
      Linking.openURL(listing.contactWebsite);
    }
  };

  const descriptionText =
    listing.description ||
    "This beautiful property is located near the University of Rochester campus, offering convenient access to classes and campus amenities. The space features modern appliances, plenty of natural light, and is perfect for students looking for comfortable off-campus housing.";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <ImageWithFallback
            source={listing.image}
            style={styles.image}
          />
        </View>

        {/* Main body */}
        <View style={styles.body}>
          {/* Title + Price */}
          <View style={styles.section}>
            <Text style={styles.title}>{listing.title}</Text>
            <View style={styles.row}>
              <DollarSign size={20} style={styles.primaryIcon} />
              <Text style={styles.priceText}>${listing.price}/month</Text>
            </View>
          </View>

          {/* Key Details */}
          <View style={[styles.section, styles.grid]}>
            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Bed size={18} style={styles.mutedIcon} />
                <Text style={styles.detailText}>
                  {listing.bedrooms} Bedroom
                  {listing.bedrooms > 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Bath size={18} style={styles.mutedIcon} />
                <Text style={styles.detailText}>
                  {listing.bathrooms} Bathroom
                  {listing.bathrooms > 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            <View style={styles.gridItem}>
              <View style={styles.row}>
                <MapPin size={18} style={styles.mutedIcon} />
                <Text style={styles.detailText}>{listing.location}</Text>
              </View>
            </View>

            <View style={styles.gridItem}>
              <View style={styles.row}>
                <Calendar size={18} style={styles.mutedIcon} />
                <Text style={styles.detailText}>{listing.availableDate}</Text>
              </View>
            </View>
          </View>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <View style={[styles.section, styles.tagsContainer]}>
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="secondary" style={styles.tagBadge}>
                  {tag}
                </Badge>
              ))}
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this property</Text>
            <Text style={styles.paragraph}>{descriptionText}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              <Text style={styles.paragraph}>• WiFi included</Text>
              <Text style={styles.paragraph}>• Laundry in building</Text>
              <Text style={styles.paragraph}>• Close to public transportation</Text>
              <Text style={styles.paragraph}>• Heat and hot water included</Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={[styles.section, styles.contactSection]}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.contactBlock}>
              {listing.contactName && (
                <Text style={styles.paragraph}>
                  <Text style={styles.bold}>Contact: </Text>
                  {listing.contactName}
                </Text>
              )}

              {listing.contactPhone && (
                <View style={styles.row}>
                  <Text style={[styles.paragraph, styles.bold]}>Phone: </Text>
                  <TouchableOpacity onPress={handleCall}>
                    <Text style={styles.linkText}>{listing.contactPhone}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {listing.contactWebsite && (
                <View style={styles.rowWrap}>
                  <Text style={[styles.paragraph, styles.bold]}>Website: </Text>
                  <TouchableOpacity onPress={handleOpenWebsite}>
                    <Text style={[styles.linkText, styles.wrapText]}>
                      {listing.contactWebsite}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.noteText}>
                Contact {listing.contactName || "the landlord"} if you're interested!
                {" "}
                or access{" "}
                {listing.contactWebsite ? "the website" : "their contact information"}{" "}
                to check for more information.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({

safeArea: {
  flex: 1,
  backgroundColor: "#ffffff", // same as your root background
  paddingTop: 8, // or 12/16 if you want more spacing
},
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    marginRight: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#F3F4F6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  primaryIcon: {
    color: "#2563EB",
    marginRight: 4,
  },
  mutedIcon: {
    color: "#6B7280",
    marginRight: 6,
  },
  priceText: {
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagBadge: {
    marginRight: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  amenitiesList: {
    gap: 4,
  },
  contactSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
    marginTop: 8,
  },
  contactBlock: {
    gap: 6,
  },
  bold: {
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    color: "#2563EB",
    textDecorationLine: "underline",
  },
  wrapText: {
    flexShrink: 1,
  },
  noteText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#6B7280",
    marginTop: 8,
  },
});
