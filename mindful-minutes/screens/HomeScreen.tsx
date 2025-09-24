import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import MoodPicker from '../components/MoodPicker';
import { saveMood } from '../utils/storage';
import { scheduleReminder } from '../utils/notifications';
import { theme } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [ripples, setRipples] = useState<any[]>([]);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const imageWidth = 1080;
  const imageHeight = 1920;

  const columns = Math.ceil(screenWidth / imageWidth);
  const rows = Math.ceil(screenHeight / imageHeight);

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
    scheduleReminder();

    const interval = setInterval(() => {
      const newRipples = Array.from({ length: 8 }).map(() => {
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
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    await saveMood(mood);
  };

  return (
    <View style={styles.background}>
      {/* Tiled Background */}
      <View style={styles.tileContainer}>
        {Array.from({ length: rows * columns }).map((_, i) => (
          <Image
            key={i}
            source={require('../assets/soothing-background.jpg')}
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
          />
        ))}
      </View>

      {/* Overlay Content */}
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

        <Text style={styles.title}>Welcome to Mindful Minutes</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>

        <MoodPicker onSelect={handleMoodSelect} />

        <View style={styles.buttonGroup}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Play Meditation"
              onPress={() => navigation.navigate('Meditation')}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="View Mood History"
              onPress={() => navigation.navigate('Mood History')}
              color={theme.colors.accent}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  tileContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    zIndex: -1,
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
