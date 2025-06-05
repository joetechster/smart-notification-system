import React, { useEffect } from "react";
import { Button, FlatList, StatusBar, StyleSheet, Text, ToastAndroid, View } from "react-native";
import useNotifications from "./src/hooks/useNotifications";
import useListenToEntityChanges from "./src/hooks/useListenToEntityChanges";
import { SafeAreaView } from "react-native-safe-area-context";
import { startBackgroundLocationTracking } from "./src/background/startBackgroundTracking";
import { useMMKVBoolean } from "react-native-mmkv";
import { setupGeofencesForEntities } from "./src/background/geofencing";
import { sendAutoContributionRequest } from "./src/utils/sendAutoContributionReqeust";

export default function Screen() {
  const [backgroundTracking, setBackgroundTracking] = useMMKVBoolean("background-tracking");
  const { notifications, markAllAsRead, clearAllNotifications } = useNotifications();
  useListenToEntityChanges();

  useEffect(() => {
    if (backgroundTracking) {
      ToastAndroid.show("Activating background tracking", ToastAndroid.LONG);
      startBackgroundLocationTracking();
    }
  }, [backgroundTracking]);
  const onGetDirectionsPressed = (id: string) => {
    if (backgroundTracking) {
      ToastAndroid.show("Setting up geofencing", ToastAndroid.LONG);
      setupGeofencesForEntities();
    } else {
      sendAutoContributionRequest(id);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, paddingVertical: 10 }}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text>{item.title}</Text>
            <Text>{item.message}</Text>
            <Text>ID: {item.id}</Text>
            {item.entity && (
              <Button title="Get Directions" onPress={() => onGetDirectionsPressed(item.entity?.id || "")} />
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap", padding: 10, justifyContent: "center" }}>
            <Button title="Mark All as Read" onPress={markAllAsRead} />
            <Button title="Clear All" onPress={clearAllNotifications} />
            <Button title="Enable Background Tracking" onPress={() => setBackgroundTracking(true)} />
          </View>
        }
      />
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  notification: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    marginHorizontal: 10,
    borderRadius: 10,
    gap: 5,
  },
});
