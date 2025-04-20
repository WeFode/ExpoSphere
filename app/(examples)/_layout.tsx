import { Stack } from "expo-router";
import React from "react";

export default function ExamplesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="flashlist" />
      <Stack.Screen name="image" />
      <Stack.Screen name="animation" />
      <Stack.Screen name="blur" />
      <Stack.Screen name="gestures" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="location" />
    </Stack>
  );
}
