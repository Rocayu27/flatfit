import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const handleContinue = () => {
    // later: hook up real U of R auth
    navigation.replace('Quiz');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FlatFit</Text>
      <Text style={styles.subtitle}>
        Find compatible roommates and subleases at the University of Rochester.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
        <Text style={styles.primaryButtonText}>Continue with UR Account</Text>
      </TouchableOpacity>

      <Text style={styles.helperText}>
        We use your UR login to personalize matches and keep chats secure.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#C6C9D9',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
    color: '#8E92A8',
  },
});
