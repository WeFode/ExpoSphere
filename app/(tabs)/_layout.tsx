import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet, ViewStyle } from "react-native";
import { useMemo } from "react";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { useI18n } from "@/i18n";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useI18n();

  const tabBarStyle = useMemo<ViewStyle>(
    () => ({
      position: "absolute" as const,
      borderTopWidth: 0,
      elevation: 0,
      backgroundColor: "transparent",
      height: 80,
    }),
    [],
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "dark"].tabIconDefault,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "dark"].background,
        },
        headerTitleStyle: {
          color: Colors[colorScheme ?? "dark"].text,
        },
        tabBarStyle: tabBarStyle,
        tabBarBackground: () => (
          <BlurView
            tint={colorScheme === "dark" ? "dark" : "light"}
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="components"
        options={{
          title: t("tabs.components") || "组件库",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
