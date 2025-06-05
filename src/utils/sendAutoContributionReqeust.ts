import { sendNotification } from "../hooks/useNotifications";
import { notificationManager } from "../storage/notificationManager";
import { Entity, Notification } from "../types/notification";
import { supabase } from "./superbase";

export async function sendAutoContributionRequest(id: string) {
  const { data: entity, error } = await supabase.from("Entity").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching entity:", error);
  }
  const delayMinutes = 5;

  setTimeout(async () => {
    const notification: Notification = {
      id: `${Date.now()}`,
      type: "CONTRIBUTION_REQUEST",
      title: `Contribution Request`,
      message: `You recently got directions to ${entity.name}. Please consider contributing.`,
      timestamp: new Date(),
      read: false,
      actionable: true,
      entity,
    };
    sendNotification(notification.title, notification.message);
    notificationManager.addNotification(notification);
  }, delayMinutes * 60 * 1000);
}
