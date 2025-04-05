import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  useColorScheme,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { useI18n } from "@/i18n";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

// 示例贴纸数据
const STICKERS = [
  { id: "s1", source: require("@/assets/images/heart.png"), name: "心形" },
  { id: "s2", source: require("@/assets/images/star.png"), name: "星星" },
  { id: "s3", source: require("@/assets/images/logo.png"), name: "Logo" },
];

// 签名点数据结构
interface Point {
  x: number;
  y: number;
}

// 定义签名线段结构，保存连续的点
interface SignatureLine {
  points: Point[];
}

// 贴纸数据结构
interface Sticker {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  source: any;
}

export default function CaptureRefExample() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const { t } = useI18n();

  // 共享状态
  const [activeTab, setActiveTab] = useState<"signature" | "sticker">(
    "signature",
  );
  const [mediaPermission, setMediaPermission] =
    useState<MediaLibrary.PermissionResponse | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // 签名板状态
  const [signaturePoints, setSignaturePoints] = useState<Point[]>([]);
  const [signatureLines, setSignatureLines] = useState<SignatureLine[]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const signatureRef = useRef<View>(null);

  // 贴图状态
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null,
  );
  const stickerCanvasRef = useRef<View>(null);

  // 请求媒体库权限
  React.useEffect(() => {
    (async () => {
      try {
        // 强制显示权限对话框，确保用户能看到权限请求
        const permission = await MediaLibrary.requestPermissionsAsync(true);
        setMediaPermission(permission);

        if (!permission.granted && !permission.canAskAgain) {
          // 如果权限被永久拒绝，提示用户去设置中开启
          Alert.alert(t("common.error"), t("captureRef.permissionRequired"), [
            { text: t("camera.confirm"), style: "default" },
          ]);
        } else if (!permission.granted) {
          // 如果权限被拒绝但可以再次请求
          Alert.alert(
            t("captureRef.permissionRequired"),
            t("captureRef.permissionRequired"),
            [
              { text: t("common.cancel"), style: "cancel" },
              {
                text: t("camera.permissions.grantPermission"),
                style: "default",
                onPress: async () => {
                  const newPermission =
                    await MediaLibrary.requestPermissionsAsync(true);
                  setMediaPermission(newPermission);
                },
              },
            ],
          );
        }
      } catch (error) {
        console.error("获取媒体库权限失败:", error);
      }
    })();
  }, []);

  // 返回处理函数
  const handleBack = () => {
    router.back();
  };

  // 签名处理逻辑
  const handleSignatureTouch = (evt: any) => {
    if (!isDrawing) return;

    const { locationX, locationY } = evt.nativeEvent;
    const newPoint = { x: locationX, y: locationY };

    // 更新当前线条和所有点
    setCurrentLine((prevLine) => [...prevLine, newPoint]);
    setSignaturePoints((prevPoints) => [...prevPoints, newPoint]);
  };

  // 开始绘制
  const startDrawing = (evt: any) => {
    setIsDrawing(true);
    const { locationX, locationY } = evt.nativeEvent;
    const newPoint = { x: locationX, y: locationY };

    // 开始新线条
    setCurrentLine([newPoint]);
    setSignaturePoints((prevPoints) => [...prevPoints, newPoint]);
  };

  // 结束绘制
  const endDrawing = () => {
    if (currentLine.length > 0) {
      // 保存当前线条
      setSignatureLines((prevLines) => [...prevLines, { points: currentLine }]);
      setCurrentLine([]);
    }
    setIsDrawing(false);
  };

  // 清除签名
  const clearSignature = () => {
    setSignaturePoints([]);
    setSignatureLines([]);
    setCurrentLine([]);
  };

  // 添加贴纸
  const addSticker = (stickerId: string) => {
    const stickerToAdd = STICKERS.find((s) => s.id === stickerId);
    if (!stickerToAdd) return;

    const newSticker: Sticker = {
      id: `${stickerId}-${Date.now()}`,
      x: SCREEN_WIDTH / 2 - 50,
      y: SCREEN_HEIGHT / 3 - 50,
      scale: 1,
      rotation: 0,
      source: stickerToAdd.source,
    };

    setStickers((prevStickers) => [...prevStickers, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  // 删除所有贴纸
  const clearStickers = () => {
    setStickers([]);
    setSelectedStickerId(null);
  };

  // 删除选中的贴纸
  const deleteSelectedSticker = () => {
    if (!selectedStickerId) return;

    setStickers((prevStickers) =>
      prevStickers.filter((sticker) => sticker.id !== selectedStickerId),
    );
    setSelectedStickerId(null);
  };

  // 截图函数
  const captureViewAsImage = async (viewRef: React.RefObject<View>) => {
    if (!viewRef.current) {
      Alert.alert(t("common.error"), t("captureRef.saveError"));
      return;
    }

    setIsCapturing(true);
    try {
      // 截图
      const result = await captureRef(viewRef, {
        format: "png",
        quality: 0.9,
      });

      setCapturedImage(result);
      Alert.alert(t("common.success"), t("captureRef.saveSuccess"));
      return result;
    } catch (error) {
      console.error("截图失败:", error);
      Alert.alert(
        t("common.error"),
        `${t("captureRef.saveError")}: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsCapturing(false);
    }
  };

  // 保存图片到相册
  const saveToGallery = async () => {
    // 如果没有可保存的内容，显示错误提示
    if (!capturedImage && !signatureRef.current && !stickerCanvasRef.current) {
      Alert.alert(t("common.error"), t("captureRef.saveError"));
      return;
    }

    try {
      // 检查是否有媒体库权限
      if (!mediaPermission?.granted) {
        const newPermission = await MediaLibrary.requestPermissionsAsync(true);
        if (!newPermission.granted) {
          Alert.alert(t("common.error"), t("captureRef.permissionRequired"));
          return;
        }
        setMediaPermission(newPermission);
      }

      // 确定要保存的图像
      let imageUri = capturedImage;

      // 如果没有已捕获的图像，则捕获当前视图
      if (!imageUri) {
        let viewRef = null;

        if (activeTab === "signature" && signatureRef.current) {
          viewRef = signatureRef;
        } else if (activeTab === "sticker" && stickerCanvasRef.current) {
          viewRef = stickerCanvasRef;
        }

        if (!viewRef) {
          Alert.alert(t("common.error"), t("captureRef.saveError"));
          return;
        }

        // 捕获视图
        setIsCapturing(true);
        try {
          imageUri = await captureRef(viewRef, {
            format: "png",
            quality: 0.9,
          });

          // 更新capturedImage状态
          setCapturedImage(imageUri);
        } finally {
          setIsCapturing(false);
        }
      }

      // 现在我们有了imageUri，可以保存到相册
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      await MediaLibrary.createAlbumAsync("ExpoCapture", asset, false);

      Alert.alert(t("common.success"), t("captureRef.saveSuccess"));
    } catch (error) {
      console.error("保存失败:", error);

      // 提供用户友好的错误信息
      if (error instanceof Error && error.message.includes("permission")) {
        Alert.alert(t("common.error"), t("captureRef.permissionRequired"));
      } else {
        Alert.alert(
          t("common.error"),
          `${t("captureRef.saveError")}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  };

  // 分享图片
  const shareImage = async () => {
    if (!capturedImage && !signatureRef.current && !stickerCanvasRef.current) {
      Alert.alert(t("common.error"), t("captureRef.saveError"));
      return;
    }

    try {
      // 检查分享功能是否可用
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(t("common.error"), t("captureRef.saveError"));
        return;
      }

      // 获取要分享的视图引用
      let viewRef = null;

      // 如果已有截图，直接分享
      if (capturedImage) {
        await Sharing.shareAsync(capturedImage, {
          mimeType: "image/png",
          dialogTitle: t("captureRef.shareTitle"),
        });
        return;
      }

      // 否则根据当前标签捕获视图
      if (activeTab === "signature" && signatureRef.current) {
        viewRef = signatureRef;
      } else if (activeTab === "sticker" && stickerCanvasRef.current) {
        viewRef = stickerCanvasRef;
      }

      if (!viewRef) {
        Alert.alert(t("common.error"), t("captureRef.saveError"));
        return;
      }

      // 捕获视图
      setIsCapturing(true);
      try {
        const result = await captureRef(viewRef, {
          format: "png",
          quality: 0.9,
        });

        // 直接分享捕获的图像
        await Sharing.shareAsync(result, {
          mimeType: "image/png",
          dialogTitle: t("captureRef.shareTitle"),
        });

        // 更新capturedImage状态
        setCapturedImage(result);
      } finally {
        setIsCapturing(false);
      }
    } catch (error) {
      console.error("分享失败:", error);
      Alert.alert(
        t("common.error"),
        `${t("captureRef.saveError")}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // 渲染贴纸元素 (使用手势)
  const StickerItem = ({ sticker }: { sticker: Sticker }) => {
    const isSelected = selectedStickerId === sticker.id;

    // 动画值
    const translateX = useSharedValue(sticker.x);
    const translateY = useSharedValue(sticker.y);
    const rotation = useSharedValue(sticker.rotation);

    // 设置选中状态
    const handleStickerSelect = () => {
      setSelectedStickerId(isSelected ? null : sticker.id);
    };

    // 更新贴纸位置
    const updateStickerPosition = (id: string, x: number, y: number) => {
      setStickers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, x, y } : s)),
      );
    };

    // 平移手势
    const panGesture = Gesture.Pan()
      .onUpdate((e) => {
        translateX.value = sticker.x + e.translationX;
        translateY.value = sticker.y + e.translationY;
      })
      .onEnd((e) => {
        const newX = sticker.x + e.translationX;
        const newY = sticker.y + e.translationY;

        runOnJS(updateStickerPosition)(sticker.id, newX, newY);
        runOnJS(setSelectedStickerId)(sticker.id);
      });

    // 双指缩放和旋转手势功能可以在这里添加

    // 组合所有手势
    const gesture = Gesture.Race(panGesture);

    // 设置动画样式
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { scale: withSpring(isSelected ? 1.05 : 1) },
          { rotate: `${rotation.value}deg` },
        ],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.sticker, animatedStyle]}>
          <TouchableOpacity onPress={handleStickerSelect} activeOpacity={0.8}>
            <Image source={sticker.source} style={styles.stickerImage} />
            {isSelected && <View style={styles.stickerSelectedBorder} />}
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    );
  };

  // 渲染签名板
  const renderSignature = () => {
    return (
      <View style={styles.signatureContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("captureRef.canvas.drawHere")}
        </Text>

        <View
          ref={signatureRef}
          style={[styles.signatureBoard, { borderColor: colors.border }]}
          onTouchMove={handleSignatureTouch}
          onTouchStart={startDrawing}
          onTouchEnd={endDrawing}
          // 添加以下属性，阻止触摸事件冒泡到ScrollView
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={() => {}}
          onResponderMove={() => {}}
          onResponderRelease={() => {}}
        >
          {/* 渲染所有保存的线条 */}
          {signatureLines.map((line, lineIndex) => (
            <View key={`line-${lineIndex}`}>
              {line.points.map((point, pointIndex) => {
                // 跳过第一个点，因为它会单独渲染
                if (pointIndex === 0) return null;
                const prevPoint = line.points[pointIndex - 1];
                return (
                  <View
                    key={`line-${lineIndex}-point-${pointIndex}`}
                    style={[
                      styles.signatureLine,
                      {
                        left: prevPoint.x,
                        top: prevPoint.y,
                        width: Math.sqrt(
                          Math.pow(point.x - prevPoint.x, 2) +
                            Math.pow(point.y - prevPoint.y, 2),
                        ),
                        transform: [
                          {
                            rotate: `${Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x)}rad`,
                          },
                        ],
                        backgroundColor: "black",
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}

          {/* 渲染当前正在绘制的线条 */}
          {currentLine.map((point, pointIndex) => {
            if (pointIndex === 0) return null;
            const prevPoint = currentLine[pointIndex - 1];
            return (
              <View
                key={`current-point-${pointIndex}`}
                style={[
                  styles.signatureLine,
                  {
                    left: prevPoint.x,
                    top: prevPoint.y,
                    width: Math.sqrt(
                      Math.pow(point.x - prevPoint.x, 2) +
                        Math.pow(point.y - prevPoint.y, 2),
                    ),
                    transform: [
                      {
                        rotate: `${Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x)}rad`,
                      },
                    ],
                    backgroundColor: "black",
                  },
                ]}
              />
            );
          })}

          {/* 渲染每个点作为圆点 */}
          {signaturePoints.map((point, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.signatureDot,
                { left: point.x, top: point.y, backgroundColor: "black" },
              ]}
            />
          ))}
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.primaryAccent || "#FF6B6B" },
            ]}
            onPress={clearSignature}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>
              {t("captureRef.canvas.clear")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.tint },
              isCapturing && styles.disabledButton,
            ]}
            onPress={() => captureViewAsImage(signatureRef)}
            disabled={isCapturing}
          >
            <Ionicons name="camera-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>
              {isCapturing
                ? t("captureRef.processing")
                : t("captureRef.canvas.capture")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 渲染贴图画布
  const renderStickerCanvas = () => {
    return (
      <GestureHandlerRootView style={styles.stickerContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("captureRef.canvas.addSticker")}
        </Text>

        <View style={styles.stickerToolbar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {STICKERS.map((sticker) => (
              <TouchableOpacity
                key={sticker.id}
                style={styles.stickerOption}
                onPress={() => addSticker(sticker.id)}
              >
                <Image
                  source={sticker.source}
                  style={styles.stickerThumbnail}
                />
                <Text
                  style={[styles.stickerOptionText, { color: colors.text }]}
                >
                  {sticker.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View ref={stickerCanvasRef} style={styles.stickerCanvas}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1287",
            }}
            style={styles.canvasBackground}
            resizeMode="cover"
          />

          {stickers.map((sticker) => (
            <StickerItem key={sticker.id} sticker={sticker} />
          ))}
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.primaryAccent || "#FF6B6B" },
            ]}
            onPress={clearStickers}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>
              {t("captureRef.canvas.clearStickers")}
            </Text>
          </TouchableOpacity>

          {selectedStickerId && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#FF5252" }]}
              onPress={deleteSelectedSticker}
            >
              <Ionicons name="close-circle-outline" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>
                {t("captureRef.canvas.deleteSticker")}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.tint },
              isCapturing && styles.disabledButton,
            ]}
            onPress={() => captureViewAsImage(stickerCanvasRef)}
            disabled={isCapturing}
          >
            <Ionicons name="camera-outline" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>
              {isCapturing
                ? t("captureRef.processing")
                : t("captureRef.canvas.capture")}
            </Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    );
  };

  // 渲染图片预览
  const renderImagePreview = () => {
    if (!capturedImage) return null;

    return (
      <View style={styles.previewContainer}>
        <Text style={[styles.previewTitle, { color: colors.text }]}>
          {t("captureRef.preview.title")}
        </Text>

        <Image source={{ uri: capturedImage }} style={styles.previewImage} />

        <View style={styles.previewActions}>
          <TouchableOpacity
            style={[styles.previewButton, { backgroundColor: colors.tint }]}
            onPress={saveToGallery}
          >
            <Ionicons name="save-outline" size={16} color="#fff" />
            <Text style={styles.previewButtonText}>
              {t("captureRef.preview.save")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewButton, { backgroundColor: colors.tint }]}
            onPress={shareImage}
          >
            <Ionicons name="share-outline" size={16} color="#fff" />
            <Text style={styles.previewButtonText}>
              {t("captureRef.preview.share")}
            </Text>
          </TouchableOpacity>
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
          {t("captureRef.title")}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "signature" && {
                  borderBottomColor: colors.tint,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setActiveTab("signature")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === "signature" ? colors.tint : colors.text,
                  },
                ]}
              >
                {t("captureRef.canvas.drawHere")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "sticker" && {
                  borderBottomColor: colors.tint,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setActiveTab("sticker")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color: activeTab === "sticker" ? colors.tint : colors.text,
                  },
                ]}
              >
                {t("captureRef.canvas.addSticker")}
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "signature"
            ? renderSignature()
            : renderStickerCanvas()}

          {capturedImage && renderImagePreview()}

          <View style={styles.tipContainer}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>
              {t("captureRef.info")}
            </Text>
            <Text style={[styles.tipContent, { color: colors.text }]}>
              • {t("captureRef.canvas.drawHere")}:{" "}
              {t("captureRef.canvas.clear")}
              {"\n"}• {t("captureRef.canvas.addSticker")}:{" "}
              {t("captureRef.canvas.clearStickers")}
              {"\n"}• {t("captureRef.preview.title")}:{" "}
              {t("captureRef.preview.save")} / {t("captureRef.preview.share")}
            </Text>
          </View>
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
  content: {
    padding: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // 签名板样式
  signatureContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  signatureBoard: {
    height: 250,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  signatureDot: {
    position: "absolute",
    width: 4, // 增大点的尺寸
    height: 4,
    borderRadius: 2,
    backgroundColor: "black", // 修改颜色为黑色以提高可见度
  },
  signatureLine: {
    position: "absolute",
    height: 2, // 线条宽度
    transformOrigin: "left",
  },
  // 贴图画布样式
  stickerContainer: {
    marginBottom: 24,
  },
  stickerToolbar: {
    height: 90,
    marginBottom: 12,
  },
  stickerOption: {
    alignItems: "center",
    marginRight: 16,
  },
  stickerThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 4,
  },
  stickerOptionText: {
    fontSize: 12,
  },
  stickerCanvas: {
    height: 350,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  canvasBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  sticker: {
    position: "absolute",
    zIndex: 10,
  },
  stickerImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  stickerSelectedBorder: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 8,
    borderStyle: "dashed",
  },
  // 按钮样式
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  // 预览样式
  previewContainer: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: "contain",
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  previewButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  // 提示样式
  tipContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginTop: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tipContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});
