import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// 介绍区域组件
const IntroductionSection = ({ colors }: { colors: any }) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        什么是触觉反馈？
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.normalText, { color: colors.text }]}>
          触觉反馈(Haptics)是通过震动提供触觉信息的技术，为用户交互提供额外的感官反馈。
        </Text>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            使界面交互更加真实自然
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            增强用户操作的物理感知
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            为重要操作提供额外确认
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.noteText, { color: colors.secondaryAccent }]}>
          在iOS设备上，触觉反馈由Taptic
          Engine提供，而Android则使用Vibrator系统服务。
        </Text>
        <Text style={[styles.noteText, { color: colors.secondaryAccent }]}>
          注意：低电量模式下或用户在设置中禁用触觉引擎时，iOS设备上的触觉反馈可能不会生效。
        </Text>
      </View>
    </View>
  );
};

// 基本触觉反馈示例
const BasicHapticsSection = ({ colors }: { colors: any }) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        基本触觉类型
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>选择反馈</Text>
        <Text
          style={[styles.cardDescription, { color: colors.secondaryAccent }]}
        >
          最轻微的触觉反馈，用于表示选择变化
        </Text>

        <TouchableOpacity
          style={[styles.hapticsButton, { backgroundColor: colors.tint }]}
          onPress={() => Haptics.selectionAsync()}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>尝试选择反馈</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subSectionTitle}>
        <Text style={[styles.subTitle, { color: colors.text }]}>通知反馈</Text>
        <Text
          style={[styles.subDescription, { color: colors.secondaryAccent }]}
        >
          用于表示操作的结果状态（成功、警告、错误）
        </Text>
      </View>

      <View style={styles.hapticsRow}>
        <TouchableOpacity
          style={[styles.hapticsCard, { backgroundColor: colors.card }]}
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: "#4CAF50" }]}>
            <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.hapticsTitle, { color: colors.text }]}>
            成功
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.hapticsCard, { backgroundColor: colors.card }]}
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          }
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: "#FFC107" }]}>
            <Ionicons name="warning" size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.hapticsTitle, { color: colors.text }]}>
            警告
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.hapticsCard, { backgroundColor: colors.card }]}
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
          }
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: "#F44336" }]}>
            <Ionicons name="close-circle" size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.hapticsTitle, { color: colors.text }]}>
            错误
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subSectionTitle}>
        <Text style={[styles.subTitle, { color: colors.text }]}>撞击反馈</Text>
        <Text
          style={[styles.subDescription, { color: colors.secondaryAccent }]}
        >
          模拟不同强度和质感的物理撞击
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.impactContainer}
      >
        <TouchableOpacity
          style={[styles.impactCard, { backgroundColor: colors.card }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          activeOpacity={0.7}
        >
          <Text style={[styles.impactTitle, { color: colors.text }]}>轻度</Text>
          <Text
            style={[
              styles.impactDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            轻微的物理撞击
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.impactCard, { backgroundColor: colors.card }]}
          onPress={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          }
          activeOpacity={0.7}
        >
          <Text style={[styles.impactTitle, { color: colors.text }]}>中度</Text>
          <Text
            style={[
              styles.impactDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            中等强度的撞击
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.impactCard, { backgroundColor: colors.card }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
          activeOpacity={0.7}
        >
          <Text style={[styles.impactTitle, { color: colors.text }]}>重度</Text>
          <Text
            style={[
              styles.impactDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            较强的物理撞击
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.impactCard, { backgroundColor: colors.card }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)}
          activeOpacity={0.7}
        >
          <Text style={[styles.impactTitle, { color: colors.text }]}>刚性</Text>
          <Text
            style={[
              styles.impactDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            坚硬物体的撞击
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.impactCard, { backgroundColor: colors.card }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)}
          activeOpacity={0.7}
        >
          <Text style={[styles.impactTitle, { color: colors.text }]}>柔软</Text>
          <Text
            style={[
              styles.impactDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            柔软物体的撞击
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// 实用场景展示
const PracticalExamplesSection = ({ colors }: { colors: any }) => {
  // 开关状态
  const [switchEnabled, setSwitchEnabled] = useState(false);

  // 动画值
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  // 处理开关切换
  const handleToggleSwitch = () => {
    // 触发撞击反馈
    Haptics.impactAsync(
      switchEnabled
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium,
    );
    setSwitchEnabled((previousState) => !previousState);
  };

  // 处理滑块拖动
  const handleSliderPress = (value: number) => {
    // 触发选择反馈
    Haptics.selectionAsync();
    progress.value = withSpring(value);
  };

  // 提交表单
  const handleSubmit = () => {
    // 触发成功通知反馈
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        实际应用场景
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>开关控件</Text>
        <Text
          style={[styles.cardDescription, { color: colors.secondaryAccent }]}
        >
          切换开关时提供不同的触觉反馈
        </Text>

        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            {switchEnabled ? "已启用" : "已禁用"}
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: colors.tint }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleSwitch}
            value={switchEnabled}
          />
        </View>
      </View>

      <View
        style={[styles.card, { backgroundColor: colors.card, marginTop: 16 }]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          自定义滑块
        </Text>
        <Text
          style={[styles.cardDescription, { color: colors.secondaryAccent }]}
        >
          拖动滑块时触发选择反馈
        </Text>

        <View style={styles.sliderContainer}>
          <View
            style={[
              styles.sliderTrack,
              { backgroundColor: colors.secondaryAccent + "40" },
            ]}
          >
            <Animated.View
              style={[
                styles.sliderFill,
                { backgroundColor: colors.tint },
                animatedStyle,
              ]}
            />
          </View>

          <View style={styles.sliderSteps}>
            {[0, 0.25, 0.5, 0.75, 1].map((value) => (
              <TouchableOpacity
                key={value}
                style={styles.sliderStep}
                onPress={() => handleSliderPress(value)}
              >
                <View
                  style={[
                    styles.sliderDot,
                    {
                      backgroundColor:
                        progress.value >= value
                          ? colors.tint
                          : colors.secondaryAccent + "40",
                      transform: [
                        { scale: progress.value === value ? 1.2 : 1 },
                      ],
                    },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View
        style={[styles.card, { backgroundColor: colors.card, marginTop: 16 }]}
      >
        <Text style={[styles.cardTitle, { color: colors.text }]}>表单提交</Text>
        <Text
          style={[styles.cardDescription, { color: colors.secondaryAccent }]}
        >
          提交表单后触发成功反馈
        </Text>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.tint }]}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>提交表单</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 主组件
export default function HapticsExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const router = useRouter();

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
          触觉反馈
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <IntroductionSection colors={colors} />
        <BasicHapticsSection colors={colors} />
        <PracticalExamplesSection colors={colors} />
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  normalText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 12,
  },
  noteText: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
  },
  hapticsButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  buttonIcon: {
    marginRight: 6,
  },
  subSectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subDescription: {
    fontSize: 14,
  },
  hapticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  hapticsCard: {
    flex: 0.32,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  hapticsTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  impactContainer: {
    paddingVertical: 8,
  },
  impactCard: {
    width: 120,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  impactDescription: {
    fontSize: 12,
  },
  // 开关样式
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  // 滑块样式
  sliderContainer: {
    marginVertical: 12,
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    width: "100%",
    marginBottom: 16,
  },
  sliderFill: {
    height: 8,
    borderRadius: 4,
  },
  sliderSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sliderStep: {
    padding: 8,
  },
  sliderDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  // 提交按钮样式
  submitButton: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
