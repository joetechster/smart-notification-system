import { RealtimePostgresChangesPayload, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";

export type EntityStatus = "Active" | "Inactive" | "Limited Access";

export type ResourceType = "PMS" | "AGO" | "DPK" | "LPG";

export type AmenityType = "ATM" | "Restaurant" | "Convenience Store" | "Car Wash" | "Restroom" | "Filling Station";

export interface Entity {
  id: string;
  name: string;
  brand?: string;
  address: string;
  latitude: number;
  longitude: number;
  status: EntityStatus;
  price: { [key in ResourceType]?: number };
  lastUpdated: Date;
  distance?: number | string; // Optional distance from user
  amenities?: AmenityType[];
  upvotes?: number;
  downvotes?: number;
  userVoted?: "up" | "down" | null;
}

export type EntityUpdatePayload = RealtimePostgresUpdatePayload<Entity>;

export type NotificationType =
  | "STATUS_UPDATE"
  | "CONTRIBUTION_REQUEST"
  | "PRICE_ALERT"
  | "NEARBY_ENTITY"
  | "SYSTEM_ALERT";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  entity?: Entity; // Optional reference
  distance?: string;
  priceChange?: {
    oldPrice: number;
    newPrice: number;
  };
}
