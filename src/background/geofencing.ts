import { getEntities } from "../utils/getEntities";
import { sendNotification } from "../hooks/useNotifications";
import { Notification } from "../types/notification";
import { notificationManager } from "../storage/notificationManager";
import Geolocation from "@react-native-community/geolocation";
import BackgroundFetch from "react-native-background-fetch";
import calculateDistance from "../utils/calculateDistance";
import { PERIMETER } from "../constants";

export async function setupGeofencesForEntities() {
  const entities = await getEntities();

  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // run every 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    },
    async () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          for (const entity of entities) {
            const distance = calculateDistance(latitude, longitude, entity.latitude, entity.longitude);
            if (distance <= PERIMETER) {
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

              break; // Only notify once per fetch
            }
          }

          BackgroundFetch.finish(); // Let the system know the fetch task is done
        },
        (error) => {
          console.warn("Geolocation error:", error);
          BackgroundFetch.finish();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000,
        }
      );
    },
    (error) => {
      console.warn("BackgroundFetch failed to start", error);
    }
  );
}
