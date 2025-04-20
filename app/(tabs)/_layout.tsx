import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet, ViewStyle } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { useI18n } from "@/i18n";
import React from "react";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  const [_, setLanguageChanged] = useState(0);

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

  // 监听语言变化
  useEffect(() => {
    const checkLanguage = async () => {
      try {
        // 触发重新渲染
        setLanguageChanged((prev) => prev + 1);
      } catch (error) {
        console.error("检查语言设置失败:", error);
      }
    };

    // 初始检查
    checkLanguage();

    // 设置定期检查，以防语言变化
    const interval = setInterval(checkLanguage, 1000);
    return () => clearInterval(interval);
  }, []);

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
