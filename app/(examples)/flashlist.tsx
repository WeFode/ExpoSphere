import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Swipeable, RectButton } from "react-native-gesture-handler";

// 生成示例数据
const generateListData = (count: number, startFrom = 0) => {
  return Array.from({ length: count }, (_, i) => {
    const id = startFrom + i + 1;
    return {
      id: `item-${id}`,
      title: `项目 ${id}`,
      description: `这是关于项目 ${id} 的一些描述文本，可以看到FlashList的性能非常好`,
    };
  });
};

type ListItem = {
  id: string;
  title: string;
  description: string;
};

// 右侧操作按钮
const renderRightActions = (
  progress: any,
  dragX: any,
  onDelete: () => void,
  colors: any,
) => {
  return (
    <View style={styles.rightActions}>
      <RectButton style={[styles.deleteButton]} onPress={onDelete}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.actionText}>删除</Text>
      </RectButton>
    </View>
  );
};

// 列表项组件
const ListItemCard = ({
  item,
  index,
  onDelete,
}: {
  item: ListItem;
  index: number;
  onDelete: (id: string) => void;
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
    Alert.alert("确认删除", `确定要删除 ${item.title} 吗?`, [
      { text: "取消", style: "cancel" },
      { text: "删除", onPress: () => onDelete(item.id), style: "destructive" },
    ]);
  };

  return (
    <Animated.View entering={FadeInRight.delay((index % 20) * 20).springify()}>
      <Swipeable
        ref={swipeableRef}
        friction={2}
        leftThreshold={80}
        rightThreshold={40}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, handleDelete, colors)
        }
      >
        <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.secondaryAccent}
              />
            </View>
            <Text
              style={[
                styles.itemDescription,
                { color: colors.secondaryAccent },
              ]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  );
};

export default function FlashListExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [data, setData] = useState<ListItem[]>(generateListData(50));

  // 空状态
  const EmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={colors.secondaryAccent}
        />
        <Text style={[styles.emptyText, { color: colors.secondaryAccent }]}>
          列表暂无数据
        </Text>
      </View>
    );
  };

  const handleDelete = useCallback((id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // 刷新时不清空数据，而是重新加载
      setData(generateListData(50));
      setRefreshing(false);
      setIsDataEmpty(false); // 刷新时清除空状态
    }, 1000);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setData((prevData) => [
        ...prevData,
        ...generateListData(20, prevData.length),
      ]);
      setLoading(false);
    }, 800);
  }, [loading]);

  const exchangeEmpty = () => {
    if (isDataEmpty) {
      // 加载示例数据
      setData(generateListData(50));
    } else {
      // 切换为空状态
      setData([]);
    }
    setIsDataEmpty(!isDataEmpty);
  };

  // 返回按钮
  const handleBack = () => {
    router.back();
  };

  // 渲染加载指示器
  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.secondaryAccent }]}>
          加载更多...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          FlashList 示例
        </Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: colors.secondaryAccent }]}>
          FlashList 是一种高性能列表组件，相比 FlatList
          效率更高，适合处理大量数据
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.card }]}
          onPress={exchangeEmpty}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {isDataEmpty ? "加载示例数据" : "切换为空状态"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={data}
        renderItem={({ item, index }) => (
          <ListItemCard item={item} index={index} onDelete={handleDelete} />
        )}
        ListEmptyComponent={EmptyComponent}
        estimatedItemSize={100}
        contentContainerStyle={
          data.length === 0
            ? { ...styles.listContent, ...styles.emptyListContent }
            : styles.listContent
        }
        onEndReached={data.length > 0 ? handleLoadMore : undefined}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
        ListFooterComponent={data.length > 0 ? renderFooter : null}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
      />
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
  infoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  rightActions: {
    marginBottom: 12,
    width: 80,
    flexDirection: "row",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  actionText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
