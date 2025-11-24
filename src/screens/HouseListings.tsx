import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native"; // yarn add lucide-react-native
import { Button } from "../ui/Button"; // your RN Button
import { ListingCard } from "../ui/ListingCard";
import { ListingDetails } from "../ui/ListingDetails";
import { SafeAreaView } from "react-native-safe-area-context";


const mockListings = [
  {
    id: 1,
    image: require("../../assets/Innovation_Square.jpg"),
    title: "Spacious 2BR Near Campus",
    price: 1200,
    location: "0.5 mi from campus",
    bedrooms: 2,
    bathrooms: 1,
    availableDate: "Aug 2025",
    tags: ["Pet-friendly", "Parking"],
    contactName: "Sarah Johnson",
    contactPhone: "(585) 555-0123",
    contactWebsite: "https://www.example-property.com",
  },
  {
    id: 2,
    image:
     {uri: "https://images.unsplash.com/photo-1504390747618-f9ea2a96c487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZG9ybSUyMHJvb218ZW58MXx8fHwxNzU5OTQzMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    title: "Modern Studio Downtown",
    price: 850,
    location: "1.2 mi from campus",
    bedrooms: 1,
    bathrooms: 1,
    availableDate: "Sep 2025",
    tags: ["Utilities included"],
    contactName: "Michael Chen",
    contactPhone: "(585) 555-0456",
    contactWebsite: "https://www.downtown-studios.com",
  },
  {
    id: 3,
    image:
     {uri: "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwbGl2aW5nfGVufDF8fHx8MTc2MDAyNzQzOHww&ixlib=rb-4.1.0&q=80&w=1080"},
    title: "Shared House - 1 Room Available",
    price: 600,
    location: "0.8 mi from campus",
    bedrooms: 1,
    bathrooms: 1,
    availableDate: "Jan 2026",
    tags: ["Furnished"],
    contactName: "Emily Rodriguez",
    contactPhone: "(585) 555-0789",
    contactWebsite: "https://www.collegehouserentals.com",
  },
  {
    id: 4,
    image:
     {uri: "https://images.unsplash.com/photo-1603072388139-565853396b38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc2MDAyMzM2NXww&ixlib=rb-4.1.0&q=80&w=1080"},
    title: "3BR Apartment with Balcony",
    price: 1800,
    location: "0.3 mi from campus",
    bedrooms: 3,
    bathrooms: 2,
    availableDate: "Aug 2025",
    tags: ["Gym", "Pool"],
    contactName: "David Williams",
    contactPhone: "(585) 555-0321",
    contactWebsite: "https://www.luxurycampusapts.com",
  },
];

export function HousingListings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 2000]);
  const [bedroomFilter, setBedroomFilter] = useState<"any" | "1" | "2" | "3">("any");
  const [distanceFilter, setDistanceFilter] = useState<"any" | "0.5" | "1" | "2">("any");
  const [selectedListing, setSelectedListing] =
    useState<(typeof mockListings)[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const filteredListings = mockListings.filter((listing) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        listing.title.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query) ||
        listing.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (listing.price < priceRange[0] || listing.price > priceRange[1]) {
      return false;
    }

    // Bedroom filter
    if (bedroomFilter !== "any") {
      const minBedrooms = parseInt(bedroomFilter, 10);
      if (listing.bedrooms < minBedrooms) return false;
    }

    // Distance filter
    if (distanceFilter !== "any") {
      const maxDistance = parseFloat(distanceFilter);
      const listingDistance = parseFloat(listing.location.split(" ")[0]);
      if (listingDistance > maxDistance) return false;
    }

    return true;
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const handleApplyFilters = () => {
    setIsLoading(true);
    setIsFilterVisible(false);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleClearFilters = () => {
    setPriceRange([500, 2000]);
    setBedroomFilter("any");
    setDistanceFilter("any");
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  if (selectedListing) {
    return (
      <ListingDetails listing={selectedListing} onBack={() => setSelectedListing(null)} />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
    <View style={styles.container}>
      {/* Header + search */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Housing</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Search size={16} style={styles.searchIcon} />
            <TextInput
              placeholder="Search location, amenities..."
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
          </View>

          <Button
            variant="outline"
            size="icon"
            onPress={() => setIsFilterVisible(true)}
            style={styles.filterButton}
          >
            <SlidersHorizontal size={16} />
          </Button>
        </View>
      </View>

      {/* Filter modal */}
      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Filters</Text>
                <Text style={styles.modalSubtitle}>Refine your housing search</Text>
              </View>
              <Button variant="ghost" size="sm" onPress={handleClearFilters}>
                Clear All
              </Button>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.label}>Price Range</Text>
              <Text style={styles.labelHelp}>
                ${priceRange[0]} - ${priceRange[1]} per month
              </Text>
              <View style={styles.row}>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Min"
                  style={styles.numericInput}
                  value={String(priceRange[0])}
                  onChangeText={(val) =>
                    setPriceRange([
                      Number(val) || 0,
                      priceRange[1],
                    ])
                  }
                />
                <Text style={{ marginHorizontal: 8 }}>–</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Max"
                  style={styles.numericInput}
                  value={String(priceRange[1])}
                  onChangeText={(val) =>
                    setPriceRange([
                      priceRange[0],
                      Number(val) || 0,
                    ])
                  }
                />
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.label}>Bedrooms</Text>
              <View style={styles.chipRow}>
                {["any", "1", "2", "3"].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.chip,
                      bedroomFilter === value && styles.chipActive,
                    ]}
                    onPress={() =>
                      setBedroomFilter(value as "any" | "1" | "2" | "3")
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        bedroomFilter === value && styles.chipTextActive,
                      ]}
                    >
                      {value === "any" ? "Any" : `${value}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.label}>Distance from Campus</Text>
              <View style={styles.chipRow}>
                {[
                  { label: "Any", value: "any" },
                  { label: "Within 0.5 mi", value: "0.5" },
                  { label: "Within 1 mi", value: "1" },
                  { label: "Within 2 mi", value: "2" },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.chip,
                      distanceFilter === opt.value && styles.chipActive,
                    ]}
                    onPress={() =>
                      setDistanceFilter(opt.value as "any" | "0.5" | "1" | "2")
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        distanceFilter === opt.value && styles.chipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalFooterRow}>
              <Button
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
                onPress={() => setIsFilterVisible(false)}
              >
                Cancel
              </Button>
              <Button style={{ flex: 1 }} onPress={handleApplyFilters}>
                Apply Filters
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Listings */}
      <ScrollView contentContainerStyle={styles.listingsContainer}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" />
            <Text style={styles.loaderText}>Loading...</Text>
          </View>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
              onPress={() => setSelectedListing(listing)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No listings match your filters</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search criteria
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
  flex: 1,
  backgroundColor: "#F3F4F6", // same as your root background
  paddingTop: 8, // or 12/16 if you want more spacing
},
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchIcon: {
    marginRight: 6,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    marginLeft: 8,
  },
  listingsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  loaderText: {
    marginTop: 8,
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: "#4B5563",
    fontSize: 16,
  },
  emptySubtext: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  modalSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  labelHelp: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  numericInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  chipText: {
    fontSize: 13,
    color: "#4B5563",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  modalFooterRow: {
    flexDirection: "row",
    marginTop: 8,
  },
});
