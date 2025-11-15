// screens/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [visible, setVisible] = React.useState(true);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* avatar + name */}
        <View style={styles.avatar} />
        <Text style={styles.name}>Alex Thompson</Text>
        <Text style={styles.email}>alex.thompson@rochester.edu</Text>

        {/* About Me card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Me</Text>

          <View style={styles.row}>
            <Ionicons
              name="school-outline"
              size={18}
              color="#4C6FFF"
              style={styles.icon}
            />
            <View style={styles.rowText}>
              <Text style={styles.label}>Major & Year</Text>
              <Text style={styles.value}>Computer Science • Junior</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#4C6FFF"
              style={styles.icon}
            />
            <View style={styles.rowText}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>21 years old</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="home-outline"
              size={18}
              color="#4C6FFF"
              style={styles.icon}
            />
            <View style={styles.rowText}>
              <Text style={styles.label}>Housing Preference</Text>
              <Text style={styles.value}>2B1B</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="cash-outline"
              size={18}
              color="#4C6FFF"
              style={styles.icon}
            />
            <View style={styles.rowText}>
              <Text style={styles.label}>Budget</Text>
              <Text style={styles.value}>$700–900/mo</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="pricetag-outline"
              size={18}
              color="#4C6FFF"
              style={styles.icon}
            />
            <View style={styles.rowText}>
              <Text style={styles.label}>Hobbies & Interests</Text>
              <View style={styles.chipRow}>
                {['Photography', 'Rock Climbing', 'Gaming', 'Cooking'].map(
                  (chip) => (
                    <View key={chip} style={styles.chip}>
                      <Text style={styles.chipText}>{chip}</Text>
                    </View>
                  ),
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Visibility card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.cardTitle}>
                Make my profile visible for finding roommates
              </Text>
              <Text style={styles.smallText}>
                Let others reach out if you&apos;re open to connecting.
              </Text>
            </View>
            <Switch value={visible} onValueChange={setVisible} />
          </View>
        </View>

        {/* Connection requests card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connection Requests</Text>
          <Text style={styles.smallText}>
            You have 3 pending connection requests.
          </Text>
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
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#DDE3F4', // placeholder for profile image
    marginTop: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2430',
  },
  email: {
    fontSize: 13,
    color: '#6A7084',
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E3E7F2',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2F3444',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#8A90A5',
  },
  value: {
    fontSize: 13,
    color: '#2F3444',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 11,
    color: '#4C6FFF',
    fontWeight: '500',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallText: {
    fontSize: 12,
    color: '#6A7084',
    marginTop: 4,
  },
});
