import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";

// 应用场景数据
const USE_CASES = [
  {
    id: "userdata",
    title: "用户数据存储",
    description: "保存应用设置、用户偏好等持久化数据",
    icon: "settings-outline",
    color: "#4CAF50",
  },
  {
    id: "media",
    title: "媒体文件管理",
    description: "保存和管理照片、视频、音频等媒体文件",
    icon: "images-outline",
    color: "#FFA000",
  },
  {
    id: "cache",
    title: "缓存管理",
    description: "缓存网络请求数据，实现离线访问",
    icon: "cloud-done-outline",
    color: "#2196F3",
  },
  {
    id: "download",
    title: "文件下载与分享",
    description: "下载网络资源并能与其他应用分享",
    icon: "download-outline",
    color: "#9C27B0",
  },
];

// 示例图片和文件数据
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?q=80&w=600",
  "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=600",
  "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600",
];

const SAMPLE_SETTINGS = {
  darkMode: true,
  notifications: true,
  language: "zh-CN",
  fontSize: 16,
  lastUpdated: new Date().toISOString(),
};

// 介绍区域组件
const IntroductionSection = ({ colors }: { colors: any }) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        什么是文件系统？
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.normalText, { color: colors.text }]}>
          文件系统(FileSystem)是应用程序在设备上存储和管理数据的基础设施。通过文件系统API，我们可以：
        </Text>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            读写文本文件、存储JSON数据
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            管理和操作设备上的图片、视频等媒体文件
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            缓存网络数据，提高应用离线体验
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            下载和分享文件，与其他应用交互
          </Text>
        </View>
      </View>
    </View>
  );
};

