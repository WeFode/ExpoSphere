import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
} from "react-native-reanimated";

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        entering={FadeIn.delay(300).duration(1000)}
        style={styles.logoContainer}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(600).duration(1000).springify()}
        style={styles.titleContainer}
      >
        <Text style={[styles.title, { color: colors.text }]}>ExpoSphere</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryAccent }]}>
          Discover the power of React Native with Expo
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(900).duration(1000).springify()}
        style={styles.featuresContainer}
      >
        <View style={styles.featureRow}>
          <View style={[styles.featureIcon, { backgroundColor: colors.tint }]}>
            <Ionicons name="code-slash" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Interactive Examples
            </Text>
            <Text
              style={[styles.featureDesc, { color: colors.secondaryAccent }]}
            >
              Explore various React Native components and APIs
            </Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <View style={[styles.featureIcon, { backgroundColor: colors.tint }]}>
            <Ionicons name="phone-portrait" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Native Integration
            </Text>
            <Text
              style={[styles.featureDesc, { color: colors.secondaryAccent }]}
            >
              Access device features like camera and haptics
            </Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <View style={[styles.featureIcon, { backgroundColor: colors.tint }]}>
            <Ionicons name="rocket" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Performance Optimized
            </Text>
            <Text
              style={[styles.featureDesc, { color: colors.secondaryAccent }]}
            >
              Built with the latest React Native techniques
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(1200).duration(1000).springify()}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons
            name="arrow-forward"
            size={22}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
  },
  titleContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  featuresContainer: {
    marginTop: 40,
    flex: 1,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonIcon: {
    marginLeft: 8,
  },
});
