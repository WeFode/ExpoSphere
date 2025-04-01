import { Stack } from "expo-router";

export default function ExamplesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="flashlist" />
      <Stack.Screen name="image" />
      <Stack.Screen name="file-system" />
      <Stack.Screen name="haptics" />
      <Stack.Screen name="image-picker" />
      <Stack.Screen name="animation" />
      <Stack.Screen name="blur" />
      <Stack.Screen name="gestures" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="location" />
    </Stack>
  );
}