// 文件系统目录介绍
const FileSystemDirectoriesSection = ({ colors }: { colors: any }) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        关键目录类型
      </Text>

      <View style={styles.directoriesContainer}>
        <View style={[styles.directoryCard, { backgroundColor: colors.card }]}>
          <View
            style={[
              styles.directoryIconContainer,
              { backgroundColor: "#4CAF50" },
            ]}
          >
            <Ionicons name="document" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.directoryTitle, { color: colors.text }]}>
            文档目录
          </Text>
          <Text
            style={[
              styles.directoryDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            长期存储重要数据，不会被系统自动清理
          </Text>
          <Text style={[styles.codeText, { color: colors.text }]}>
            {FileSystem.documentDirectory}
          </Text>

          <View style={styles.usageTagContainer}>
            <View style={[styles.usageTag, { backgroundColor: "#4CAF5033" }]}>
              <Text style={[styles.usageTagText, { color: "#4CAF50" }]}>
                用户设置
              </Text>
            </View>
            <View style={[styles.usageTag, { backgroundColor: "#4CAF5033" }]}>
              <Text style={[styles.usageTagText, { color: "#4CAF50" }]}>
                重要数据
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.directoryCard, { backgroundColor: colors.card }]}>
          <View
            style={[
              styles.directoryIconContainer,
              { backgroundColor: "#2196F3" },
            ]}
          >
            <Ionicons name="cloud-done" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.directoryTitle, { color: colors.text }]}>
            缓存目录
          </Text>
          <Text
            style={[
              styles.directoryDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            临时存储数据，可能会被系统在存储空间不足时清理
          </Text>
          <Text style={[styles.codeText, { color: colors.text }]}>
            {FileSystem.cacheDirectory}
          </Text>

          <View style={styles.usageTagContainer}>
            <View style={[styles.usageTag, { backgroundColor: "#2196F333" }]}>
              <Text style={[styles.usageTagText, { color: "#2196F3" }]}>
                网络缓存
              </Text>
            </View>
            <View style={[styles.usageTag, { backgroundColor: "#2196F333" }]}>
              <Text style={[styles.usageTagText, { color: "#2196F3" }]}>
                临时文件
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// 用户数据存储场景示例
const UserDataStorageExample = ({ colors }: { colors: any }) => {
  const [settings, setSettings] = useState(SAMPLE_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const settingsFilePath = FileSystem.documentDirectory + "settings.json";

  // 保存设置
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await FileSystem.writeAsStringAsync(
        settingsFilePath,
        JSON.stringify({ ...settings, lastUpdated: new Date().toISOString() }),
      );
      Alert.alert("成功", "设置已保存到文档目录");
    } catch (error) {
      Alert.alert("错误", "保存设置失败: " + error);
    } finally {
      setIsSaving(false);
    }
  };

  // 加载设置
  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const fileInfo = await FileSystem.getInfoAsync(settingsFilePath);

      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(settingsFilePath);
        const loadedSettings = JSON.parse(content);
        setSettings(loadedSettings);
        Alert.alert("成功", "设置已从文件加载");
      } else {
        Alert.alert("提示", "尚未保存设置，使用默认设置");
      }
    } catch (error) {
      Alert.alert("错误", "加载设置失败: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置设置
  const resetSettings = () => {
    setSettings(SAMPLE_SETTINGS);
  };

  // 修复 toggleSetting 函数的类型错误
  const toggleSetting = (key: "darkMode" | "notifications") => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.exampleContainer}>
      <View style={styles.exampleHeader}>
        <Ionicons name="settings-outline" size={20} color={colors.text} />
        <Text style={[styles.exampleTitle, { color: colors.text }]}>
          用户数据存储示例
        </Text>
      </View>

      <View style={[styles.exampleCard, { backgroundColor: colors.card }]}>
        <Text
          style={[styles.exampleDescription, { color: colors.secondaryAccent }]}
        >
          应用通常需要保存用户设置、偏好等数据。这些数据可以存储为JSON文件在文档目录中，实现持久化存储。
        </Text>

        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              深色模式
            </Text>
            <TouchableOpacity onPress={() => toggleSetting("darkMode")}>
              <Ionicons
                name={settings.darkMode ? "checkbox" : "square-outline"}
                size={24}
                color={colors.tint}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              推送通知
            </Text>
            <TouchableOpacity onPress={() => toggleSetting("notifications")}>
              <Ionicons
                name={settings.notifications ? "checkbox" : "square-outline"}
                size={24}
                color={colors.tint}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              最后更新
            </Text>
            <Text
              style={[styles.settingValue, { color: colors.secondaryAccent }]}
            >
              {new Date(settings.lastUpdated).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
            onPress={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>保存设置</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#9E9E9E" }]}
            onPress={loadSettings}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>加载设置</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#F44336" }]}
            onPress={resetSettings}
          >
            <Text style={styles.actionButtonText}>重置</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.exampleNotes, { color: colors.secondaryAccent }]}>
          尝试修改设置并保存，然后尝试加载。这些设置会被永久保存在应用的文档目录中。
        </Text>
      </View>
    </View>
  );
};

