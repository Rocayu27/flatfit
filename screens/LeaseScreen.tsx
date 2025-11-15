// screens/LeaseScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LeaseScreen() {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Transfer Lease</Text>

        {/* search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#8A90A5" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transfers..."
            placeholderTextColor="#B0B5C8"
          />
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* info card */}
        <View style={styles.infoCard}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color="#4C6FFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.infoText}>
            Always verify lease terms with your landlord before transferring.
            Some leases may have restrictions.
          </Text>
        </View>

        {/* first listing card */}
        <View style={styles.listingCard}>
          <View style={styles.listingPhoto} />
          <Text style={styles.listingTitle}>
            Need to Transfer Lease – Study Abroad
          </Text>

          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={14}
              color="#4C6FFF"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.listingMeta}>0.4 mi from campus</Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="bed-outline"
              size={14}
              color="#8A90A5"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.listingMeta}>1 bed</Text>
            <View style={{ width: 12 }} />
            <Ionicons
              name="water-outline"
              size={14}
              color="#8A90A5"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.listingMeta}>1 bath</Text>
          </View>

          <Text style={styles.listingMeta}>Available Jan 2026</Text>

          <View style={styles.chipRow}>
            <View style={styles.listingChip}>
              <Text style={styles.chipText}>Urgent</Text>
            </View>
            <View style={styles.listingChip}>
              <Text style={styles.chipText}>Furnished</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.interestedButton}>
            <Text style={styles.interestedText}>I&apos;m interested</Text>
          </TouchableOpacity>
        </View>

        {/* second listing (simpler, just to show list) */}
        <View style={styles.listingCard}>
          <View style={styles.listingPhoto} />
          <Text style={styles.listingTitle}>
            Sublease Available – Graduating Early
          </Text>
          <Text style={styles.listingMeta}>2 bed · 1 bath · Available May 2025</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2430',
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#DDE3F4',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    color: '#1F2430',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4C6FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5270',
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDE3F4',
    marginBottom: 14,
  },
  listingPhoto: {
    height: 160,
    borderRadius: 16,
    backgroundColor: '#DDE3F4', // placeholder for real image
    marginBottom: 10,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2430',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  listingMeta: {
    fontSize: 12,
    color: '#6A7084',
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 10,
  },
  listingChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    marginRight: 6,
  },
  chipText: {
    fontSize: 11,
    color: '#4C6FFF',
    fontWeight: '500',
  },
  interestedButton: {
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  interestedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
