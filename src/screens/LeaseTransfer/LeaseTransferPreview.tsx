// src/screens/LeaseTransferPreview.tsx (React Native)

import {  SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import * as FileSystem from "expo-file-system/legacy";
import { decode as atob } from "base-64";


import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Bed,
  Bath,
  DollarSign,
} from "lucide-react-native";

import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { ImageWithFallback } from "../../ui/ImageWithFallback";
import { ConnectionSuccessDialog } from "../../ui/ConnectionSuccessDialog";

interface LeaseTransferPreviewProps {
  formData: {
    propertyName: string;
    address: string;
    rent: string;
    bedrooms: string;
    availableDate: string;
    reason: string;
    description: string;
    photo?: string;
  };
  onBack: () => void;
  onPost: () => void;
}

export function LeaseTransferPreview({
  formData,
  onBack,
  onPost,
}: LeaseTransferPreviewProps) {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const uploadImage = async (uri: string): Promise<string> => {
  // 1) Read the local file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    // newer TS types sometimes don’t expose EncodingType, so just use a string
    encoding: "base64" as any,
  });

  // 2) Convert base64 → Uint8Array (bytes)
  const bytes = base64ToUint8Array(base64);

  // 3) Build a file name/path
  const rawExt = uri.split(".").pop() || "jpg";
  const fileExt = rawExt.split("?")[0];
  const fileName = `lease-${Date.now()}.${fileExt}`;
  const filePath = `lease-transfers/${fileName}`;

  // 4) Upload bytes directly to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("lease-transfer-images") // 👈 your bucket name
    .upload(filePath, bytes, {
      contentType: `image/${fileExt}`,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw uploadError;
  }

  // 5) Get a public URL
  const { data } = supabase.storage
    .from("lease-transfer-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

const handlePost = async () => {
  let photoUrl: string | null = null;

  if (formData.photo) {
    if (formData.photo.startsWith("file:")) {
      try {
        photoUrl = await uploadImage(formData.photo);
      } catch (e) {
        console.error(
          "Image upload failed, continuing without photo:",
          e,
        );
        photoUrl = null;
      }
    } else {
      // already a URL
      photoUrl = formData.photo;
    }
  }

  const { error } = await supabase.from("lease_transfers").insert({
    property_name: formData.propertyName,
    address: formData.address,
    rent: Number(formData.rent),
    bedrooms: Number(formData.bedrooms),
    available_date: formData.availableDate,
    reason: formData.reason,
    description: formData.description,
    photo_url: photoUrl,
  });

  if (error) {
    console.error("Error inserting lease transfer:", error);
    return;
  }

  setShowSuccessDialog(true);
};



const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      "study-abroad": "Study Abroad",
      graduating: "Graduating Early",
      internship: "Internship/Co-op",
      transfer: "Transferring Schools",
      other: "Other",
    };
    return labels[reason] || reason;
  };

  const displayImage =
    formData.photo ||
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&w=1080";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
            >
              <ArrowLeft size={20} color="#111827" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Preview Post</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Image */}
          <View style={styles.imageWrapper}>
            <ImageWithFallback
              source={displayImage}
              style={styles.image}
            />
            {!formData.photo && (
              <View style={styles.placeholderBadge}>
                <Text style={styles.placeholderBadgeText}>
                  Placeholder Image
                </Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title + price */}
            <View>
              <Text style={styles.title}>{formData.propertyName}</Text>
              <View style={styles.priceRow}>
                <DollarSign size={20} color="#4338CA" />
                <Text style={styles.priceText}>
                  ${formData.rent}/month
                </Text>
              </View>
            </View>

            {/* Reason */}
            <Badge variant="secondary">
              <Text style={styles.reasonBadgeText}>
                {getReasonLabel(formData.reason)}
              </Text>
            </Badge>

            {/* Key details */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Bed size={20} color="#6B7280" />
                <Text style={styles.detailText}>
                  {formData.bedrooms} Bedroom
                  {formData.bedrooms !== "1" ? "s" : ""}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.detailText}>
                  {formData.availableDate
                    ? new Date(formData.availableDate).toLocaleDateString()
                    : ""}
                </Text>
              </View>
              <View style={[styles.detailRow, { width: "100%" }]}>
                <MapPin size={20} color="#6B7280" />
                <Text style={styles.detailText}>{formData.address}</Text>
              </View>
            </View>

            {/* Description */}
            <View>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionBody}>
                {formData.description}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <View style={styles.bottomBar}>
          <Button onPress={handlePost}>Post Transfer</Button>
          <View style={{ height: 8 }} />
          <Button variant="outline" onPress={onBack}>
            Edit
          </Button>
        </View>

        <ConnectionSuccessDialog
          open={showSuccessDialog}
          onOpenChange={(open) => {
            setShowSuccessDialog(open);
            if (!open) {
              onPost();
            }
          }}
          message="Your lease transfer has been posted!"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backText: { fontSize: 14, color: "#111827" },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  scrollContent: { paddingBottom: 120 },
  imageWrapper: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#e5e7eb",
  },
  image: { width: "100%", height: "100%" },
  placeholderBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  placeholderBadgeText: {
    color: "#ffffff",
    fontSize: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: { fontSize: 16, color: "#4338CA", fontWeight: "600" },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionBody: { fontSize: 14, color: "#4B5563" },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
});