// 缓存管理示例
const CacheManagementExample = ({ colors }: { colors: any }) => {
  const [cachedImages, setCachedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cacheSize, setCacheSize] = useState<string>("0 KB");

  // 获取缓存目录信息
  const getCacheInfo = async () => {
    try {
      // 检查缓存目录中的图片
      const cacheDir = FileSystem.cacheDirectory + "images/";
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);

      if (dirInfo.exists && dirInfo.isDirectory) {
        const fileList = await FileSystem.readDirectoryAsync(cacheDir);
        const imagePaths = fileList
          .filter((file) => file.endsWith(".jpg") || file.endsWith(".png"))
          .map((file) => cacheDir + file);

        setCachedImages(imagePaths);

        // 计算缓存大小
        let totalSize = 0;
        for (const path of imagePaths) {
          const info = await FileSystem.getInfoAsync(path);
          if (info.exists && info.size) {
            totalSize += info.size;
          }
        }

        // 格式化大小
        if (totalSize > 1024 * 1024) {
          setCacheSize(`${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
        } else if (totalSize > 1024) {
          setCacheSize(`${(totalSize / 1024).toFixed(2)} KB`);
        } else {
          setCacheSize(`${totalSize} B`);
        }
      } else {
        // 如果目录不存在，创建它
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
        setCachedImages([]);
        setCacheSize("0 KB");
      }
    } catch (error) {
      console.error("获取缓存信息失败", error);
      Alert.alert("错误", "获取缓存信息失败");
    }
  };

  // 下载图片到缓存
  const downloadImageToCache = async () => {
    setLoading(true);
    try {
      // 创建缓存目录（如果不存在）
      const cacheDir = FileSystem.cacheDirectory + "images/";
      const dirInfo = await FileSystem.getInfoAsync(cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
      }

      // 随机选择一张示例图片
      const randomImage =
        SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
      const filename = `image_${Date.now()}.jpg`;
      const filePath = cacheDir + filename;

      // 下载图片
      await FileSystem.downloadAsync(randomImage, filePath);

      Alert.alert("成功", "图片已缓存到设备");
      // 刷新缓存信息
      await getCacheInfo();
    } catch (error) {
      Alert.alert("错误", "下载图片失败: " + error);
    } finally {
      setLoading(false);
    }
  };

  // 清理缓存
  const clearImageCache = async () => {
    setLoading(true);
    try {
      const cacheDir = FileSystem.cacheDirectory + "images/";
      await FileSystem.deleteAsync(cacheDir, { idempotent: true });
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });

      setCachedImages([]);
      setCacheSize("0 KB");
      Alert.alert("成功", "图片缓存已清理");
    } catch (error) {
      Alert.alert("错误", "清理缓存失败: " + error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载缓存信息
  useEffect(() => {
    getCacheInfo();
  }, []);

  // 渲染缓存的图片
  const renderCachedImage = ({ item }: { item: string }) => (
    <View style={styles.cachedImageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.cachedImage}
        resizeMode="cover"
      />
      <Text
        style={[styles.imagePath, { color: colors.secondaryAccent }]}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {item.split("/").pop()}
      </Text>
    </View>
  );

  return (
    <View style={styles.exampleContainer}>
      <View style={styles.exampleHeader}>
        <Ionicons name="cloud-done-outline" size={20} color={colors.text} />
        <Text style={[styles.exampleTitle, { color: colors.text }]}>
          缓存管理示例
        </Text>
      </View>

      <View style={[styles.exampleCard, { backgroundColor: colors.card }]}>
        <Text
          style={[styles.exampleDescription, { color: colors.secondaryAccent }]}
        >
          缓存是临时存储数据的方式，适合存储网络图片、API响应等，系统可能会在空间不足时清理。
        </Text>

        <View style={styles.cacheInfoContainer}>
          <View style={styles.cacheInfoItem}>
            <Text
              style={[styles.cacheInfoLabel, { color: colors.secondaryAccent }]}
            >
              缓存图片数量
            </Text>
            <Text style={[styles.cacheInfoValue, { color: colors.text }]}>
              {cachedImages.length} 张
            </Text>
          </View>
          <View style={styles.cacheInfoItem}>
            <Text
              style={[styles.cacheInfoLabel, { color: colors.secondaryAccent }]}
            >
              缓存总大小
            </Text>
            <Text style={[styles.cacheInfoValue, { color: colors.text }]}>
              {cacheSize}
            </Text>
          </View>
        </View>

        {cachedImages.length > 0 ? (
          <FlatList
            data={cachedImages}
            renderItem={renderCachedImage}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageListContainer}
          />
        ) : (
          <View style={styles.emptyCacheContainer}>
            <Ionicons
              name="images-outline"
              size={40}
              color={colors.secondaryAccent}
            />
            <Text
              style={[styles.emptyCacheText, { color: colors.secondaryAccent }]}
            >
              尚无缓存图片
            </Text>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
            onPress={downloadImageToCache}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>缓存新图片</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#F44336" }]}
            onPress={clearImageCache}
            disabled={loading || cachedImages.length === 0}
          >
            <Text style={styles.actionButtonText}>清理缓存</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.exampleNotes, { color: colors.secondaryAccent }]}>
          图片缓存在 cacheDirectory/images/
          目录中，可能在存储空间不足时被系统清理。
        </Text>
      </View>
    </View>
  );
};

// 应用场景列表
const UseCaseList = ({
  colors,
  selectedId,
  onSelect,
}: {
  colors: any;
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.useCaseListContainer}
    >
      {USE_CASES.map((useCase) => (
        <TouchableOpacity
          key={useCase.id}
          style={[
            styles.useCaseItem,
            {
              backgroundColor:
                selectedId === useCase.id
                  ? `${useCase.color}22` // 添加透明度
                  : colors.card,
            },
          ]}
          onPress={() => onSelect(useCase.id)}
        >
          <View
            style={[
              styles.useCaseIconContainer,
              { backgroundColor: useCase.color },
            ]}
          >
            <Ionicons name={useCase.icon as any} size={24} color="#FFFFFF" />
          </View>
          <Text
            style={[
              styles.useCaseTitle,
              {
                color: colors.text,
                fontWeight: selectedId === useCase.id ? "700" : "400",
              },
            ]}
          >
            {useCase.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// 主组件
export default function FileSystemExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const router = useRouter();
  const [selectedUseCase, setSelectedUseCase] = useState("userdata");

  const handleBack = () => {
    router.back();
  };

  // 渲染选中的应用场景示例
  const renderSelectedExample = () => {
    switch (selectedUseCase) {
      case "userdata":
        return <UserDataStorageExample colors={colors} />;
      case "cache":
        return <CacheManagementExample colors={colors} />;
      case "media":
        // 这里可以实现媒体文件管理示例
        return (
          <View style={styles.comingSoonContainer}>
            <Ionicons
              name="images-outline"
              size={48}
              color={colors.secondaryAccent}
            />
            <Text style={[styles.comingSoonText, { color: colors.text }]}>
              媒体文件管理示例
            </Text>
            <Text
              style={[
                styles.comingSoonSubtext,
                { color: colors.secondaryAccent },
              ]}
            >
              此示例将展示如何管理本地媒体文件，敬请期待！
            </Text>
          </View>
        );
      case "download":
        // 这里可以实现文件下载与分享示例
        return (
          <View style={styles.comingSoonContainer}>
            <Ionicons
              name="download-outline"
              size={48}
              color={colors.secondaryAccent}
            />
            <Text style={[styles.comingSoonText, { color: colors.text }]}>
              文件下载与分享示例
            </Text>
            <Text
              style={[
                styles.comingSoonSubtext,
                { color: colors.secondaryAccent },
              ]}
            >
              此示例将展示如何下载和分享文件，敬请期待！
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          文件系统
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <IntroductionSection colors={colors} />
        <FileSystemDirectoriesSection colors={colors} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            实际应用场景
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            选择一个场景，查看文件系统的典型应用：
          </Text>

          <UseCaseList
            colors={colors}
            selectedId={selectedUseCase}
            onSelect={setSelectedUseCase}
          />

          {renderSelectedExample()}
        </View>
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
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
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
  // 目录类型样式
  directoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  directoryCard: {
    flex: 0.48,
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
  directoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  directoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  directoryDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginBottom: 8,
  },
  usageTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  usageTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  usageTagText: {
    fontSize: 10,
    fontWeight: "500",
  },
  // 用例列表样式
  useCaseListContainer: {
    paddingBottom: 8,
  },
  useCaseItem: {
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 100,
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
  useCaseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  useCaseTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  // 示例组件样式
  exampleContainer: {
    marginTop: 16,
  },
  exampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  exampleCard: {
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
  exampleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  exampleNotes: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 12,
  },
  // 用户数据存储示例样式
  settingsContainer: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 0.31,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 12,
  },
  // 缓存管理示例样式
  cacheInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cacheInfoItem: {
    alignItems: "center",
    flex: 1,
  },
  cacheInfoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  cacheInfoValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  imageListContainer: {
    paddingVertical: 8,
  },
  cachedImageContainer: {
    marginRight: 12,
    alignItems: "center",
  },
  cachedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  imagePath: {
    fontSize: 10,
    width: 80,
    textAlign: "center",
  },
  emptyCacheContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  emptyCacheText: {
    marginTop: 8,
    fontSize: 14,
  },
  // 敬请期待样式
  comingSoonContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  comingSoonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
