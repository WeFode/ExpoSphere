import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import React from "react";

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
    >
      <Stack.Screen
        name="index"
        options={{
          title: "组件库",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="verification-code-input"
        options={{
          title: "验证码输入框",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
