import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useI18n } from "@/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// 设置项
const SETTINGS = [
  {
    id: "language",
    title: "语言设置",
    icon: "language-outline",
    color: "#2196F3",
  },
];

// 用于存储国际化后的设置项
const getSettings = (t: any) => [
  {
    id: "language",
    title: t("profile.settings.language"),
    icon: "language-outline",
    color: "#2196F3",
  },
];

// 设置项组件
const SettingItem = ({
  item,
  onPress,
}: {
  item: (typeof SETTINGS)[0];
  onPress?: () => void;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View
        style={[styles.settingIconContainer, { backgroundColor: item.color }]}
      >
        <Ionicons name={item.icon as any} size={20} color="#FFFFFF" />
      </View>
      <Text style={[styles.settingTitle, { color: colors.text }]}>
        {item.title}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.secondaryAccent}
      />
    </TouchableOpacity>
  );
};

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const { t } = useI18n();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // 获取国际化后的设置项
  const localizedSettings = getSettings(t);

  // 处理设置项点击
  const handleSettingPress = (id: string) => {
    if (id === "language") {
      setLanguageModalVisible(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 个人信息头部 */}
        <Animated.View
          entering={FadeIn.duration(800)}
          style={styles.profileHeader}
        >
          <Image
            source={{ uri: "https://picsum.photos/200/200?random=1" }}
            style={styles.avatar}
            contentFit="cover"
            transition={300}
          />
          <Text style={[styles.name, { color: colors.text }]}>
            {t("profile.name")}
          </Text>
          <Text style={[styles.username, { color: colors.secondaryAccent }]}>
            {t("profile.username")}
          </Text>
          <Text style={[styles.bio, { color: colors.text }]}>
            {t("profile.bio")}
          </Text>
        </Animated.View>

        {/* 统计信息 */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>28</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryAccent }]}>
              {t("profile.stats.testedApis")}
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>15</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryAccent }]}>
              {t("profile.stats.savedExamples")}
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryAccent }]}>
              {t("profile.stats.ownProjects")}
            </Text>
          </View>
        </View>

        {/* 设置列表 */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("profile.settings.title")}
          </Text>
          <View style={[styles.settingsList, { backgroundColor: colors.card }]}>
            {localizedSettings.map((item) => (
              <SettingItem
                key={item.id}
                item={item}
                onPress={() => handleSettingPress(item.id)}
              />
            ))}
          </View>
        </View>

        {/* 退出按钮 */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.card }]}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          <Text style={[styles.logoutText, { color: "#FF5252" }]}>
            {t("profile.logout")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 语言切换器 */}
      <LanguageSwitcher
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    marginBottom: 12,
  },
  bio: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  settingsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  settingsList: {
    borderRadius: 16,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionAction: {
    fontSize: 14,
  },
  collectionsContainer: {
    paddingRight: 16,
  },
  collectionCardContainer: {
    marginRight: 12,
  },
  collectionCard: {
    width: 150,
    height: 170,
    borderRadius: 12,
    overflow: "hidden",
  },
  collectionImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  collectionInfo: {
    padding: 10,
    height: 50,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  collectionItems: {
    fontSize: 12,
  },
  activitiesContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
});
