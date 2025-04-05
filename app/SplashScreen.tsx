import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useI18n } from "@/i18n";

// 阻止自动隐藏启动画面
SplashScreen.preventAutoHideAsync();

// 设置动画选项
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function AppSplashScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [isAppReady, setIsAppReady] = useState(false);
  const { t } = useI18n();
  const fadeAnim = useState(new Animated.Value(0))[0];

  // 准备应用所需资源
  useEffect(() => {
    async function prepare() {
      try {
        // 加载字体或其他资源
        await Font.loadAsync({
          // 添加你需要的字体
        });

        // 模拟加载过程（实际应用中可能是API请求或其他准备工作）
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 应用准备完成
        setIsAppReady(true);
      } catch (e) {
        console.warn("启动屏幕资源加载错误:", e);
      }
    }

    prepare();
  }, []);

  // 当应用准备好时，显示自定义启动画面并淡入
  useEffect(() => {
    if (isAppReady) {
      // 执行淡入动画
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(async () => {
        // 动画完成后等待一小段时间，然后隐藏启动画面
        setTimeout(async () => {
          await SplashScreen.hideAsync();
          onFinish();
        }, 500);
      });
    }
  }, [isAppReady, fadeAnim, onFinish]);

  // 使用onLayout来确保在视图布局好后再隐藏原始启动画面
  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  // 如果应用未准备好，返回null，保持系统启动画面显示
  if (!isAppReady) {
    return null;
  }

  // 返回自定义启动画面组件
  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim }]}
      onLayout={onLayoutRootView}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>ExpoSphere</Text>
      <Text style={styles.subtitle}>{t("common.loading")}...</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#cccccc",
  },
  footer: {
    position: "absolute",
    bottom: 40,
  },
  footerText: {
    color: "#888888",
    fontSize: 14,
  },
});
