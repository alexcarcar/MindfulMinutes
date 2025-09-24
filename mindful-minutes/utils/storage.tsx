import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveMood = async (mood: string) => {
  const timestamp = new Date().toISOString();
  const entry = { mood, timestamp };
  const existing = await AsyncStorage.getItem('moodLog');
  const moodLog = existing ? JSON.parse(existing) : [];
  moodLog.push(entry);
  await AsyncStorage.setItem('moodLog', JSON.stringify(moodLog));
};

export const loadMoodLog = async () => {
  const data = await AsyncStorage.getItem('moodLog');
  return data ? JSON.parse(data) : [];
};
