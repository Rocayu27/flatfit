import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const MOCK_CHATS = [
  { id: '1', name: 'Alex', preview: 'Totally fine with guests on weekends.' },
  { id: '2', name: 'Taylor', preview: 'I usually cook dinner around 7.' },
];

export default function ChatsScreen() {
  const renderItem = ({ item }: { item: (typeof MOCK_CHATS)[number] }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.preview}>{item.preview}</Text>
      </View>
      <Text style={styles.time}>Now</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  name: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  preview: {
    fontSize: 13,
    color: '#9CA0B8',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#6E7392',
  },
  separator: {
    height: 1,
    backgroundColor: '#1D2132',
  },
});
