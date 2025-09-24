import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { loadMoodLog } from '../utils/storage';
import { theme } from '../utils/theme';

const screenWidth = Dimensions.get('window').width;

export default function MoodHistoryScreen() {
  const [moodData, setMoodData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchMoodData = async () => {
      const log = await loadMoodLog();

      const scores = log.map((entry: any) => {
        switch (entry.mood) {
          case '😊': return 5;
          case '😐': return 3;
          case '😢': return 2;
          case '😠': return 1;
          case '😴': return 4;
          default: return 0;
        }
      });

      const labelDates = log.map((entry: any) => {
        const date = new Date(entry.timestamp);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

      setMoodData(scores);
      setLabels(labelDates);
    };

    fetchMoodData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mood History</Text>
      <Text style={styles.subtitle}>Track your emotional patterns over time</Text>

      {moodData.length > 0 ? (
        <View style={styles.chartCard}>
          <LineChart
            data={{
              labels,
              datasets: [{ data: moodData }],
            }}
            width={screenWidth - theme.spacing.lg * 2}
            height={220}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: theme.colors.card,
              backgroundGradientFrom: theme.colors.card,
              backgroundGradientTo: theme.colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: theme.borderRadius.lg },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: theme.colors.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.empty}>No mood check-ins yet. Start today and watch your journey unfold 🌱</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
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
  chartCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    width: '100%',
    ...theme.shadow,
  },
  chart: {
    borderRadius: theme.borderRadius.lg,
  },
  empty: {
    marginTop: theme.spacing.xl,
    fontSize: theme.fontSizes.md,
    color: theme.colors.muted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
