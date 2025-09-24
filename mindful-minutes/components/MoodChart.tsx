import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { Audio } from 'expo-av';

export default function MeditationPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    if (sound) {
      await sound.unloadAsync(); // unload previous sound
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../assets/meditation.mp3')
    );
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // cleanup on unmount
      }
    };
  }, [sound]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Meditation Player</Text>
      <Button title="Play Meditation" onPress={playAudio} />
      {isPlaying && <Button title="Stop Meditation" onPress={stopAudio} />}
    </View>
  );
}
