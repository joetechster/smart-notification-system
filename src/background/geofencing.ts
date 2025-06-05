import BackgroundGeolocation from "react-native-background-geolocation";
import notifee from "@notifee/react-native";
import { getEntities } from "../utils/getEntities";
import { sendNotification } from "../hooks/useNotifications";
import { Notification } from "../types/notification";
import { notificationManager } from "../storage/notificationManager";

export async function setupGeofencesForEntities() {
  const entities = await getEntities();
  entities.forEach((entity) => {
    BackgroundGeolocation.addGeofence({
      identifier: entity.id,
      radius: 5000, // meters (5 km)
      latitude: entity.latitude,
      longitude: entity.longitude,
      notifyOnEntry: true,
      notifyOnExit: false,
    });
  });

  BackgroundGeolocation.onGeofence((event) => {
    if (event.action === "ENTER") {
      // User arrived in geofence, prompt contribution
      const entity = entities.find((e) => e.id === event.identifier);
      if (entity) {
        const notification: Notification = {
          id: `${Date.now()}`,
          type: "CONTRIBUTION_REQUEST",
          title: `You arrived near ${entity.name}`,
          message: "Would you like to contribute information now?",
          timestamp: new Date(),
          read: false,
          actionable: true,
          entity,
        };

        notificationManager.addNotification(notification);
        sendNotification(notification.title, notification.message);
      }
    }
  });
}
