// screens/QuizScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';

export default function QuizScreen({ navigation }: any) {
  const [sleep, setSleep] = useState(0.5);      // 0–1
  const [noise, setNoise] = useState(0.3);
  const [clean, setClean] = useState(0.7);
  const [guestsYes, setGuestsYes] = useState<boolean | null>(null);
  const [dealBreakers, setDealBreakers] = useState<string[]>([]);

  const toggleDealBreaker = (key: string) => {
    setDealBreakers((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key],
    );
  };

  const handleContinue = () => {
    // later: send answers to backend
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Roommate Compatibility</Text>
          <Text style={styles.subtitle}>
            We&apos;ll use this to rank matches.
          </Text>

          {/* Sleep */}
          <View style={styles.section}>
            <Text style={styles.labelRow}>
              <Text style={styles.label}>Sleep Schedule</Text>
              <Text style={styles.labelRight}>
                {/* simple mapping to text, you can tweak */}
                {sleep < 0.3
                  ? '9pm–12am'
                  : sleep < 0.7
                  ? '11pm–2am'
                  : '9pm–2am'}
              </Text>
            </Text>
            <Slider
              style={styles.slider}
              value={sleep}
              onValueChange={setSleep}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#4C6FFF"
              maximumTrackTintColor="#D0D4E3"
              thumbTintColor="#4C6FFF"
            />
            <Text style={styles.helperText}>
              Bedtime from 9pm–2am
            </Text>
          </View>

          {/* Noise */}
          <View style={styles.section}>
            <Text style={styles.labelRow}>
              <Text style={styles.label}>Noise Level</Text>
              <Text style={styles.labelRight}>
                {noise < 0.3
                  ? 'Very quiet'
                  : noise < 0.7
                  ? 'Quiet to moderate'
                  : 'Lively'}
              </Text>
            </Text>
            <Slider
              style={styles.slider}
              value={noise}
              onValueChange={setNoise}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#4C6FFF"
              maximumTrackTintColor="#D0D4E3"
              thumbTintColor="#4C6FFF"
            />
            <View style={styles.rangeRow}>
              <Text style={styles.rangeLabel}>Very quiet</Text>
              <Text style={styles.rangeLabel}>Loud</Text>
            </View>
          </View>

          {/* Cleanliness */}
          <View style={styles.section}>
            <Text style={styles.labelRow}>
              <Text style={styles.label}>Cleanliness</Text>
              <Text style={styles.labelRight}>Flexible</Text>
            </Text>
            <Slider
              style={styles.slider}
              value={clean}
              onValueChange={setClean}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#4C6FFF"
              maximumTrackTintColor="#D0D4E3"
              thumbTintColor="#4C6FFF"
            />
            <View style={styles.rangeRow}>
              <Text style={styles.rangeLabel}>Messy/disorganized</Text>
              <Text style={styles.rangeLabel}>Clean</Text>
            </View>
          </View>

          {/* Guests */}
          <View style={styles.section}>
            <Text style={styles.label}>Guests?</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.pillButton,
                  guestsYes === true && styles.pillButtonSelected,
                ]}
                onPress={() => setGuestsYes(true)}
              >
                <Text
                  style={[
                    styles.pillText,
                    guestsYes === true && styles.pillTextSelected,
                  ]}
                >
                  Yes!
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pillButton,
                  guestsYes === false && styles.pillButtonSelected,
                ]}
                onPress={() => setGuestsYes(false)}
              >
                <Text
                  style={[
                    styles.pillText,
                    guestsYes === false && styles.pillTextSelected,
                  ]}
                >
                  No…
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Deal-Breakers */}
          <View style={styles.section}>
            <Text style={styles.label}>Deal-Breakers?</Text>
            <View style={styles.rowWrap}>
              {['Smoking', 'Drinking', 'Overnight Guests'].map((db) => {
                const selected = dealBreakers.includes(db);
                return (
                  <TouchableOpacity
                    key={db}
                    style={[
                      styles.chip,
                      selected && styles.chipSelected,
                    ]}
                    onPress={() => toggleDealBreaker(db)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {db}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue to Matches</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E9F1FF',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDE3F4',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2430',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6A7084',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3F52',
    marginBottom: 4,
  },
  labelRight: {
    fontSize: 11,
    color: '#8A90A5',
  },
  slider: {
    width: '100%',
  },
  helperText: {
    fontSize: 11,
    color: '#8A90A5',
    marginTop: 4,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    fontSize: 11,
    color: '#8A90A5',
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  pillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D0D4E3',
    marginRight: 8,
  },
  pillButtonSelected: {
    backgroundColor: '#4C6FFF',
    borderColor: '#4C6FFF',
  },
  pillText: {
    fontSize: 13,
    color: '#4B5270',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D0D4E3',
    marginRight: 8,
    marginBottom: 6,
  },
  chipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4C6FFF',
  },
  chipText: {
    fontSize: 12,
    color: '#4B5270',
  },
  chipTextSelected: {
    color: '#4C6FFF',
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
