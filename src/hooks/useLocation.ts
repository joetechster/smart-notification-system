// hooks/useUserLocation.ts
import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function requestLocationPermission() {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          });
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true;
    }

    async function getLocation() {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setErrorMsg("Permission denied");
        setLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          setErrorMsg(error.message);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    }

    setTimeout(() => getLocation(), 500);
  }, []);

  return { location, errorMsg, loading };
}
