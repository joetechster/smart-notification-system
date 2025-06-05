import { useEffect } from "react";
import { supabase } from "../utils/superbase";
import { Entity, EntityUpdatePayload } from "../types/notification";
import useNotifications, { sendNotification } from "./useNotifications";
import { Coordinates, useUserLocation } from "./useLocation";
import calculateDistance from "../utils/calculateDistance";
import { PERIMETER } from "../constants";

export default function useListenToEntityChanges() {
  const { location, loading } = useUserLocation();
  const { addNotification } = useNotifications();

  async function sendNotificationIfWithinDistance(userLocation: Coordinates, entity: Entity) {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      entity.latitude,
      entity.longitude
    );
    console.log("distance from entity: ", distance);
    if (distance <= PERIMETER) {
      // Notify nearby users
      await sendNotification(`Update at ${entity.name}`, `${entity.status} - ${entity.address}`);
      addNotification({
        id: `${Date.now()}`,
        title: `Update at ${entity.name}`,
        message: `New status: ${entity.status}`,
        read: false,
        actionable: true,
        timestamp: new Date(),
        type: "STATUS_UPDATE",
        entity,
      });
    }
  }

  useEffect(() => {
    if (loading || !location) return;
    // Subscirbe all users to entity updates
    const channels = supabase
      .channel("custom-all-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "Entity" }, (payload) => {
        switch (payload.eventType) {
          case "UPDATE":
            sendNotificationIfWithinDistance(location, (payload as EntityUpdatePayload).new);
            break;
        }
        console.log("Change received!", payload);
      })
      .subscribe();

    return () => {
      channels.unsubscribe();
    };
  }, [location]);
}
