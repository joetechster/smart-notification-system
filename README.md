# Proximity-Triggered Notification System

## Overview

This React Native + TypeScript project implements a smart notification system that tracks real-time updates on dynamic entities (like locations or resources) and alerts users when they are nearby or when key changes happen (status, price, or contributions). It integrates:

- **Supabase** for real-time data subscriptions
- **MMKV** for fast, local persistent storage of notifications
- **Notifee** for native local push notifications
- Background geofencing and timed prompts for contribution requests
- A reusable React hook to easily manage notifications within the app
- Utility functions

---

## How NotificationManager + Hook Work

### NotificationManager

The `NotificationManager` class is responsible for managing notifications stored locally using MMKV. It provides the following methods:

- `addNotification(notification)`: Adds a new notification to storage.
- `getAllNotifications()`: Retrieves all stored notifications.
- `getNotificationById(id)`: Fetches a notification by its unique ID.
- `markAsRead(id)`: Marks a specific notification as read.
- `markAllAsRead()`: Marks all notifications as read.
- `clearAllNotifications()`: Clears all notifications from storage.

This class abstracts the local storage operations and ensures consistency in how notifications are stored and accessed.

### useNotifications Hook

The custom React hook `useNotifications()`:

- Listens to MMKV storage key changes to keep the notifications state reactive.
- Exposes the notifications array and all manipulation functions from `NotificationManager`.
- Enables UI components to subscribe to notifications and update automatically when changes occur.
- Provides an easy and modular interface to interact with notification data.

---

## useLocation Hook

The `useLocation` hook provides real-time user location updates:

- Uses React Native’s location APIs to request permissions and get the user’s current coordinates.
- Subscribes to location changes to update user position continuously.
- Returns the latest latitude and longitude, which is critical for proximity calculations.
- Handles permission denial or errors gracefully.

This hook centralizes all location logic, making it reusable across components needing geolocation.

---

## useListenToEntityChanges Hook

The `useListenToEntityChanges` hook manages real-time subscriptions to entity updates via Supabase:

- Subscribes to insert, update, and delete events on the entities or contributions table.
- Calls a callback with updated entity data whenever a relevant change occurs.
- Handles subscription cleanup to avoid memory leaks.
- Facilitates live update flows without manual polling.

This hook allows components or services to react immediately when entity data changes, enabling timely notifications and UI refresh.

---

## How Proximity + Background Alerts Are Handled

### Real-time Entity Updates

- The system subscribes to Supabase real-time updates on the entity contribution table.
- Upon receiving an update (such as status or price changes), it calculates the distance between the user’s current location and the affected entity using the Haversine formula.
- If the user is within a configurable perimeter (default is 5 km), a local notification is sent via Notifee and saved to MMKV for persistence.

### Background Proximity Alerts (Background Tracking ON)

- Uses geofencing (via libraries like `react-native-background-geolocation`) to monitor when the user enters the proximity of subscribed entities.
- When the user enters an entity’s geofence, the app triggers a **NEARBY_ENTITY** notification, prompting the user to contribute relevant information.

### Contribution Prompts (Background Tracking OFF)

- When the user taps “Get Directions” for an entity and background tracking is disabled:
  - The app starts a timer (configurable between 5 to 10 minutes).
  - Once the timer expires, a **CONTRIBUTION_REQUEST** notification is automatically sent, prompting the user to contribute details about the entity.

---

## How the System Was Tested

- **Manual Testing:**
  - Verified that real-time Supabase updates correctly trigger notifications when the user is near an entity.
  - Tested geofence behavior to ensure **NEARBY_ENTITY** alerts fire reliably in background tracking mode.
  - Confirmed the delayed contribution prompt appears after "Get Directions" tap when background tracking is off.
- Debug logs and temporary test notifications helped validate the correctness of distance calculations and event handling.
- (Optional UI) Notifications list UI was tested for marking individual/all notifications as read and clearing them.

---

## Contact

**Your Name**  
Email: bamideledamilola3@gmail.com  
GitHub: [github.com/joetechster](https://github.com/joetechster)

# Replicate

## Step 1: Start Metro

```sh
npx react-native start
```

## Step 2: Build and run your app

```sh
npx react-native run-android
```
