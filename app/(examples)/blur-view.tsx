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
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Colors from "@/constants/Colors";
import Slider from "@react-native-community/slider";
import { useI18n } from "@/i18n";

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
  const { t } = useI18n();

  // 控制模糊强度
  const [intensity, setIntensity] = useState(40);

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

  // 选择色调
  const selectTint = (selectedTint: TintType) => {
    setCurrentTint(selectedTint);
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
          {t("blurView.intensity")}: {intensity}
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
          {t("blurView.tintMode")}
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
              onPress={() => selectTint(tint as TintType)}
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
                {t("blurView.androidBlurToggle")}
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
                  {t("blurView.blurReductionFactor")}: {blurReductionFactor}
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
            {t("blurView.useRadius")} (overflow: hidden)
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
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.borderBottom,
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t("blurView.title")}
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
          {t("blurView.info")}
          {Platform.OS === "android" && "\n\n" + t("blurView.androidNote")}
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
              {t("blurView.blurredContent")}
            </Text>
          </BlurView>

          <View style={styles.blurExamplesContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t("blurView.differentIntensities")}
            </Text>

            <View style={styles.blurRow}>
              <BlurView
                intensity={25}
                tint={currentTint}
                experimentalBlurMethod={experimentalMethod}
                blurReductionFactor={blurReductionFactor}
                style={[styles.smallBlur, useRadius && styles.withRadius]}
              >
                <Text style={styles.smallBlurText}>
                  {t("blurView.intensity25")}
                </Text>
              </BlurView>

              <BlurView
                intensity={50}
                tint={currentTint}
                experimentalBlurMethod={experimentalMethod}
                blurReductionFactor={blurReductionFactor}
                style={[styles.smallBlur, useRadius && styles.withRadius]}
              >
                <Text style={styles.smallBlurText}>
                  {t("blurView.intensity50")}
                </Text>
              </BlurView>

              <BlurView
                intensity={100}
                tint={currentTint}
                experimentalBlurMethod={experimentalMethod}
                blurReductionFactor={blurReductionFactor}
                style={[styles.smallBlur, useRadius && styles.withRadius]}
              >
                <Text style={styles.smallBlurText}>
                  {t("blurView.intensity100")}
                </Text>
              </BlurView>
            </View>
          </View>
        </View>

        <View style={styles.tipContainer}>
          <Text style={[styles.tipTitle, { color: colors.text }]}>
            {t("blurView.tipsTitle")}
          </Text>
          <Text style={[styles.tipText, { color: colors.text }]}>
            {t("blurView.tip1")}
          </Text>
          <Text style={[styles.tipText, { color: colors.text }]}>
            {t("blurView.tip2")}
          </Text>
          <Text style={[styles.tipText, { color: colors.text }]}>
            {t("blurView.tip3")}
          </Text>
          <Text style={[styles.tipText, { color: colors.text }]}>
            {t("blurView.tip4")}
          </Text>
          <Text style={[styles.tipText, { color: colors.text }]}>
            {t("blurView.tip5")}
          </Text>
          <Text style={[styles.tipText, { color: colors.text }]}>
            {t("blurView.tip6")}
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
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
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
