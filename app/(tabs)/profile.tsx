import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// 用户数据
const USER_DATA = {
  name: "开发者",
  username: "@developer",
  avatar: "https://picsum.photos/200/200?random=1",
  bio: "React Native & Expo 开发爱好者，喜欢尝试各种新的API和组件。",
};

// 设置项
const SETTINGS = [
  {
    id: "theme",
    title: "切换主题",
    icon: "color-palette-outline",
    color: "#9C27B0",
  },
  {
    id: "language",
    title: "语言设置",
    icon: "language-outline",
    color: "#2196F3",
  },
  {
    id: "notifications",
    title: "通知设置",
    icon: "notifications-outline",
    color: "#FF9800",
  },
  {
    id: "about",
    title: "关于应用",
    icon: "information-circle-outline",
    color: "#4CAF50",
  },
];

// 模拟收藏品数据
const COLLECTIONS = [
  {
    id: "coll-1",
    name: "我的创作",
    items: 47,
    thumbnail: "https://picsum.photos/150/150?random=10",
  },
  {
    id: "coll-2",
    name: "收藏品",
    items: 128,
    thumbnail: "https://picsum.photos/150/150?random=11",
  },
  {
    id: "coll-3",
    name: "喜欢的",
    items: 215,
    thumbnail: "https://picsum.photos/150/150?random=12",
  },
];

// 模拟活动数据
const ACTIVITIES = [
  {
    id: "act-1",
    type: "purchase",
    title: "你购买了 Crypto Punk #5123",
    time: "2小时前",
    icon: "cart-outline",
  },
  {
    id: "act-2",
    type: "sale",
    title: "你的 Bored Ape #3211 已售出",
    time: "昨天",
    icon: "cash-outline",
  },
  {
    id: "act-3",
    type: "mint",
    title: "你铸造了新的 NFT",
    time: "2天前",
    icon: "create-outline",
  },
  {
    id: "act-4",
    type: "bid",
    title: "有人对你的 CryptoPunk #7804 出价",
    time: "3天前",
    icon: "trending-up-outline",
  },
];

const ProfileStat = ({ label, value }: { label: string; value: number }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.text }]}>
        {value.toLocaleString()}
      </Text>
      <Text style={[styles.statLabel, { color: colors.secondaryAccent }]}>
        {label}
      </Text>
    </View>
  );
};

const CollectionCard = ({
  item,
  index,
}: {
  item: (typeof COLLECTIONS)[0];
  index: number;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={SlideInRight.delay(index * 200).springify()}
      style={styles.collectionCardContainer}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.collectionCard,
            { backgroundColor: colors.card },
            animatedStyle,
          ]}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.collectionImage}
            contentFit="cover"
            transition={200}
          />
          <BlurView
            tint={colorScheme === "dark" ? "dark" : "light"}
            intensity={80}
            style={styles.collectionInfo}
          >
            <Text
              style={[styles.collectionName, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.collectionItems,
                { color: colors.secondaryAccent },
              ]}
            >
              {item.items} 项目
            </Text>
          </BlurView>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ActivityItem = ({
  item,
  index,
}: {
  item: (typeof ACTIVITIES)[0];
  index: number;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100)}
      style={[styles.activityItem, { borderBottomColor: colors.border }]}
    >
      <View
        style={[styles.activityIconContainer, { backgroundColor: colors.card }]}
      >
        <Ionicons
          name={item.icon as any}
          size={18}
          color={colors.primaryAccent}
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.activityTime, { color: colors.secondaryAccent }]}>
          {item.time}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.secondaryAccent}
      />
    </Animated.View>
  );
};

// 设置项组件
const SettingItem = ({ item }: { item: (typeof SETTINGS)[0] }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
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
            source={{ uri: USER_DATA.avatar }}
            style={styles.avatar}
            contentFit="cover"
            transition={300}
          />
          <Text style={[styles.name, { color: colors.text }]}>
            {USER_DATA.name}
          </Text>
          <Text style={[styles.username, { color: colors.secondaryAccent }]}>
            {USER_DATA.username}
          </Text>
          <Text style={[styles.bio, { color: colors.text }]}>
            {USER_DATA.bio}
          </Text>
        </Animated.View>

        {/* 统计信息 */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>28</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryAccent }]}>
              已测试API
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>15</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryAccent }]}>
              收藏示例
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryAccent }]}>
              自建项目
            </Text>
          </View>
        </View>

        {/* 设置列表 */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            设置
          </Text>
          <View style={[styles.settingsList, { backgroundColor: colors.card }]}>
            {SETTINGS.map((item) => (
              <SettingItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* 退出按钮 */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.card }]}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          <Text style={[styles.logoutText, { color: "#FF5252" }]}>
            退出登录
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
