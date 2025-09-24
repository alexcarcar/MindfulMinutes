// components/MoodPicker.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const moods = ['😊', '😐', '😢', '😠', '😴'];

export default function MoodPicker({ onSelect }: { onSelect: (mood: string) => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.moodRow}>
        {moods.map((mood) => (
          <TouchableOpacity key={mood} onPress={() => onSelect(mood)} style={styles.moodButton}>
            <Text style={styles.mood}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  title: { fontSize: 18, fontWeight: '600' },
  moodRow: { flexDirection: 'row', marginTop: 10 },
  moodButton: { marginHorizontal: 10 },
  mood: { fontSize: 32 },
});
