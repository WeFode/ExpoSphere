import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// 导入翻译文件
import en from "./translations/en";
import zh from "./translations/zh";

// 支持的语言
export const LANGUAGES = {
  en: "English",
  zh: "中文",
  auto: "Auto",
};

// 创建i18n实例
const i18n = new I18n({
  en,
  zh,
});

// 设置回退选项和默认语言
i18n.enableFallback = true;
i18n.defaultLocale = "en";

// 初始化语言
export const initLanguage = async () => {
  try {
    // 尝试从存储中获取用户选择的语言
    const savedLanguage = await AsyncStorage.getItem("USER_LANGUAGE");

    if (savedLanguage && savedLanguage !== "auto") {
      // 如果有保存的语言且不是auto，使用保存的语言
      i18n.locale = savedLanguage;
    } else {
      // 否则使用系统语言或回退到默认语言
      const deviceLanguage = Localization.locale.split("-")[0];
      i18n.locale = Object.keys(i18n.translations).includes(deviceLanguage)
        ? deviceLanguage
        : i18n.defaultLocale;
    }
  } catch (error) {
    console.error("加载语言设置失败:", error);
    // 出错时使用系统语言
    const deviceLanguage = Localization.locale.split("-")[0];
    i18n.locale = Object.keys(i18n.translations).includes(deviceLanguage)
      ? deviceLanguage
      : i18n.defaultLocale;
  }

  return i18n.locale;
};

// 保存语言设置
export const saveLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem("USER_LANGUAGE", language);

    if (language === "auto") {
      // 如果设置为auto，使用系统语言
      const deviceLanguage = Localization.locale.split("-")[0];
      i18n.locale = Object.keys(i18n.translations).includes(deviceLanguage)
        ? deviceLanguage
        : i18n.defaultLocale;
    } else {
      i18n.locale = language;
    }

    return true;
  } catch (error) {
    console.error("保存语言设置失败:", error);
    return false;
  }
};

// 获取当前语言
export const getCurrentLanguage = () => {
  return i18n.locale;
};

// React hook - 使用i18n并响应语言变化
export const useI18n = () => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    // 初始化语言设置
    const init = async () => {
      const initialLocale = await initLanguage();
      setLocale(initialLocale);
    };

    init();
  }, []);

  const setLanguage = async (language: string) => {
    const success = await saveLanguage(language);
    if (success) {
      setLocale(i18n.locale);
    }
    return success;
  };

  return {
    t: (scope: string, options?: object) => i18n.t(scope, options),
    locale,
    setLanguage,
    languages: LANGUAGES,
  };
};

// 导出i18n实例以便在非React组件中使用
export default i18n;
