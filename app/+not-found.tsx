import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

export default function NotFoundScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        entering={FadeIn.delay(300).duration(800)}
        style={styles.iconContainer}
      >
        <Ionicons
          name="alert-circle-outline"
          size={120}
          color={colors.secondaryAccent}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(600).duration(800).springify()}
        style={styles.textContainer}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          404 - Page Not Found
        </Text>
        <Text style={[styles.description, { color: colors.secondaryAccent }]}>
          The page you're looking for doesn't exist or may have been moved.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(900).duration(800).springify()}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={() => router.back()}
        >
          <Ionicons
            name="home"
            size={22}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "80%",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 250,
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
    marginRight: 8,
  },
});
