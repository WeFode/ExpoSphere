import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { initLanguage } from "@/i18n";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 初始化i18n
  useEffect(() => {
    const setupLanguage = async () => {
      await initLanguage();
    };

    setupLanguage();
  }, []);

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
      </Stack>
    </GestureHandlerRootView>
  );
}
