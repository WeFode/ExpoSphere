import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useI18n } from "@/i18n";

// 获取屏幕尺寸
const { width } = Dimensions.get("window");

// 类型定义
type ComponentItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  imageUrl?: string;
  color?: string;
  aspectRatio?: number;
  span?: number; // 1-默认大小, 2-双倍宽度
  route: string;
};

// 头部组件
const Header = ({ scrollY }: { scrollY: Animated.SharedValue<number> }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const { t } = useI18n();

  // 标题动画样式
  const titleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -20],
            Extrapolate.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [0, 100],
            [1, 0.8],
            Extrapolate.CLAMP,
          ),
        },
      ],
      opacity: interpolate(
        scrollY.value,
        [0, 60, 100],
        [1, 0.8, 0.6],
        Extrapolate.CLAMP,
      ),
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [0, -15],
            Extrapolate.CLAMP,
          ),
        },
      ],
      opacity: interpolate(
        scrollY.value,
        [0, 60, 100],
        [1, 0.6, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <View style={styles.headerContainer}>
      <Animated.Text
        style={[styles.headerTitle, { color: colors.text }, titleStyle]}
      >
        {t("components.title") || "创意库"}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.headerSubtitle,
          { color: colors.secondaryAccent },
          subtitleStyle,
        ]}
      >
        {t("components.subtitle") || "解锁你的创意潜力"}
      </Animated.Text>
    </View>
  );
};

// 组件卡片
const ComponentCard = ({
  item,
  index,
}: {
  item: ComponentItem;
  index: number;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const router = useRouter();
  const scale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = useCallback(() => {
    router.push(item.route as any);
  }, [router, item.route]);

  const cardWidth = item.span === 2 ? width * 0.9 : width * 0.45 - 15;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={[
        styles.cardContainer,
        {
          width: cardWidth,
          aspectRatio: item.aspectRatio || 1.5,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.cardTouchable}
      >
        <Animated.View style={[styles.card, cardStyle]}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[
                item.color || "#4776E6",
                colorScheme === "dark" ? "#000" : "#fff",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            />
          )}

          <BlurView
            tint={colorScheme === "dark" ? "dark" : "light"}
            intensity={colorScheme === "dark" ? 40 : 70}
            style={styles.cardOverlay}
          >
            {item.icon && (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={colors.text}
                />
              </View>
            )}
            <View style={styles.cardContent}>
              <Text
                style={[styles.cardTitle, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              {item.subtitle && (
                <Text
                  style={[
                    styles.cardSubtitle,
                    { color: colors.secondaryAccent },
                  ]}
                  numberOfLines={2}
                >
                  {item.subtitle}
                </Text>
              )}
            </View>
          </BlurView>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 主组件
export default function ComponentLibrary() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const scrollY = useSharedValue(0);
  const [languageChanged, setLanguageChanged] = useState(0);

  // 语言检测
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
  }, [languageChanged]);

  // 滚动处理
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // 组件数据
  const components = useMemo(
    () => [
      {
        id: "image-slider",
        title: "高级图片滑动",
        subtitle: "毛玻璃背景与滑动切换效果",
        imageUrl:
          "https://images.unsplash.com/photo-1655635643532-fa9ba2648cbe?q=80&w=1000",
        aspectRatio: 1.5,
        span: 2,
        route: "/(components)/image-slider",
      },
      {
        id: "ai-art",
        title: "AI艺术生成",
        subtitle: "人工智能图像创作",
        imageUrl:
          "https://images.unsplash.com/photo-1655720035247-296ae36d92fc?q=80&w=1000",
        aspectRatio: 1,
        route: "/(components)/ai-art",
      },
      {
        id: "3d-animation",
        title: "3D动画效果",
        subtitle: "交互式3D变换",
        imageUrl:
          "https://images.unsplash.com/photo-1655720033654-bb9a2456bc5d?q=80&w=1000",
        aspectRatio: 1,
        route: "/(components)/3d-animation",
      },
      {
        id: "image-filter",
        title: "滤镜工具",
        icon: "color-filter-outline",
        color: "#FF5733",
        route: "/(components)/image-filter",
      },
      {
        id: "parallax",
        title: "视差滚动",
        icon: "layers-outline",
        color: "#33A1FF",
        route: "/(components)/parallax",
      },
      {
        id: "gesture",
        title: "手势控制",
        icon: "hand-left-outline",
        color: "#33FF57",
        route: "/(components)/gesture",
      },
      {
        id: "particle",
        title: "粒子效果",
        icon: "cellular-outline",
        color: "#FF33A1",
        route: "/(components)/particle",
      },
      {
        id: "text-animation",
        title: "文字动画",
        imageUrl:
          "https://images.unsplash.com/photo-1655639234985-a1e886cf8101?q=80&w=1000",
        aspectRatio: 1.2,
        route: "/(components)/text-animation",
      },
    ],
    [],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* 头部 */}
        <Header scrollY={scrollY} />

        {/* 组件网格 */}
        <View style={styles.gridContainer}>
          {components.map((item, index) => (
            <ComponentCard key={item.id} item={item} index={index} />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 为底部TabBar留出空间
  },
  headerContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 15,
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 20,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    flex: 1,
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconContainer: {
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});
