import { MMKV } from "react-native-mmkv";
import { Notification } from "../types/notification";

export default class NotificationManager {
  key: string;
  storage: MMKV;

  constructor(key = "notifications") {
    this.key = key;
    this.storage = new MMKV();
  }

  addNotification = (notification: Notification) => {
    const currentNotifications = this.getAllNotifications();
    const newNotifications = [...currentNotifications, notification];
    this.setNotifications(newNotifications);
  };

  getAllNotifications = (): Notification[] => {
    const rawNotifications = this.storage.getString(this.key);
    if (rawNotifications) return JSON.parse(rawNotifications);
    else return [];
  };

  getNotificationById = (id: Notification["id"]) => {
    return this.getAllNotifications().find((notification) => notification.id === id);
  };

  markAsRead = (id: Notification["id"]) => {
    const newNotifications = this.getAllNotifications().map(
      (notification): Notification => (notification.id === id ? { ...notification, read: true } : notification)
    );
    this.setNotifications(newNotifications);
  };

  markAllAsRead = () => {
    const newNotifications = this.getAllNotifications().map(
      (notification): Notification => ({ ...notification, read: true })
    );
    this.setNotifications(newNotifications);
  };

  clearAllNotifications = () => {
    this.storage.delete(this.key);
  };

  refreshNotifications = () => {
    const newNotifications = this.getAllNotifications().map(
      (notification): Notification => ({ ...notification, read: false })
    );
    this.setNotifications(newNotifications);
  }; // Couldn't really tell what this should do

  setNotifications = (notifications: Notification[]) => {
    this.storage.set(this.key, JSON.stringify(notifications));
  };
}

export const notificationManager = new NotificationManager();
