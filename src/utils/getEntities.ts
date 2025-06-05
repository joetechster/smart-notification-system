import { Entity } from "../types/notification";
import { supabase } from "./superbase";

export async function getEntities(): Promise<Entity[]> {
  let { data, error } = await supabase.from("Entity").select("*");

  if (error) {
    console.error("Failed to fetch entities:", error);
    return [];
  }

  if (!data) {
    console.log("No entities:");
    return [];
  }

  return data;
}
