// screens/RoommatesScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RoommatesScreen() {
  const [showHelp, setShowHelp] = useState(true);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Roommate Search</Text>
        <Text style={styles.subheader}>
          We’ll use your compatibility quiz to surface compatible UR students.
        </Text>

        {/* main roommate card */}
        <View style={styles.card}>
          <View style={styles.photo} />
          <Text style={styles.name}>David Corenswet, ’26</Text>
          <Text style={styles.meta}>
            Computer Science · 2B1B near River Campus
          </Text>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Night Owl</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Very Tidy</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>No Smoking</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Cleanliness Habits</Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              I am a very organized and clean person!
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Photos</Text>
          <View style={styles.photoRow}>
            <View style={styles.smallPhoto} />
            <View style={styles.smallPhoto} />
            <View style={styles.smallPhoto} />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={() => {}}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => {}}
            >
              <Text style={styles.likeText}>Send Like</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.helperText}>
          Swiping and double-tap gestures will be added once backend and
          gestures are wired up.
        </Text>
      </ScrollView>

      {/* overlay help modal like in your Figma screenshot */}
      {showHelp && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>How to Use Roommate Search</Text>
              <TouchableOpacity onPress={() => setShowHelp(false)}>
                <Ionicons name="close" size={18} color="#8A90A5" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalLine}>
              <Ionicons
                name="swap-horizontal"
                size={20}
                color="#FDB632"
                style={styles.modalIcon}
              />
              <View style={styles.modalTextBlock}>
                <Text style={styles.modalItemTitle}>Swipe Left/Right</Text>
                <Text style={styles.modalItemBody}>
                  Navigate between different roommate profiles.
                </Text>
              </View>
            </View>

            <View style={styles.modalLine}>
              <Ionicons
                name="heart"
                size={20}
                color="#FDB632"
                style={styles.modalIcon}
              />
              <View style={styles.modalTextBlock}>
                <Text style={styles.modalItemTitle}>Double Tap</Text>
                <Text style={styles.modalItemBody}>
                  Like a profile to send a connection request.
                </Text>
              </View>
            </View>

            <View style={styles.modalLine}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#4C6FFF"
                style={styles.modalIcon}
              />
              <View style={styles.modalTextBlock}>
                <Text style={styles.modalItemTitle}>Check Messages</Text>
                <Text style={styles.modalItemBody}>
                  After sending a like, check your messages for responses.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2430',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 13,
    color: '#6A7084',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3E7F2',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  photo: {
    height: 200,
    borderRadius: 18,
    backgroundColor: '#DDE3F4', // placeholder for roommate image
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2430',
  },
  meta: {
    fontSize: 13,
    color: '#6A7084',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#4C6FFF',
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3F52',
    marginBottom: 4,
  },
  pill: {
    backgroundColor: '#F4F6FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  pillText: {
    fontSize: 12,
    color: '#4B5270',
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  smallPhoto: {
    width: '31%',
    height: 70,
    borderRadius: 12,
    backgroundColor: '#DDE3F4',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#D0D4E3',
    marginRight: 8,
  },
  likeButton: {
    backgroundColor: '#4C6FFF',
    marginLeft: 8,
  },
  skipText: {
    color: '#6A7084',
    fontWeight: '500',
  },
  likeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  helperText: {
    fontSize: 11,
    color: '#8A90A5',
    marginTop: 10,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2430',
  },
  modalLine: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  modalTextBlock: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2430',
  },
  modalItemBody: {
    fontSize: 12,
    color: '#6A7084',
  },
  modalButton: {
    marginTop: 18,
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
