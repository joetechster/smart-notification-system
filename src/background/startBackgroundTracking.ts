import BackgroundFetch from "react-native-background-fetch";

export async function startBackgroundLocationTracking() {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // every 15 minutes
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    },
    async (taskId) => {
      console.log("[BackgroundFetch] task: ", taskId);
      // Logic handled in headless task
      BackgroundFetch.finish(taskId);
    },
    (error) => {
      console.warn("BackgroundFetch failed to start", error);
    }
  );
}
