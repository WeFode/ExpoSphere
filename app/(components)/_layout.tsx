import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

export default function ComponentsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "dark"].background,
        },
        headerTintColor: Colors[colorScheme ?? "dark"].text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: Colors[colorScheme ?? "dark"].background,
        },
      }}
    ></Stack>
  );
}
