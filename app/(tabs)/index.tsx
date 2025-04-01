import React, { useCallback } from "react";
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

// 获取屏幕宽度
const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const GAP = 16;
const ITEM_SIZE = (width - GAP * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

// API示例数据
const API_EXAMPLES = [
  {
    id: "flashlist",
    title: "FlashList",
    icon: "list-outline",
    description: "高性能列表组件",
    color: "#E57373",
  },
  {
    id: "image",
    title: "Expo Image",
    icon: "image-outline",
    description: "高性能图片组件",
    color: "#64B5F6",
  },
  {
    id: "file-system",
    title: "File System",
    icon: "document-outline",
    description: "文件系统示例",
    color: "#FF9800",
  },
  {
    id: "haptics",
    title: "Haptics",
    icon: "phone-portrait-outline",
    description: "触觉反馈示例",
    color: "#4FC3F7",
  },
  {
    id: "imagePicker",
    title: "Image Picker",
    icon: "image-outline",
    description: "图片选择器示例",
    color: "#FF5722",
  },
  {
    id: "gestures",
    title: "Gestures",
    icon: "finger-print-outline",
    description: "手势交互示例",
    color: "#9575CD",
  },
  {
    id: "animation",
    title: "Reanimated",
    icon: "construct-outline",
    description: "流畅的动画效果",
    color: "#81C784",
  },
  {
    id: "blur",
    title: "BlurView",
    icon: "apps-outline",
    description: "模糊效果组件",
    color: "#FFD54F",
  },
  {
    id: "camera",
    title: "Camera",
    icon: "camera-outline",
    description: "相机功能示例",
    color: "#FF8A65",
  },
  {
    id: "location",
    title: "Location",
    icon: "location-outline",
    description: "定位功能示例",
    color: "#7986CB",
  },
];

type ExampleItem = (typeof API_EXAMPLES)[0];

// 示例项目组件
const ExampleCard = ({ item, index }: { item: ExampleItem; index: number }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const router = useRouter();

  const handlePress = useCallback(
    (id: string) => {
      if (item.id === "flashlist") {
        router.push("/(examples)/flashlist");
      } else if (item.id === "image") {
        router.push("/(examples)/image");
      } else if (item.id === "file-system") {
        router.push("/(examples)/file-system");
      } else if (item.id === "haptics") {
        router.push("/(examples)/haptics");
      } else if (item.id === "imagePicker") {
        router.push("/(examples)/image-picker");
      } else {
        // 为其他页面设置路由
        router.push(`/(examples)/${item.id}`);
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

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Expo + React Native
      </Text>
      <Text style={[styles.headerSubtitle, { color: colors.secondaryAccent }]}>
        常用API组件示例预览
      </Text>
    </View>
  );
};

export default function ExampleLibrary() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlashList
        data={API_EXAMPLES}
        renderItem={({ item, index }) => (
          <ExampleCard item={item} index={index} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<ListHeader />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
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
