import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

// 组件列表数据
const COMPONENTS = [
  {
    id: "verification-code-input",
    name: "验证码输入框",
    description: "验证码输入组件，支持自动聚焦和完成回调",
    icon: "keypad-outline",
  },
];

export default function ComponentsPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  const handleComponentPress = (componentId: string) => {
    router.push(`/(components)/${componentId}` as any);
  };

  const renderComponentItem = ({ item }: { item: (typeof COMPONENTS)[0] }) => (
    <TouchableOpacity
      style={[styles.componentItem, { backgroundColor: colors.card }]}
      onPress={() => handleComponentPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon as any} size={24} color={colors.tint} />
      </View>
      <View style={styles.componentInfo}>
        <Text style={[styles.componentName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text
          style={[
            styles.componentDescription,
            { color: colors.secondaryAccent },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.border} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>组件库</Text>
      <Text style={[styles.subheader, { color: colors.secondaryAccent }]}>
        选择一个组件进行查看
      </Text>

      <FlatList
        data={COMPONENTS}
        renderItem={renderComponentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  componentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    marginRight: 12,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  componentDescription: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginVertical: 8,
    opacity: 0.2,
  },
});
