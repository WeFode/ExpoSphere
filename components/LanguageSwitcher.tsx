import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n, LANGUAGES } from "../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

// 语言选择项组件
const LanguageOption = ({
  code,
  isSelected,
  onSelect,
  colors,
}: {
  code: string;
  isSelected: boolean;
  onSelect: () => void;
  colors: any;
}) => {
  const { t } = useI18n();

  return (
    <TouchableOpacity
      style={[
        styles.languageOption,
        isSelected && { backgroundColor: colors.tint + "20" },
      ]}
      onPress={onSelect}
    >
      <View style={styles.languageOptionContent}>
        <Text style={[styles.languageLabel, { color: colors.text }]}>
          {t(
            `common.language.${code === "auto" ? "auto" : code === "en" ? "english" : "chinese"}`,
          )}
        </Text>
        <Text
          style={[
            styles.languageDescription,
            { color: colors.secondaryAccent },
          ]}
        >
          {code === "auto" ? t("common.language.auto") : LANGUAGES[code]}
        </Text>
      </View>
      {isSelected && (
        <Ionicons name="checkmark" size={22} color={colors.tint} />
      )}
    </TouchableOpacity>
  );
};

// 语言切换器组件
const LanguageSwitcher = ({
  visible,
  onClose,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  colors: any;
}) => {
  const { t, locale, setLanguage } = useI18n();
  const [storedLanguage, setStoredLanguage] = useState<string | null>(null);

  // 加载保存的语言设置
  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem("USER_LANGUAGE");
        setStoredLanguage(saved);
      } catch (error) {
        console.error("Error loading language setting", error);
      }
    };

    loadStoredLanguage();
  }, [visible]); // 每次弹窗显示时重新加载

  // 处理语言选择
  const handleLanguageSelect = async (language: string) => {
    await setLanguage(language);
    setStoredLanguage(language);
    onClose();
  };

  // 检查是否是当前选择的语言
  const isCurrentLanguage = (code: string) => {
    if (code === "auto") {
      return storedLanguage === "auto";
    }

    if (storedLanguage === "auto") {
      // 如果是自动模式，检查系统语言是否匹配
      const deviceLanguage = Localization.locale.split("-")[0];
      return code === deviceLanguage && storedLanguage === "auto";
    }

    // 否则直接比较当前语言和保存的语言
    return code === locale && storedLanguage === code;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t("profile.settings.language")}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.languageOptions}>
            {/* 自动选项 */}
            <LanguageOption
              code="auto"
              isSelected={isCurrentLanguage("auto")}
              onSelect={() => handleLanguageSelect("auto")}
              colors={colors}
            />

            {/* 英文选项 */}
            <LanguageOption
              code="en"
              isSelected={isCurrentLanguage("en")}
              onSelect={() => handleLanguageSelect("en")}
              colors={colors}
            />

            {/* 中文选项 */}
            <LanguageOption
              code="zh"
              isSelected={isCurrentLanguage("zh")}
              onSelect={() => handleLanguageSelect("zh")}
              colors={colors}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  languageOptions: {
    marginBottom: 10,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageOptionContent: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  languageDescription: {
    fontSize: 14,
  },
});

export default LanguageSwitcher;
