import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { initLanguage } from "@/i18n";
import AppSplashScreen from "./SplashScreen";
import React from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  // 初始化i18n
  useEffect(() => {
    const setupLanguage = async () => {
      await initLanguage();
    };

    setupLanguage();
  }, []);

  // 若启动屏幕未完成，显示启动屏幕
  if (!isSplashComplete) {
    return <AppSplashScreen onFinish={() => setIsSplashComplete(true)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors[colorScheme ?? "dark"].background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" />
        {/*  presentation: 'modal' 以模态方式展示，而不会跳转整个页面 */}
        <Stack.Screen name="(examples)" options={{ presentation: "modal" }} />
        <Stack.Screen name="(components)" options={{ presentation: "modal" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
