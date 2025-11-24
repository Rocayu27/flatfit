// src/screens/LeaseTransferDetails.tsx (React Native)

import {  SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Bed,
  Bath,
  DollarSign,
} from "lucide-react-native";

import { Badge } from "../../ui/Badge"; 
import { Button } from "../../ui/Button"; 
import { ImageWithFallback } from "../../ui/ImageWithFallback";
import { ConnectionSuccessDialog } from "../../ui/ConnectionSuccessDialog";
import { ImageSourcePropType } from "react-native";

type Listing = {
  id: number;
  image: ImageSourcePropType;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  availableDate: string;
  tags: string[];
  description?: string;
  reason?: string;
};

interface LeaseTransferDetailsProps {
  listing: Listing;
  onBack: () => void;
}

export function LeaseTransferDetails({
  listing,
  onBack,
}: LeaseTransferDetailsProps) {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleInterested = () => {
    setShowSuccessDialog(true);
  };

  const getReasonLabel = (reason?: string | null) => {
    if (!reason) return null;
    const labels: Record<string, string> = {
      "study-abroad": "Study Abroad",
      graduating: "Graduating Early",
      internship: "Internship/Co-op",
      transfer: "Transferring Schools",
      other: "Other",
    };
    return labels[reason] || reason;
  };

  const reasonLabel = getReasonLabel(listing.reason);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#111827" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image */}
          <View style={styles.imageWrapper}>
            <ImageWithFallback
              source={listing.image}
              style={styles.image}
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title + price */}
            <View>
              <Text style={styles.title}>{listing.title}</Text>
              <View style={styles.priceRow}>
                <DollarSign size={20} color="#4338CA" />
                <Text style={styles.priceText}>
                  ${listing.price}/month
                </Text>
              </View>
            </View>

            {/* Reason badge */}
            {reasonLabel && (
              <View style={styles.badgeWrapper}>
                <Badge variant="secondary">
                  <Text style={styles.reasonBadgeText}>{reasonLabel}</Text>
                </Badge>
              </View>
            )}

            {/* Key details */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Bed size={20} color="#6B7280" />
                <Text style={styles.detailText}>
                  {listing.bedrooms} Bedroom
                  {listing.bedrooms > 1 ? "s" : ""}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Bath size={20} color="#6B7280" />
                <Text style={styles.detailText}>
                  {listing.bathrooms} Bathroom
                  {listing.bathrooms > 1 ? "s" : ""}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={20} color="#6B7280" />
                <Text style={styles.detailText}>{listing.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.detailText}>
                  {listing.availableDate}
                </Text>
              </View>
            </View>

            {/* Tags */}
            {listing.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {listing.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Text style={styles.tagText}>{tag}</Text>
                  </Badge>
                ))}
              </View>
            )}

            {/* Description */}
            <View>
              <Text style={styles.sectionTitle}>
                About this lease transfer
              </Text>
              <Text style={styles.sectionBody}>
                {listing.description ||
                  "This lease transfer is from a current tenant looking for someone to take over their lease. The property is well-maintained and conveniently located near campus. Contact the current tenant for more details about the property and lease terms."}
              </Text>
            </View>

            {/* Additional info */}
            <View>
              <Text style={styles.sectionTitle}>What to know</Text>
              <View style={styles.bullets}>
                <Text style={styles.bulletText}>
                  • Landlord approval required for lease transfer
                </Text>
                <Text style={styles.bulletText}>
                  • Security deposit may be transferable
                </Text>
                <Text style={styles.bulletText}>
                  • Current tenant will provide lease details
                </Text>
                <Text style={styles.bulletText}>
                  • Viewing available by appointment
                </Text>
              </View>
            </View>

            {/* Interested button */}
            <View style={styles.interestedSection}>
              <Button onPress={handleInterested}>
                I&apos;m Interested
              </Button>
            </View>
          </View>
        </ScrollView>

        <ConnectionSuccessDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          message="Your connection request has been sent! Check your messages for responses."
        />
      </View>
    </SafeAreaView>
  );
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 0;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff"},
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backText: { fontSize: 14, color: "#111827" },
  scrollContent: { paddingBottom: 24 },
  imageWrapper: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: { fontSize: 16, color: "#4338CA", fontWeight: "600" },
  badgeWrapper: { marginTop: 4 },
  reasonBadgeText: {
    fontSize: 12,
    color: "#9A3412",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "48%",
  },
  detailText: { fontSize: 14, color: "#111827" },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagText: { fontSize: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionBody: { fontSize: 14, color: "#4B5563" },
  bullets: { marginTop: 4, gap: 2 },
  bulletText: { fontSize: 14, color: "#6B7280" },
  interestedSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
});
