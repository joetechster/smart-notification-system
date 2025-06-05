// locationHeadlessTask.ts
import { getCurrentPosition } from "../utils/getCurrentPosition";
import BackgroundFetch from "react-native-background-fetch";
import calculateDistance from "../utils/calculateDistance";
import { getEntities } from "../utils/getEntities";
import { sendNotification } from "../hooks/useNotifications";
import { notificationManager } from "../storage/notificationManager";
import { PERIMETER } from "../constants";

export default async (event: any) => {
  if (event.timeout) {
    return BackgroundFetch.finish();
  }

  const position = await getCurrentPosition();
  const userLat = position.coords.latitude;
  const userLon = position.coords.longitude;

  const entities = await getEntities();

  for (const entity of entities) {
    const dist = calculateDistance(userLat, userLon, entity.latitude, entity.longitude);
    if (dist <= PERIMETER) {
      sendNotification("Nearby Alert", `${entity.name} is just ${dist} km away.`);
      notificationManager.addNotification({
        id: `${Date.now()}`,
        title: "Nearby Alert",
        message: `${entity.name} is just ${dist} km away.`,
        read: false,
        actionable: true,
        timestamp: new Date(),
        type: "NEARBY_ENTITY",
        entity,
      });
    }
  }

  BackgroundFetch.finish();
};
