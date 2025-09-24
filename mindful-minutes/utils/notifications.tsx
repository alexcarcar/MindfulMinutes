import * as Notifications from 'expo-notifications';

export const scheduleReminder = async () => {
await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Mindful Minutes',
      body: 'Time for a quick meditation break.',
    },
    trigger: { seconds: 3600, repeats: true },
  });
};
