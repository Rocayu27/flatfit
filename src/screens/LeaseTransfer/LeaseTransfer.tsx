// src/screens/LeaseTransfer.tsx (React Native version)

import React, { useState, useEffect } from "react";
import {  SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Search,
  Plus,
  AlertCircle,
  Upload,
  X,
} from "lucide-react-native"; // yarn add lucide-react-native

import { LeaseTransferDetails } from "./LeaseTransferDetails";
import { LeaseTransferPreview } from "./LeaseTransferPreview";


type LeaseTransferListing = {
  id: number;
  image: { uri: string };
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  availableDate: string;
  tags: string[];
  reason: string;
  description: string;
};

type FormData = {
  propertyName: string;
  address: string;
  rent: string;
  bedrooms: string;
  availableDate: string;
  reason: string;
  description: string;
  photo?: string;
};

export function LeaseTransfer() {
  const [transfers, setTransfers] = useState<LeaseTransferListing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedListing, setSelectedListing] =
    useState<LeaseTransferListing | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadTransfers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("lease_transfers")
      .select(
        "id, property_name, address, rent, bedrooms, available_date, reason, description, photo_url"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading lease transfers:", error);
      setIsLoading(false);
      return;
    }

    const mapped: LeaseTransferListing[] = (data ?? []).map((row: any) => ({
      id: Number(row.id),
      image: {
        uri:
          row.photo_url ||
          "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&w=1080",
      },
      title: row.property_name ?? "Lease transfer",
      price: Number(row.rent ?? 0),
      location: row.address ?? "Near campus",
      bedrooms: Number(row.bedrooms ?? 1),
      bathrooms: 1,
      availableDate: row.available_date
        ? new Date(row.available_date).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "",
      tags: [],
      reason: row.reason ?? "",
      description: row.description ?? "",
    }));

    setTransfers(mapped);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your photos to upload an image.");
      return;
    }

    // Open the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setUploadedPhoto(uri);
      setFormData((prev) => ({ ...prev, photo: uri }));
    }
  };

  const [formData, setFormData] = useState<FormData>({
    propertyName: "",
    address: "",
    rent: "",
    bedrooms: "",
    availableDate: "",
    reason: "",
    description: "",
    photo: undefined,
  });
  

  const handlePreview = () => {
    // simple required-field validation
    if (
      !formData.propertyName ||
      !formData.address ||
      !formData.rent ||
      !formData.bedrooms ||
      !formData.availableDate ||
      !formData.reason ||
      !formData.description
    ) {
      Alert.alert("Missing fields", "Please fill in all required fields.");
      return;
    }
    setIsDialogOpen(false);
    setShowPreview(true);
  };

  const handlePost = () => {
  setShowPreview(false);
  setIsDialogOpen(false);

  setFormData({
    propertyName: "",
    address: "",
    rent: "",
    bedrooms: "",
    availableDate: "",
    reason: "",
    description: "",
  });
  setUploadedPhoto(null);

  loadTransfers();
};


  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const filteredTransfers = transfers.filter((transfer) => {
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    return (
      transfer.title.toLowerCase().includes(query) ||
      transfer.location.toLowerCase().includes(query) ||
      transfer.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }
  return true;
});


  if (showPreview) {
    return (
      <LeaseTransferPreview
        formData={{ ...formData, photo: uploadedPhoto || undefined }}
        onBack={() => {
          setShowPreview(false);
          setIsDialogOpen(true);
        }}
        onPost={handlePost}
      />
    );
  }

  if (selectedListing) {
    return (
      <LeaseTransferDetails
        listing={selectedListing}
        onBack={() => setSelectedListing(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header + search */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transfer Lease</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <Search
                size={16}
                color="#9CA3AF"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search transfers..."
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchInput}
              />
            </View>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setIsDialogOpen(true)}
            >
              <Plus size={20} color="#111827" />
            </TouchableOpacity>

          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Alert */}
          <View style={styles.alertBox}>
            <AlertCircle size={16} color="#4338CA" />
            <Text style={styles.alertText}>
              Always verify lease terms with your landlord before transferring.
              Some leases may have restrictions.
            </Text>
          </View>

          {/* List */}
          <View style={styles.listSection}>
            {isLoading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : filteredTransfers.length > 0 ? (
              filteredTransfers.map((transfer) => (
                <TouchableOpacity
                  key={transfer.id}
                  onPress={() => setSelectedListing(transfer)}
                  style={styles.listCard}
                >
                  <Image
                    source={ transfer.image }
                    style={styles.cardImage}
                  />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{transfer.title}</Text>
                    <Text style={styles.cardSubtitle}>{transfer.location}</Text>
                    <Text style={styles.cardPrice}>
                      ${transfer.price}/month
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No transfers match your search
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Simple "Dialog" replacement when posting lease */}
        {isDialogOpen && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Post Lease Transfer</Text>
              <Text style={styles.modalSubtitle}>
                List your lease for transfer or sublease
              </Text>

              <ScrollView
                style={styles.modalForm}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.label}>
                  Property Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  placeholder="e.g., The Venue Apartments"
                  style={styles.input}
                  value={formData.propertyName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, propertyName: text })
                  }
                />

                <Text style={styles.label}>
                  Property Address <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  placeholder="123 College Ave"
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                />

                <View style={styles.row}>
                  <View style={styles.rowItem}>
                    <Text style={styles.label}>
                      Monthly Rent <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <TextInput
                      placeholder="800"
                      keyboardType="numeric"
                      style={styles.input}
                      value={formData.rent}
                      onChangeText={(text) =>
                        setFormData({ ...formData, rent: text })
                      }
                    />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.label}>
                      Bedrooms <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <TextInput
                      placeholder="1"
                      style={styles.input}
                      value={formData.bedrooms}
                      onChangeText={(text) =>
                        setFormData({ ...formData, bedrooms: text })
                      }
                    />
                  </View>
                </View>

                <Text style={styles.label}>
                  Available Date <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  placeholder="YYYY-MM-DD"
                  style={styles.input}
                  value={formData.availableDate}
                  onChangeText={(text) =>
                    setFormData({ ...formData, availableDate: text })
                  }
                />

                <Text style={styles.label}>
                  Reason for Transfer <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  placeholder="Study abroad, internship, etc."
                  style={styles.input}
                  value={formData.reason}
                  onChangeText={(text) =>
                    setFormData({ ...formData, reason: text })
                  }
                />

                <Text style={styles.label}>
                  Description <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  placeholder="Tell potential tenants about your place..."
                  style={[styles.input, styles.textarea]}
                  multiline
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                />

                <Text style={styles.label}>Upload Photo (Optional)</Text>
                {uploadedPhoto ? (
                  <View style={styles.photoWrapper}>
                    <Image
                      source={{ uri: uploadedPhoto }}
                      style={styles.photo}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setUploadedPhoto(null);
                        setFormData((prev) => ({ ...prev, photo: undefined }));
                      }}
                      style={styles.photoCloseBtn}
                    >
                      <X size={16} color="#fff" />
                    </TouchableOpacity>

                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadPlaceholder}
                    onPress={pickImage}   
                  >
                    <Upload size={24} color="#9CA3AF" />
                    <Text style={styles.uploadText}>
                      Tap to upload a photo
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonOutline]}
                  onPress={() => setIsDialogOpen(false)}
                >
                  <Text style={styles.modalButtonOutlineText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handlePreview}
                >
                  <Text style={styles.modalButtonPrimaryText}>
                    Preview Your Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff", paddingTop: 8},
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  searchInputWrapper: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  searchIcon: { position: "absolute", left: 10 },
  searchInput: {
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingLeft: 32,
    paddingRight: 12,
    fontSize: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#EEF2FF",
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: "#4B5563",
  },
  listSection: { gap: 12 },
  loadingWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 8,
  },
  loadingText: { color: "#6B7280" },
  listCard: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  cardImage: { width: 110, height: 90 },
  cardBody: { flex: 1, padding: 8, justifyContent: "center" },
  cardTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: "#6B7280" },
  cardPrice: { marginTop: 4, fontSize: 13, fontWeight: "600" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: { color: "#9CA3AF" },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "90%",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "600" },
  modalSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  modalForm: { marginTop: 12 },
  label: { fontSize: 13, fontWeight: "500", marginTop: 12 },
  requiredStar: { color: "#DC2626" },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },
  rowItem: { flex: 1 },
  photoWrapper: { marginTop: 8, position: "relative" },
  photo: {
    width: "100%",
    height: 140,
    borderRadius: 8,
  },
  photoCloseBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#DC2626",
    borderRadius: 999,
    padding: 4,
  },
  uploadPlaceholder: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 8,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  uploadText: { fontSize: 12, color: "#6B7280" },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonOutline: {
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  modalButtonOutlineText: { fontSize: 14, color: "#111827" },
  modalButtonPrimary: {
    backgroundColor: "#111827",
  },
  modalButtonPrimaryText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
});
