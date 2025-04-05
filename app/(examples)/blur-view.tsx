import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Switch,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Colors from "@/constants/Colors";
import Slider from "@react-native-community/slider";

// 定义色调类型
type TintType =
  | "light"
  | "dark"
  | "default"
  | "extraLight"
  | "regular"
  | "prominent"
  | "systemUltraThinMaterial"
  | "systemThinMaterial"
  | "systemMaterial"
  | "systemThickMaterial"
  | "systemChromeMaterial"
  | "systemUltraThinMaterialLight"
  | "systemThinMaterialLight"
  | "systemMaterialLight"
  | "systemThickMaterialLight"
  | "systemChromeMaterialLight"
  | "systemUltraThinMaterialDark"
  | "systemThinMaterialDark"
  | "systemMaterialDark"
  | "systemThickMaterialDark"
  | "systemChromeMaterialDark";

// 定义实验方法类型
type ExperimentalMethodType = "none" | "dimezisBlurView";

export default function BlurViewExample() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  // 控制模糊强度
  const [intensity, setIntensity] = useState(50);

  // 控制模糊色调
  const [currentTint, setCurrentTint] = useState<TintType>("default");

  // 控制实验模糊方法 (Android)
  const [experimentalMethod, setExperimentalMethod] =
    useState<ExperimentalMethodType>("none");

  // 控制 Android 上的模糊减少因子
  const [blurReductionFactor, setBlurReductionFactor] = useState(4);

  // 控制是否显示选项设置面板
  const [showSettings, setShowSettings] = useState(false);

  // Android 实验性模糊是否启用
  const [androidBlurEnabled, setAndroidBlurEnabled] = useState(false);

  // 使用圆角
  const [useRadius, setUseRadius] = useState(true);

  // 返回按钮处理函数
  const handleBack = () => {
    router.back();
  };

  // 生成彩色背景盒子
  const renderColorBoxes = () => {
    return (
      <View style={styles.background}>
        {[...Array(20).keys()].map((i) => (
          <View
            key={`box-${i}`}
            style={[
              styles.box,
              {
                backgroundColor:
                  i % 2 === 0
                    ? colorScheme === "dark"
                      ? "#ff6347"
                      : "orangered"
                    : colorScheme === "dark"
                      ? "#ffd700"
                      : "gold",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  // 渲染设置面板
  const renderSettings = () => {
    return (
      <View style={[styles.settingsPanel, { backgroundColor: colors.card }]}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          模糊强度: {intensity}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={100}
          step={1}
          value={intensity}
          onValueChange={setIntensity}
          minimumTrackTintColor={colors.tint}
          maximumTrackTintColor={colors.tabIconDefault}
        />

        <Text style={[styles.settingTitle, { color: colors.text }]}>
          模糊色调
        </Text>
        <View style={styles.tintContainer}>
          {[
            "light",
            "dark",
            "default",
            "extraLight",
            "regular",
            "prominent",
          ].map((tint) => (
            <TouchableOpacity
              key={tint}
              style={[
                styles.tintButton,
                currentTint === tint && {
                  borderColor: colors.tint,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setCurrentTint(tint as TintType)}
            >
              <Text
                style={[
                  styles.tintText,
                  {
                    color:
                      tint === "dark"
                        ? "#fff"
                        : colorScheme === "dark"
                          ? "#fff"
                          : "#000",
                  },
                ]}
              >
                {tint}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {Platform.OS === "android" && (
          <>
            <View style={styles.androidSettings}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                启用 Android 实验性模糊
              </Text>
              <Switch
                value={androidBlurEnabled}
                onValueChange={(value) => {
                  setAndroidBlurEnabled(value);
                  setExperimentalMethod(value ? "dimezisBlurView" : "none");
                }}
                trackColor={{ false: "#767577", true: colors.tint }}
                thumbColor={androidBlurEnabled ? "#fff" : "#f4f3f4"}
              />
            </View>

            {androidBlurEnabled && (
              <>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  模糊减少因子: {blurReductionFactor}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={blurReductionFactor}
                  onValueChange={setBlurReductionFactor}
                  minimumTrackTintColor={colors.tint}
                  maximumTrackTintColor={colors.tabIconDefault}
                />
              </>
            )}
          </>
        )}

        <View style={styles.androidSettings}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            使用圆角 (overflow: hidden)
          </Text>
          <Switch
            value={useRadius}
            onValueChange={setUseRadius}
            trackColor={{ false: "#767577", true: colors.tint }}
            thumbColor={useRadius ? "#fff" : "#f4f3f4"}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          模糊视图 (BlurView)
        </Text>
        <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
          <Ionicons
            name={showSettings ? "settings" : "settings-outline"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {showSettings && renderSettings()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.description, { color: colors.text }]}>
          BlurView 是一个能够模糊其底层内容的 React
          组件。常用于导航栏、标签栏和模态框等。
          {Platform.OS === "android" &&
            "\n\n注意：Android 上的 BlurView 是一个实验性功能。"}
        </Text>

        <View style={styles.demoContainer}>
          {renderColorBoxes()}

          <BlurView
            intensity={intensity}
            tint={currentTint}
            experimentalBlurMethod={experimentalMethod}
            blurReductionFactor={blurReductionFactor}
            style={[styles.blurContainer, useRadius && styles.withRadius]}
          >
            <Text
              style={[
                styles.blurText,
                {
                  color:
                    currentTint.includes("Dark") || currentTint === "dark"
                      ? "#fff"
                      : colors.text,
                },
              ]}
            >
              当前强度: {intensity}
              {"\n"}
              当前色调: {currentTint}
              {Platform.OS === "android" &&
                androidBlurEnabled &&
                `\n减少因子: ${blurReductionFactor}`}
            </Text>
          </BlurView>

          <View style={styles.blurExamplesContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              不同强度对比
            </Text>

            <View style={styles.blurRow}>
              <BlurView
                intensity={25}
                tint={currentTint}
                experimentalBlurMethod={experimentalMethod}
                blurReductionFactor={blurReductionFactor}
                style={[styles.smallBlur, useRadius && styles.withRadius]}
              >
                <Text style={styles.smallBlurText}>强度: 25</Text>
              </BlurView>

              <BlurView
                intensity={50}
                tint={currentTint}
                experimentalBlurMethod={experimentalMethod}
                blurReductionFactor={blurReductionFactor}
                style={[styles.smallBlur, useRadius && styles.withRadius]}
              >
                <Text style={styles.smallBlurText}>强度: 50</Text>
              </BlurView>

              <BlurView
                intensity={100}
                tint={currentTint}
                experimentalBlurMethod={experimentalMethod}
                blurReductionFactor={blurReductionFactor}
                style={[styles.smallBlur, useRadius && styles.withRadius]}
              >
                <Text style={styles.smallBlurText}>强度: 100</Text>
              </BlurView>
            </View>
          </View>
        </View>

        <View style={styles.tipContainer}>
          <Text style={[styles.tipTitle, { color: colors.text }]}>
            使用技巧:
          </Text>
          <Text style={[styles.tipText, { color: colors.text }]}>
            1. 使用 intensity 属性 (1-100) 控制模糊强度。{"\n"}
            2. 使用 tint 属性设置色调 (light, dark, default 等)。{"\n"}
            3. 在 Android 上启用实验性支持使用 experimentalBlurMethod 属性。
            {"\n"}
            4. 使用 blurReductionFactor 调整 Android 上的模糊强度。{"\n"}
            5. 需要圆角效果时，添加 overflow: 'hidden' 样式。{"\n"}
            6. 当使用 FlatList 等动态内容时，应确保 BlurView 渲染在其后面。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: Platform.OS === "ios" ? 0 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  demoContainer: {
    height: 400,
    position: "relative",
    marginBottom: 20,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  box: {
    width: "25%",
    height: "20%",
  },
  blurContainer: {
    padding: 20,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    marginTop: 32,
  },
  withRadius: {
    borderRadius: 20,
    overflow: "hidden",
  },
  blurText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  blurExamplesContainer: {
    marginTop: 100,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  blurRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallBlur: {
    width: "30%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  smallBlurText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  tipContainer: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
  },
  settingsPanel: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  tintContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tintButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 4,
    backgroundColor: "rgba(128,128,128,0.15)",
  },
  tintText: {
    fontSize: 12,
  },
  androidSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
});
