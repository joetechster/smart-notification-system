import { useMMKVListener } from "react-native-mmkv";
import { notificationManager } from "../storage/notificationManager";
import { useState } from "react";
import notifee from "@notifee/react-native";

export default function useNotifications() {
  const [notifications, setNotifications] = useState(notificationManager.getAllNotifications());

  useMMKVListener((key) => {
    console.log(`${key}'s value changed`);
    // Update notifications state when the key changes
    if (key === notificationManager.key) {
      setNotifications(notificationManager.getAllNotifications());
    }
  }, notificationManager.storage);

  return {
    notifications,
    addNotification: notificationManager.addNotification,
    getAllNotifications: notificationManager.getAllNotifications,
    getNotificationById: notificationManager.getNotificationById,
    markAsRead: notificationManager.markAsRead,
    markAllAsRead: notificationManager.markAllAsRead,
    clearAllNotifications: notificationManager.clearAllNotifications,
    refreshNotifications: notificationManager.refreshNotifications,
  };
}

export async function sendNotification(title: string, body: string) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: "ic_launcher", // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: "default",
      },
    },
  });
}
