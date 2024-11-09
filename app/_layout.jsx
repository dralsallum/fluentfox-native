// RooyLayout.js
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { NotificationProvider } from "./redux/NotificationContext";
import appsFlyer from "react-native-appsflyer";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const RooyLayout = () => {
  useEffect(() => {
    appsFlyer.initSdk(
      {
        devKey: "qoAEWsD3N2Eb245wdusrJH",
        isDebug: false,
        appId: "6673901781",
        onInstallConversionDataListener: true, // Optional
        onDeepLinkListener: true, // Optional
      },
      (result) => {
        console.log("AppsFlyer SDK initialized:", result);
      },
      (error) => {
        console.error("AppsFlyer SDK initialization error:", error);
      }
    );
  }, []);

  useEffect(() => {
    const onInstallConversionData = (data) => {
      console.log("Attribution data:", data);
    };

    appsFlyer.onInstallConversionData(onInstallConversionData);

    return () => {
      appsFlyer.removeListener();
    };
  }, []);

  return (
    <Provider store={store}>
      <NotificationProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="components/streak"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        </Stack>
      </NotificationProvider>
    </Provider>
  );
};

export default RooyLayout;
