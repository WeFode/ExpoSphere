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
import { useI18n } from "@/i18n";

// 介绍区域组件
const IntroductionSection = ({ colors }: { colors: any }) => {
  const { t } = useI18n();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("imagePicker.title")}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.normalText, { color: colors.text }]}>
          {t("imagePicker.info")}
        </Text>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            {t("imagePicker.intro.feature1")}
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            {t("imagePicker.intro.feature2")}
          </Text>
        </View>

        <View style={styles.bulletContainer}>
          <Ionicons name="checkmark-circle" size={18} color={colors.tint} />
          <Text style={[styles.bulletText, { color: colors.text }]}>
            {t("imagePicker.intro.feature3")}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.noteText, { color: colors.secondaryAccent }]}>
          {t("imagePicker.actions.permissionRequired")}
        </Text>
      </View>
    </View>
  );
};

// 图片选择和预览区域
const ImagePickerSection = ({ colors }: { colors: any }) => {
  const { t } = useI18n();
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
      console.log(t("imagePicker.errors.failed") + ":", error);
      Alert.alert(t("common.error"), t("imagePicker.errors.failed"));
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
        Alert.alert(
          t("common.error"),
          t("imagePicker.actions.permissionRequired"),
        );
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
      console.log(t("imagePicker.errors.failed") + ":", error);
      Alert.alert(t("common.error"), t("imagePicker.errors.failed"));
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
            {t("imagePicker.actions.noImageSelected")}
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
            {t("captureRef.processing")}
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
              {t("camera.controls.mode")}
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
                <Text style={styles.buttonText}>{t("camera.preview")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.livePhotoActionButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={() => livePhotoViewRef.current?.startPlayback("full")}
              >
                <Text style={styles.buttonText}>
                  {t("animation.playAnimation")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.livePhotoActionButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={() => livePhotoViewRef.current?.stopPlayback()}
              >
                <Text style={styles.buttonText}>{t("common.cancel")}</Text>
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
            {t("imagePicker.results.selected")}
          </Text>
        </View>
      </View>
    );
  };

  if (hasPermission === false) {
    return (
      <View style={[styles.section, styles.permissionContainer]}>
        <Text style={[styles.permissionText, { color: colors.text }]}>
          {t("imagePicker.actions.permissionRequired")}
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
          <Text style={styles.buttonText}>
            {t("imagePicker.actions.requestPermission")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("imagePicker.actions.selectImage")}
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
            {t("imagePicker.actions.selectImage")}
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
            {t("imagePicker.actions.takePhoto")}
          </Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" && isLivePhoto && (
        <View style={[styles.livePhotoCard, { backgroundColor: colors.card }]}>
          <View style={styles.livePhotoHeader}>
            <Ionicons name="information-circle" size={24} color={colors.tint} />
            <Text style={[styles.livePhotoTitle, { color: colors.text }]}>
              Live Photo {t("common.info")}
            </Text>
          </View>

          <Text
            style={[
              styles.livePhotoDescription,
              { color: colors.secondaryAccent },
            ]}
          >
            Live Photo
            {t("imagePicker.intro.feature5")}
          </Text>

          <View style={styles.bulletContainer}>
            <Ionicons name="checkmark-circle" size={16} color={colors.tint} />
            <Text
              style={[styles.bulletText, { color: colors.text, fontSize: 13 }]}
            >
              {t("imagePicker.intro.feature4")}
            </Text>
          </View>

          <View style={styles.bulletContainer}>
            <Ionicons name="checkmark-circle" size={16} color={colors.tint} />
            <Text
              style={[styles.bulletText, { color: colors.text, fontSize: 13 }]}
            >
              {t("imagePicker.intro.feature3")}
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
  const { t } = useI18n();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          {t("imagePicker.title")}
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
