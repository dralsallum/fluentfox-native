import { View, Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack, Slot } from "expo-router";

const ScreensLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="homeScreen" options={{ headerShown: false }} />
        <Stack.Screen
          name="vocabulary/vocabulary"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="dark" />
    </>
  );
};

export default ScreensLayout;
