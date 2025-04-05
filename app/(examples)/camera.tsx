/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";
import Colors from "@/constants/Colors";
import { useI18n } from "@/i18n";
import {
  CameraView,
  CameraType,
  FlashMode,
  CameraMode,
  useCameraPermissions,
  useMicrophonePermissions,
  BarcodeScanningResult,
  BarcodeType,
  FocusMode,
} from "expo-camera";

export default function CameraExample() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const { t } = useI18n();

  // 权限状态
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);

  // 相机状态
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [active, setActive] = useState(true);
  const [type, setType] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [zoom, setZoom] = useState(0);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [isRecording, setIsRecording] = useState(false);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [enableBarCodeScanning, setEnableBarCodeScanning] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [autoFocus, setAutoFocus] = useState<FocusMode>("off");

  // 相机引用
  const cameraRef = useRef<any>(null);

  // 请求权限
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
    }

    if (!micPermission?.granted) {
      await requestMicPermission();
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    setMediaLibraryPermission(status === "granted");
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
    // 检查设备是否支持手电筒
    if (Platform.OS !== "web") {
      setHasTorch(true);
    }
  };

  const handleMountError = (error: any) => {
    console.error("相机挂载错误:", error);
    Alert.alert("错误", "相机无法启动: " + error.message);
  };

  const toggleCameraType = () => {
    setType((current) => (current === "back" ? "front" : "back"));
    // 切换摄像头时关闭闪光灯
    setFlash("off");
    setTorchOn(false);
  };

  const toggleFlashMode = () => {
    setFlash((current) => {
      switch (current) {
        case "off":
          return "on";
        case "on":
          return "auto";
        case "auto":
          return "off";
        default:
          return "off";
      }
    });
  };

  const toggleTorch = () => {
    setTorchOn((prev) => !prev);
  };

  const toggleFocus = () => {
    setAutoFocus((current) => (current === "off" ? "on" : "off"));
  };

  const toggleCameraMode = () => {
    setMode((current) => (current === "picture" ? "video" : "picture"));
    setCapturedImage(null);
  };

  const toggleBarcodeScanner = () => {
    setEnableBarCodeScanning((prev) => !prev);
    setScannedBarcode(null);
  };

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (enableBarCodeScanning && !scannedBarcode) {
      setScannedBarcode(`${result.type}: ${result.data}`);
      Alert.alert(
        t("camera.scanResult"),
        `${t("camera.scanType")}: ${result.type}\n${t("camera.scanData")}: ${result.data}`,
        [
          {
            text: t("camera.continueScan"),
            onPress: () => setScannedBarcode(null),
          },
          { text: t("camera.confirm"), style: "default" },
        ],
      );
    }
  };

  const takePicture = async () => {
    if (!isCameraReady || !cameraRef.current || processingPhoto) {
      return;
    }

    setProcessingPhoto(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
        exif: true,
      });

      setCapturedImage(photo.uri);

      // 保存到相册
      if (mediaLibraryPermission) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
      }
    } catch (error) {
      console.error("拍照错误:", error);
      Alert.alert(t("common.error"), t("camera.recordingFailed"));
    } finally {
      setProcessingPhoto(false);
    }
  };

  const startRecordVideo = async () => {
    if (!isCameraReady || !cameraRef.current || isRecording) {
      return;
    }

    setIsRecording(true);

    try {
      const videoRecordPromise = cameraRef.current.recordAsync({
        maxDuration: 60,
        quality: "720p",
        mirror: type === "front",
        mute: false,
      });

      const recordResult = await videoRecordPromise;

      if (recordResult.uri) {
        // 保存到相册
        if (mediaLibraryPermission) {
          await MediaLibrary.saveToLibraryAsync(recordResult.uri);
          Alert.alert(t("camera.recordingSuccess"), t("camera.videoSaved"));
        }
      }
    } catch (error) {
      console.error("录像错误:", error);
      Alert.alert(t("camera.recordingError"), t("camera.recordingFailed"));
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecordVideo = () => {
    if (isRecording && cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const renderPermissionScreen = () => {
    return (
      <View style={styles.permissionContainer}>
        <Text style={[styles.permissionText, { color: colors.text }]}>
          {t("camera.permissions.needPermission")}
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.tint }]}
          onPress={requestPermissions}
        >
          <Text style={styles.permissionButtonText}>
            {t("camera.permissions.grantPermission")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCapturedImage = () => {
    if (!capturedImage) return null;

    return (
      <View style={styles.capturedImageContainer}>
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setCapturedImage(null)}
        >
          <Ionicons name="close-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCamera = () => {
    if (!cameraPermission?.granted) {
      return renderPermissionScreen();
    }

    return (
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          renderCapturedImage()
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={type}
            flash={flash}
            enableTorch={torchOn}
            zoom={zoom}
            mode={mode}
            active={active}
            animateShutter={true}
            autofocus={autoFocus}
            mirror={type === "front"}
            barcodeScannerSettings={
              enableBarCodeScanning
                ? {
                    barcodeTypes: [
                      "qr",
                      "aztec",
                      "code128",
                      "code39",
                      "ean13",
                    ] as BarcodeType[],
                  }
                : undefined
            }
            onCameraReady={handleCameraReady}
            onMountError={handleMountError}
            onBarcodeScanned={handleBarCodeScanned}
          >
            {/* 相机控制 UI */}
            <View style={styles.cameraControls}>
              <View style={styles.cameraControlsRow}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleCameraType}
                >
                  <Ionicons name="camera-reverse" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleFlashMode}
                >
                  <Ionicons
                    name={
                      flash === "off"
                        ? "flash-off"
                        : flash === "on"
                          ? "flash"
                          : "flash-outline"
                    }
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>

                {hasTorch && type === "back" && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={toggleTorch}
                  >
                    <Ionicons
                      name={torchOn ? "flashlight" : "flashlight-outline"}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleFocus}
                >
                  <Ionicons
                    name={autoFocus === "on" ? "locate" : "locate-outline"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleBarcodeScanner}
                >
                  <Ionicons
                    name={enableBarCodeScanning ? "qr-code" : "qr-code-outline"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>

              {enableBarCodeScanning && scannedBarcode && (
                <View style={styles.barcodeResultContainer}>
                  <Text style={styles.barcodeResultText}>{scannedBarcode}</Text>
                </View>
              )}

              <View style={styles.zoomContainer}>
                <Slider
                  style={styles.zoomSlider}
                  minimumValue={0}
                  maximumValue={1}
                  value={zoom}
                  onValueChange={setZoom}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
                  thumbTintColor="#FFFFFF"
                />
                <Text
                  style={styles.zoomText}
                >{`${Math.round(zoom * 100)}%`}</Text>
              </View>

              <View style={styles.captureContainer}>
                <TouchableOpacity
                  style={styles.modeButton}
                  onPress={toggleCameraMode}
                >
                  <Ionicons
                    name={mode === "picture" ? "camera" : "videocam"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>

                {mode === "picture" ? (
                  <TouchableOpacity
                    style={[
                      styles.captureButton,
                      processingPhoto && styles.captureButtonDisabled,
                    ]}
                    onPress={takePicture}
                    disabled={processingPhoto}
                  >
                    {processingPhoto ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <View style={styles.captureButtonInner} />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.captureButton,
                      isRecording && styles.recordingButton,
                    ]}
                    onPress={isRecording ? stopRecordVideo : startRecordVideo}
                  >
                    {isRecording && <View style={styles.recordingIndicator} />}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.modeButton}
                  onPress={() => setActive(!active)}
                >
                  <Ionicons
                    name={active ? "eye" : "eye-off"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        )}
      </View>
    );
  };

  // 返回按钮处理函数
  const handleBack = () => {
    router.back();
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
          {t("camera.title")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {renderCamera()}

      <ScrollView style={styles.infoContainer}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          {t("camera.info")}
        </Text>
        <Text style={[styles.infoText, { color: colors.text }]}>
          {`• ${t("camera.controls.switchCamera")}\n• ${t("camera.controls.flash")}\n• ${t("camera.controls.torch")}\n• ${t("camera.controls.focus")}\n• ${t("camera.controls.barcode")}\n• ${t("camera.controls.zoom")}\n• ${t("camera.controls.mode")}\n• ${t("camera.controls.middleButton")}\n• ${t("camera.controls.pauseCamera")}`}
        </Text>
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
  placeholder: {
    width: 40,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  permissionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraContainer: {
    height: 500,
    overflow: "hidden",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 20,
  },
  cameraControlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  zoomSlider: {
    width: "80%",
    height: 40,
  },
  zoomText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  captureContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "white",
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  recordingButton: {
    borderColor: "red",
  },
  recordingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
  },
  barcodeResultContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },
  barcodeResultText: {
    color: "white",
    fontSize: 14,
  },
  capturedImageContainer: {
    flex: 1,
    position: "relative",
  },
  capturedImage: {
    flex: 1,
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  infoContainer: {
    padding: 16,
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
