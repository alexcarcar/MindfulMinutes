import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Audio } from 'expo-av';
import { theme } from '../utils/theme';

export default function MeditationPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ripples, setRipples] = useState<any[]>([]);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const dropletColors = [
    theme.colors.accent,
    theme.colors.primary,
    '#A3D5D3',
    '#7FB3D5',
    '#AED6F1',
    '#B2EBF2',
    '#81D4FA',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newRipples = Array.from({ length: 6 }).map(() => {
        const id = Date.now() + Math.random();
        const left = Math.random() * (screenWidth - 60);
        const top = Math.random() * (screenHeight / 2);
        const scale = new Animated.Value(0);
        const opacity = new Animated.Value(0.6);
        const color =
          dropletColors[Math.floor(Math.random() * dropletColors.length)];

        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.5,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        });

        return { id, left, top, scale, opacity, color };
      });

      setRipples((prev) => [...prev, ...newRipples]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const playAudio = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/meditation.mp3'),
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <ImageBackground
      source={require('../assets/soothing-background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Animated Ripples */}
        {ripples.map((ripple) => (
          <Animated.View
            key={ripple.id}
            style={[
              styles.ripple,
              {
                left: ripple.left,
                top: ripple.top,
                opacity: ripple.opacity,
                transform: [{ scale: ripple.scale }],
                backgroundColor: ripple.color,
              },
            ]}
          />
        ))}

        <Text style={styles.title}>Meditation Player</Text>
        <Text style={styles.subtitle}>Choose your moment of calm</Text>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Play Meditation"
              onPress={playAudio}
              color={theme.colors.primary}
            />
          </View>

          {isPlaying && (
            <View style={styles.buttonWrapper}>
              <Button
                title="Stop Meditation"
                onPress={stopAudio}
                color={theme.colors.danger}
              />
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: theme.spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    marginVertical: theme.spacing.sm,
    width: '80%',
  },
  ripple: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
