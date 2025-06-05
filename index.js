/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import BackgroundFetch from "react-native-background-fetch";
import locationHeadlessTask from "./src/background/locationHeadlessTask";

AppRegistry.registerComponent(appName, () => App);
BackgroundFetch.registerHeadlessTask(locationHeadlessTask);
