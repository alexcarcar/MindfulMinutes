import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mindful Minutes</Text>
      <Text style={styles.subtitle}>How are you feeling today?</Text>
      <Button title="Take a Mindful Break" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 18, marginVertical: 10 },
});
