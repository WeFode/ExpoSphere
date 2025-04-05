import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Switch,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  useAnimatedScrollHandler,
  SlideInRight,
  FadeIn,
  ZoomIn,
  FlipInEasyX,
  Layout,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// 基础动画示例
const BasicAnimationExample = ({ colors }: { colors: any }) => {
  const [expanded, setExpanded] = useState(false);
  const boxWidth = useSharedValue(100);
  const borderRadius = useSharedValue(8);
  const backgroundColor = useSharedValue(colors.card);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    boxWidth.value = withSpring(expanded ? 100 : width - 64);
    borderRadius.value = withSpring(expanded ? 8 : 24);
    backgroundColor.value = expanded ? colors.card : colors.tint;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: boxWidth.value,
      borderRadius: borderRadius.value,
      backgroundColor: backgroundColor.value,
    };
  });

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        基础动画 (Basic)
      </Text>
      <View style={styles.demoContainer}>
        <TouchableOpacity onPress={toggleExpanded} activeOpacity={1}>
          <Animated.View style={[styles.animatedBox, animatedStyle]}>
            <Text style={[styles.boxText, { color: "#ffffff" }]}>
              {expanded ? "点击收起" : "点击展开"}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
      <Text
        style={[styles.sectionDescription, { color: colors.secondaryAccent }]}
      >
        使用withSpring实现弹性动画效果
      </Text>
    </View>
  );
};

// 序列动画示例
const SequenceAnimationExample = ({ colors }: { colors: any }) => {
  const offset = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAnimation = () => {
    if (isPlaying) return;

    setIsPlaying(true);

    // 重置动画
    offset.value = 0;
    rotation.value = 0;
    scale.value = 1;

    // 序列动画
    offset.value = withSequence(
      withTiming(100, { duration: 500 }),
      withTiming(-100, { duration: 500 }),
      withSpring(0),
    );

    rotation.value = withSequence(
      withDelay(500, withTiming(Math.PI * 2, { duration: 1000 })),
      withTiming(0, { duration: 500 }),
    );

    scale.value = withSequence(
      withDelay(1500, withTiming(1.5, { duration: 500 })),
      withTiming(1, { duration: 500 }),
    );

    // 动画结束后重置状态
    setTimeout(() => {
      setIsPlaying(false);
    }, 2500);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value },
        { rotate: `${rotation.value}rad` },
        { scale: scale.value },
      ],
      backgroundColor: isPlaying ? colors.tint : colors.card,
    };
  });

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        序列动画 (Sequence)
      </Text>
      <View style={styles.demoContainer}>
        <Animated.View style={[styles.animatedSquare, animatedStyle]} />
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: colors.tint }]}
          onPress={playAnimation}
          disabled={isPlaying}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? "播放中..." : "播放动画"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={[styles.sectionDescription, { color: colors.secondaryAccent }]}
      >
        使用withSequence和withDelay组合多个动画
      </Text>
    </View>
  );
};

