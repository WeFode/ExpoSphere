import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ImageContentFit, ImageTransition } from "expo-image";
import { BlurView } from "expo-blur";

import { ActivityIndicator } from "react-native";

// 示例图片
const SAMPLE_IMAGE_URL =
  "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=2070";
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1287",
  "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=1439",
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1470",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1473",
];

// Blurhash 示例
const BLURHASH =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

// 定义内容适配选项
const contentFitOptions: ImageContentFit[] = [
  "cover",
  "contain",
  "fill",
  "none",
  "scale-down",
];

const transitionEffects: ImageTransition["effect"][] = [
  "cross-dissolve",
  "flip-from-left",
  "flip-from-right",
  "flip-from-top",
  "flip-from-bottom",
  "curl-up",
  "curl-down",
];

// 颜色选项
const backgroundColors = [
  "#000000",
  "#222222",
  "#444444",
  "#666666",
  "#888888",
  "#AAAAAA",
  "#CCCCCC",
  "#FFFFFF",
  "#FF5252",
  "#4CAF50",
  "#2196F3",
  "#FFC107",
];

// 示例组件：内容适配模式
const ContentFitExample = ({ colors }: { colors: any }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        内容适配模式 (contentFit)
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.contentFitCarousel}
      >
        {contentFitOptions.map((fit, index) => (
          <View key={index} style={styles.contentFitItem}>
            <Image
              source={SAMPLE_IMAGE_URL}
              style={styles.contentFitImage}
              contentFit={fit}
              cachePolicy="memory-disk"
              transition={500}
            />
            <Text style={[styles.contentFitLabel, { color: colors.text }]}>
              {fit}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// 示例组件：占位符效果
const PlaceholderExample = ({ colors }: { colors: any }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const reloadImage = () => {
    setLoaded(false);
    setImageKey((prev) => prev + 1);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          占位符效果 (blurhash)
        </Text>
        <TouchableOpacity onPress={reloadImage} style={styles.reloadButton}>
          <Ionicons name="refresh" size={20} color={colors.tint} />
        </TouchableOpacity>
      </View>
      <View style={styles.placeholderContainer}>
        <Image
          key={imageKey}
          source={
            SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)]
          }
          placeholder={{ blurhash: BLURHASH }}
          style={styles.placeholderImage}
          contentFit="cover"
          transition={1000}
          onLoad={() => setLoaded(true)}
        />
        <BlurView
          intensity={80}
          style={[styles.loadingOverlay, { opacity: loaded ? 0 : 1 }]}
          tint={colors.background === "#000000" ? "dark" : "light"}
        >
          <ActivityIndicator color={colors.tint} size="large" />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            加载中...
          </Text>
        </BlurView>
      </View>
    </View>
  );
};

// 示例组件：过渡效果
const TransitionExample = ({ colors }: { colors: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEffect, setTransitionEffect] =
    useState<ImageTransition["effect"]>("cross-dissolve");

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SAMPLE_IMAGES.length);
  };

  const nextEffect = () => {
    const currentIndex = transitionEffects.indexOf(transitionEffect);
    const nextIndex = (currentIndex + 1) % transitionEffects.length;
    setTransitionEffect(transitionEffects[nextIndex]);
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        过渡效果 (transition)
      </Text>
      <View style={styles.transitionContainer}>
        <TouchableOpacity onPress={nextImage} activeOpacity={0.8}>
          <Image
            source={SAMPLE_IMAGES[currentIndex]}
            style={styles.transitionImage}
            contentFit="cover"
            transition={{
              effect: transitionEffect,
              duration: 1000,
            }}
          />
        </TouchableOpacity>
        <View style={styles.transitionControls}>
          <Text style={[styles.controlText, { color: colors.text }]}>
            点击图片切换 | 当前效果: {transitionEffect}
          </Text>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.tint }]}
            onPress={nextEffect}
          >
            <Text style={styles.controlButtonText}>切换效果</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// 示例组件：背景色与模糊效果
const BackgroundExample = ({ colors }: { colors: any }) => {
  const [backgroundColor, setBackgroundColor] = useState("#222222");

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        背景色与模糊效果
      </Text>
      <View style={[styles.backgroundExample, { backgroundColor }]}>
        <Image
          source={SAMPLE_IMAGES[2]}
          style={styles.backgroundImage}
          contentFit="cover"
          blurRadius={backgroundColor === "#222222" ? 0 : 15}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.colorPicker}
      >
        {backgroundColors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              backgroundColor === color && styles.selectedColor,
            ]}
            onPress={() => setBackgroundColor(color)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default function ImageExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const router = useRouter();

  // 返回按钮处理函数
  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Expo Image 示例
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.secondaryAccent }]}>
            Expo Image
            是一个高性能的跨平台图片组件，支持多种格式、缓存策略和过渡效果
          </Text>
        </View>

        <ContentFitExample colors={colors} />
        <PlaceholderExample colors={colors} />
        <TransitionExample colors={colors} />
        <BackgroundExample colors={colors} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reloadButton: {
    padding: 8,
  },
  // 内容适配模式相关样式
  contentFitCarousel: {
    flexDirection: "row",
  },
  contentFitItem: {
    marginRight: 16,
    alignItems: "center",
  },
  contentFitImage: {
    width: 150,
    height: 150,
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  contentFitLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  // 占位符效果相关样式
  placeholderContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  // 过渡效果相关样式
  transitionContainer: {
    borderRadius: 8,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  transitionImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  transitionControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  controlText: {
    fontSize: 12,
  },
  controlButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  controlButtonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  // 背景色与模糊效果相关样式
  backgroundExample: {
    padding: 0,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  colorPicker: {
    flexDirection: "row",
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  // 内容位置相关样式
  positionContainer: {
    flexDirection: "row",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  positionImage: {
    width: 180,
    height: 180,
    backgroundColor: "#333",
    borderRadius: 8,
    overflow: "hidden",
  },
  positionGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 16,
    justifyContent: "space-between",
  },
  positionButton: {
    width: "30%",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 32,
  },
  positionButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
