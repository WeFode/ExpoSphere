import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  GestureDetector,
  Gesture,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  withSequence,
  interpolateColor,
  useAnimatedGestureHandler,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// 拖拽示例
const DragExample = ({ colors }: { colors: any }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isActive.value = true;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      isActive.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(isActive.value ? 1.1 : 1) },
      ],
      backgroundColor: isActive.value ? colors.tint : colors.card,
    };
  });

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        拖拽手势 (Pan)
      </Text>
      <View style={styles.demoContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.dragBox, animatedStyle]}>
            <Text style={[styles.boxText, { color: "#ffffff" }]}>拖动我</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

// 多点触控示例
const PinchExample = ({ colors }: { colors: any }) => {
  const scale = useSharedValue(1);

  const pinchRef = useRef(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        缩放手势 (Pinch)
      </Text>
      <View style={styles.demoContainer}>
        <PinchGestureHandler ref={pinchRef}>
          <Animated.Image
            source={{ uri: "https://picsum.photos/400/400?random=2" }}
            style={[styles.pinchImage, animatedStyle]}
            resizeMode="contain"
          />
        </PinchGestureHandler>
      </View>
    </View>
  );
};

// 双击示例
const DoubleTapExample = ({ colors }: { colors: any }) => {
  const [tapped, setTapped] = useState(false);
  const scale = useSharedValue(1);

  const onDoubleTap = () => {
    setTapped(!tapped);
    scale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(onDoubleTap)();
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: tapped ? colors.tint : colors.card,
    };
  });

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        双击手势 (Double Tap)
      </Text>
      <View style={styles.demoContainer}>
        <GestureDetector gesture={doubleTapGesture}>
          <Animated.View style={[styles.tapBox, animatedStyle]}>
            <Text
              style={[
                styles.boxText,
                { color: tapped ? "#ffffff" : colors.text },
              ]}
            >
              双击我
            </Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

// 长按示例
const LongPressExample = ({ colors }: { colors: any }) => {
  const longPressProgress = useSharedValue(0);
  const longPressActive = useSharedValue(false);

  const onLongPress = (state: State) => {
    if (state === State.ACTIVE) {
      Alert.alert("触发长按", "长按手势被识别！");
    }
  };

  const longPressGesture = Gesture.LongPress()
    .minDuration(1000)
    .onBegin(() => {
      longPressActive.value = true;
      longPressProgress.value = withTiming(1, { duration: 1000 });
    })
    .onFinalize(() => {
      longPressActive.value = false;
      longPressProgress.value = withTiming(0, { duration: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: longPressActive.value ? colors.tint : colors.border,
      borderWidth: withSpring(longPressActive.value ? 3 : 1),
      transform: [{ scale: withSpring(longPressActive.value ? 0.95 : 1) }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${longPressProgress.value * 100}%`,
      backgroundColor: interpolateColor(
        longPressProgress.value,
        [0, 1],
        ["#cccccc", colors.tint],
      ),
    };
  });

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        长按手势 (Long Press)
      </Text>
      <View style={styles.demoContainer}>
        <GestureDetector gesture={longPressGesture}>
          <Animated.View style={[styles.longPressBox, animatedStyle]}>
            <Animated.View style={[styles.progressBar, progressStyle]} />
            <Text style={[styles.boxText, { color: colors.text }]}>长按我</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

// 主组件
export default function GesturesExample() {
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
          手势交互示例
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
            React Native Gesture Handler
            提供了一套处理触摸手势的API，基于原生平台能力构建，性能更好、更加灵活。
          </Text>
        </View>

        <DragExample colors={colors} />
        <PinchExample colors={colors} />
        <DoubleTapExample colors={colors} />
        <LongPressExample colors={colors} />
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
    paddingTop: Platform.OS === "ios" ? 48 : 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  demoContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.03)",
    overflow: "hidden",
    padding: 16,
  },
  dragBox: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tapBox: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  longPressBox: {
    width: 180,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: 0,
    opacity: 0.3,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
  },
  pinchImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  swipeCard: {
    flexDirection: "row",
    width: width - 64,
    height: 80,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  swipeIcon: {
    opacity: 0.6,
  },
});
