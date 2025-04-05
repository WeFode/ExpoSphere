import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { useI18n } from "@/i18n";

// 获取屏幕宽度
const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const GAP = 16;
const ITEM_SIZE = (width - GAP * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

type ExampleItem = {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
};

// 示例项目组件
const ExampleCard = ({ item, index }: { item: ExampleItem; index: number }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const router = useRouter();
  const { t } = useI18n();

  const handlePress = useCallback(
    (id: string) => {
      if (item.id === "flashlist") {
        router.push("/(examples)/flashlist");
      } else if (item.id === "image") {
        router.push("/(examples)/image");
      } else if (item.id === "file-system") {
        router.push("/(examples)/file-system");
      } else if (item.id === "imagePicker") {
        router.push("/(examples)/image-picker");
      } else if (item.id === "gestures") {
        router.push("/(examples)/gestures" as any);
      } else if (item.id === "animation") {
        router.push("/(examples)/animation" as any);
      } else if (item.id === "blur") {
        router.push("/(examples)/blur-view" as any);
      } else if (item.id === "camera") {
        router.push("/(examples)/camera" as any);
      } else if (item.id === "location") {
        router.push("/(examples)/location" as any);
      }
    },
    [router, item.id],
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress(item.id)}
        style={[styles.card, { backgroundColor: colors.card }]}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon as any} size={32} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text
          style={[styles.description, { color: colors.secondaryAccent }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 头部组件
const ListHeader = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const { t } = useI18n();

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {t("home.title")}
      </Text>
      <Text style={[styles.headerSubtitle, { color: colors.secondaryAccent }]}>
        {t("home.subtitle")}
      </Text>
    </View>
  );
};

export default function ExampleLibrary() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const { t } = useI18n();
  const [languageChanged, setLanguageChanged] = useState(0);

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

  // 转换API示例数据为国际化版本
  const apiExamples = [
    {
      id: "flashlist",
      title: t("home.examples.flashlist.title"),
      icon: "list-outline",
      description: t("home.examples.flashlist.description"),
      color: "#E57373",
    },
    {
      id: "image",
      title: t("home.examples.image.title"),
      icon: "image-outline",
      description: t("home.examples.image.description"),
      color: "#64B5F6",
    },
    {
      id: "file-system",
      title: t("home.examples.fileSystem.title"),
      icon: "document-outline",
      description: t("home.examples.fileSystem.description"),
      color: "#FF9800",
    },
    {
      id: "imagePicker",
      title: t("home.examples.imagePicker.title"),
      icon: "image-outline",
      description: t("home.examples.image.description"),
      color: "#FF5722",
    },
    {
      id: "gestures",
      title: t("home.examples.gestures.title"),
      icon: "finger-print-outline",
      description: t("home.examples.gestures.description"),
      color: "#9575CD",
    },
    {
      id: "animation",
      title: t("home.examples.animation.title"),
      icon: "construct-outline",
      description: t("home.examples.animation.description"),
      color: "#81C784",
    },
    {
      id: "blur",
      title: t("home.examples.blur.title"),
      icon: "apps-outline",
      description: t("home.examples.blur.description"),
      color: "#FFD54F",
    },
    {
      id: "camera",
      title: t("home.examples.camera.title"),
      icon: "camera-outline",
      description: t("home.examples.camera.description"),
      color: "#FF8A65",
    },
    {
      id: "location",
      title: t("home.examples.location.title"),
      icon: "location-outline",
      description: t("home.examples.location.description"),
      color: "#7986CB",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlashList
        data={apiExamples}
        renderItem={({ item, index }) => (
          <ExampleCard item={item} index={index} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<ListHeader />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        // 使用languageChanged作为extraData以确保语言变化时列表会重新渲染
        extraData={languageChanged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: GAP,
    paddingBottom: 100, // 为底部TabBar留出空间
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  cardWrapper: {
    width: ITEM_SIZE,
    marginBottom: GAP,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    width: ITEM_SIZE * 0.4,
    height: ITEM_SIZE * 0.4,
    borderRadius: ITEM_SIZE * 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    textAlign: "center",
    opacity: 0.8,
  },
});
