import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  LivePhotoView,
  LivePhotoViewType,
  LivePhotoAsset,
} from "expo-live-photo";
import { VideoView, useVideoPlayer } from "expo-video";

// 介绍区域组件
const IntroductionSection = ({ colors }: { colors: any }) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        图片选择器
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.normalText, { color: colors.text }]}>
          图片选择器允许用户从设备相册中选择图片或视频，或直接使用相机拍摄新照片。
        </Text>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            选择单张或多张图片
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            拍摄新照片
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            支持iOS的Live Photo (活照片)
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.noteText, { color: colors.secondaryAccent }]}>
          注意：该组件需要获取相机和媒体库权限才能正常使用。
        </Text>
      </View>
    </View>
  );
};

// 图片选择和预览区域
const ImagePickerSection = ({ colors }: { colors: any }) => {
  const [image, setImage] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<
    "image" | "video" | "livePhoto" | null
  >(null);
  const [isLivePhoto, setIsLivePhoto] = useState(false);
  const [livePhotoAsset, setLivePhotoAsset] = useState<LivePhotoAsset | null>(
    null,
  );
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const livePhotoViewRef = useRef<LivePhotoViewType>(null);

  // 创建视频播放器
  const videoPlayer =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    image && mediaType === "video" ? useVideoPlayer({ uri: image }) : null;

  // 请求相机和媒体库权限
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      setHasPermission(
        cameraStatus.status === "granted" &&
          mediaLibraryStatus.status === "granted",
      );
    })();
  }, []);

  // 从相册选择图片
  const pickImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        exif: true,
        videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        // 检测是否为视频
        if (result.assets[0].type === "video") {
          setMediaType("video");
          setIsLivePhoto(false);
          setLivePhotoAsset(null);
          return;
        }

        // 检测是否为Live Photo (仅在iOS系统上)
        if (Platform.OS === "ios" && result.assets[0].pairedVideoAsset) {
          setIsLivePhoto(true);
          setMediaType("livePhoto");
          setLivePhotoAsset({
            photoUri: result.assets[0].uri,
            pairedVideoUri: result.assets[0].pairedVideoAsset.uri,
          });
        } else {
          setIsLivePhoto(false);
          setMediaType("image");
          setLivePhotoAsset(null);
        }
      }
    } catch (error) {
      console.log("选择图片错误:", error);
      Alert.alert("错误", "选择图片时发生错误");
    } finally {
      setLoading(false);
    }
  };

  // 使用相机拍照
  const takePhoto = async () => {
    setLoading(true);
    try {
      // 确保请求相机权限
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "granted") {
        Alert.alert("权限错误", "需要相机权限才能拍照");
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        exif: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        // 检测是否为视频
        if (result.assets[0].type === "video") {
          setMediaType("video");
          setIsLivePhoto(false);
          setLivePhotoAsset(null);
          return;
        }

        // 检测是否为Live Photo (仅在iOS系统上)
        if (Platform.OS === "ios" && result.assets[0].pairedVideoAsset) {
          setIsLivePhoto(true);
          setMediaType("livePhoto");
          setLivePhotoAsset({
            photoUri: result.assets[0].uri,
            pairedVideoUri: result.assets[0].pairedVideoAsset.uri,
          });
        } else {
          setIsLivePhoto(false);
          setMediaType("image");
          setLivePhotoAsset(null);
        }
      }
    } catch (error) {
      console.log("拍照错误:", error);
      Alert.alert("错误", "拍照时发生错误");
    } finally {
      setLoading(false);
    }
  };

  // 渲染媒体预览
  const renderPreview = () => {
    if (!image) {
      return (
        <View
          style={[
            styles.previewPlaceholder,
            { backgroundColor: colors.secondaryAccent + "20" },
          ]}
        >
          <Ionicons name="image" size={64} color={colors.secondaryAccent} />
          <Text
            style={[
              styles.previewPlaceholderText,
              { color: colors.secondaryAccent },
            ]}
          >
            未选择图片
          </Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View
          style={[
            styles.previewPlaceholder,
            { backgroundColor: colors.secondaryAccent + "20" },
          ]}
        >
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.secondaryAccent }]}>
            正在处理...
          </Text>
        </View>
      );
    }

    if (mediaType === "video" && videoPlayer) {
      return (
        <View style={styles.previewContainer}>
          <VideoView
            player={videoPlayer}
            style={styles.mediaPreview}
            nativeControls={true}
            contentFit="contain"
          />
          <View style={styles.mediaInfo}>
            <Ionicons name="videocam" size={20} color={colors.tint} />
            <Text style={[styles.mediaInfoText, { color: colors.text }]}>
              视频
            </Text>
          </View>
        </View>
      );
    }

    if (
      mediaType === "livePhoto" &&
      livePhotoAsset &&
      Platform.OS === "ios" &&
      LivePhotoView.isAvailable()
    ) {
      return (
        <View style={styles.previewContainer}>
          <LivePhotoView
            ref={livePhotoViewRef}
            source={livePhotoAsset}
            style={styles.mediaPreview}
            contentFit="contain"
            onLoadComplete={() => console.log("Live Photo 加载完成")}
            onLoadError={(error) =>
              console.error("Live Photo 加载错误:", error.message)
            }
          />
          <View style={styles.mediaInfo}>
            <Ionicons name="sparkles" size={20} color={colors.tint} />
            <Text style={[styles.mediaInfoText, { color: colors.text }]}>
              Live Photo
            </Text>
          </View>

          <View style={styles.livePhotoButtonsContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[
                  styles.livePhotoActionButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={() => livePhotoViewRef.current?.startPlayback("hint")}
              >
                <Text style={styles.buttonText}>预览</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.livePhotoActionButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={() => livePhotoViewRef.current?.startPlayback("full")}
              >
                <Text style={styles.buttonText}>播放</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.livePhotoActionButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={() => livePhotoViewRef.current?.stopPlayback()}
              >
                <Text style={styles.buttonText}>停止</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: image }}
          style={styles.mediaPreview}
          resizeMode="contain"
        />
        <View style={styles.mediaInfo}>
          <Ionicons name="image" size={20} color={colors.tint} />
          <Text style={[styles.mediaInfoText, { color: colors.text }]}>
            图片
          </Text>
        </View>
      </View>
    );
  };

  if (hasPermission === false) {
    return (
      <View style={[styles.section, styles.permissionContainer]}>
        <Text style={[styles.permissionText, { color: colors.text }]}>
          需要相机和媒体库权限才能使用此功能
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.tint }]}
          onPress={async () => {
            await ImagePicker.requestCameraPermissionsAsync();
            await ImagePicker.requestMediaLibraryPermissionsAsync();

            const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
            const mediaLibraryStatus =
              await ImagePicker.getMediaLibraryPermissionsAsync();

            setHasPermission(
              cameraStatus.status === "granted" &&
                mediaLibraryStatus.status === "granted",
            );
          }}
        >
          <Text style={styles.buttonText}>请求权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        选择或拍摄图片
      </Text>

      {renderPreview()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.pickerButton, { backgroundColor: colors.card }]}
          onPress={pickImage}
        >
          <View
            style={[
              styles.pickerIconContainer,
              { backgroundColor: colors.tint },
            ]}
          >
            <Ionicons name="images" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.pickerButtonText, { color: colors.text }]}>
            从相册选择
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pickerButton, { backgroundColor: colors.card }]}
          onPress={takePhoto}
        >
          <View
            style={[
              styles.pickerIconContainer,
              { backgroundColor: colors.tint },
            ]}
          >
            <Ionicons name="camera" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.pickerButtonText, { color: colors.text }]}>
            拍摄照片
          </Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" && isLivePhoto && (
        <View style={[styles.livePhotoCard, { backgroundColor: colors.card }]}>
          <View style={styles.livePhotoHeader}>
            <Ionicons name="information-circle" size={24} color={colors.tint} />
            <Text style={[styles.livePhotoTitle, { color: colors.text }]}>
              Live Photo 信息
            </Text>
          </View>

          <Text
            style={[
              styles.livePhotoDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            Live Photo
            是iOS设备上的一种特殊照片格式，它不仅包含静态图像，还包含拍摄前后1.5秒的视频。
          </Text>

          <View style={styles.bulletContainer}>
            <Ionicons name="checkmark-circle" size={16} color={colors.tint} />
            <Text
              style={[styles.bulletText, { color: colors.text, fontSize: 13 }]}
            >
              点击预览按钮可以查看短暂的动态效果
            </Text>
          </View>

          <View style={styles.bulletContainer}>
            <Ionicons name="checkmark-circle" size={16} color={colors.tint} />
            <Text
              style={[styles.bulletText, { color: colors.text, fontSize: 13 }]}
            >
              点击播放按钮可以查看完整的动态效果
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// 主组件
export default function ImagePickerExample() {
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
          图片选择器
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <IntroductionSection colors={colors} />
        <ImagePickerSection colors={colors} />
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
  // 权限样式
  permissionContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  // 图片预览样式
  previewContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
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
  previewPlaceholder: {
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  previewPlaceholderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  mediaPreview: {
    width: "100%",
    height: 240,
    backgroundColor: "#000",
  },
  mediaInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  mediaInfoText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  // 按钮样式
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pickerButton: {
    width: "48%",
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
  pickerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pickerButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  buttonIcon: {
    marginRight: 6,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  // Live Photo 相关样式
  livePhotoButtonsContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  livePhotoActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  livePhotoCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
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
  livePhotoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  livePhotoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  livePhotoDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
});