// 重复动画示例
const RepeatAnimationExample = ({ colors }: { colors: any }) => {
  const [isActive, setIsActive] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      // 旋转动画
      rotation.value = withRepeat(
        withTiming(2 * Math.PI, { duration: 2000 }),
        -1, // -1表示无限重复
        false, // false表示不反向
      );

      // 缩放和透明度动画
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(0.8, { duration: 1000 }),
        ),
        -1,
        true, // true表示反向
      );

      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1000 }),
          withTiming(1, { duration: 1000 }),
        ),
        -1,
        true,
      );
    } else {
      // 停止动画
      rotation.value = withTiming(0);
      scale.value = withTiming(1);
      opacity.value = withTiming(1);
    }
  }, [isActive, opacity, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}rad` }, { scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        重复动画 (Repeat)
      </Text>
      <View style={styles.demoContainer}>
        <Animated.View
          style={[
            styles.repeatAnimationCircle,
            { backgroundColor: colors.tint },
            animatedStyle,
          ]}
        />
        <View style={styles.switchContainer}>
          <Text style={{ color: colors.text, marginRight: 8 }}>启用动画</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: "#767577", true: colors.tint }}
            thumbColor={isActive ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      </View>
      <Text
        style={[styles.sectionDescription, { color: colors.secondaryAccent }]}
      >
        使用withRepeat实现循环动画效果
      </Text>
    </View>
  );
};

// 内置动画示例
const BuiltInAnimationExample = ({ colors }: { colors: any }) => {
  const [items, setItems] = useState([0, 1, 2]);
  const [key, setKey] = useState(3);

  const addItem = () => {
    setItems([...items, key]);
    setKey(key + 1);
  };

  const removeItem = () => {
    if (items.length > 0) {
      const newItems = [...items];
      newItems.pop();
      setItems(newItems);
    }
  };

  const renderItem = (item: number, index: number) => {
    const entranceAnimations = [SlideInRight, FadeIn, ZoomIn, FlipInEasyX];

    const AnimationType = entranceAnimations[index % entranceAnimations.length];

    return (
      <Animated.View
        key={item}
        entering={AnimationType.duration(800).delay(index * 100)}
        exiting={AnimationType.duration(400)}
        layout={Layout.springify()}
        style={[styles.animationListItem, { backgroundColor: colors.tint }]}
      >
        <Text style={styles.animationListItemText}>{item}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        内置动画 (Built-in)
      </Text>
      <View style={styles.demoContainer}>
        <View style={styles.animationListContainer}>
          {items.map((item, index) => renderItem(item, index))}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={addItem}
          >
            <Text style={styles.buttonText}>添加</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondaryAccent }]}
            onPress={removeItem}
          >
            <Text style={styles.buttonText}>移除</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={[styles.sectionDescription, { color: colors.secondaryAccent }]}
      >
        使用内置动画和Layout进行列表过渡
      </Text>
    </View>
  );
};

// 滚动动画示例
const ScrollAnimationExample = ({ colors }: { colors: any }) => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const generateBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [(i - 1) * 60, i * 60, (i + 1) * 60];
        const scale = interpolate(scrollY.value, inputRange, [0.8, 1.2, 0.8], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const rotate = interpolate(scrollY.value, inputRange, [-15, 0, 15], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const opacity = interpolate(scrollY.value, inputRange, [0.5, 1, 0.5], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return {
          transform: [{ scale }, { rotate: `${rotate}deg` }],
          opacity,
        };
      });

      boxes.push(
        <Animated.View
          key={i}
          style={[
            styles.scrollBox,
            { backgroundColor: colors.tint },
            animatedStyle,
          ]}
        >
          <Text style={styles.scrollBoxText}>{i + 1}</Text>
        </Animated.View>,
      );
    }
    return boxes;
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        滚动动画 (Scroll)
      </Text>
      <Text
        style={[styles.sectionDescription, { color: colors.secondaryAccent }]}
      >
        尝试上下滚动查看效果
      </Text>
      <View style={styles.scrollAnimationContainer}>
        <Animated.ScrollView
          style={styles.scrollAnimationArea}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollAnimationContent}
          showsVerticalScrollIndicator={false}
        >
          {generateBoxes()}
        </Animated.ScrollView>
      </View>
    </View>
  );
};

// 主组件
export default function AnimationExample() {
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
          动画效果示例
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
            Reanimated
            是一个声明式动画库，能够创建流畅、高性能的动画，下面展示了各种常用的动画效果。
          </Text>
        </View>

        <BasicAnimationExample colors={colors} />
        <SequenceAnimationExample colors={colors} />
        <RepeatAnimationExample colors={colors} />
        <BuiltInAnimationExample colors={colors} />
        <ScrollAnimationExample colors={colors} />
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
    marginTop: 10,
    lineHeight: 18,
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
  animatedBox: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
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
  animatedSquare: {
    width: 80,
    height: 80,
    backgroundColor: "#3498db",
    borderRadius: 8,
    marginBottom: 20,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  playButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  playButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  interpolationBox: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  tapHint: {
    fontSize: 14,
    marginTop: 10,
  },
  repeatAnimationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  animationListContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  animationListItem: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  animationListItemText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  scrollAnimationContainer: {
    height: 300,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  scrollAnimationArea: {
    flex: 1,
  },
  scrollAnimationContent: {
    paddingVertical: 20,
    alignItems: "center",
  },
  scrollBox: {
    width: 150,
    height: 50,
    borderRadius: 8,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollBoxText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});
