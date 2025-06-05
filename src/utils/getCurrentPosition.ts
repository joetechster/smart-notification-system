import Geolocation, { GeolocationResponse } from "@react-native-community/geolocation";

export function getCurrentPosition() {
  return new Promise<GeolocationResponse>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
}
