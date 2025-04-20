import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  useColorScheme,
} from "react-native";
import Colors from "@/constants/Colors";

interface VerificationCodeInputProps {
  onCodeFilled?: (code: string) => void;
  length?: number;
  autoFocus?: boolean;
  placeholder?: string;
  keyboardType?: "numeric" | "default" | "number-pad";
  secureTextEntry?: boolean;
  style?: any;
  inputStyle?: any;
  title?: string;
  titleStyle?: any;
  error?: string;
}

const VerificationCodeInput = ({
  onCodeFilled,
  length = 4,
  autoFocus = true,
  placeholder = "•",
  keyboardType = "numeric",
  secureTextEntry = false,
  style,
  inputStyle,
  title,
  titleStyle,
  error,
}: VerificationCodeInputProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // 初始化输入框引用数组
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // 自动聚焦到第一个输入框
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  // 处理输入变化
  const handleChange = (text: string, index: number) => {
    const newCode = [...code];

    // 处理粘贴多位数字的情况
    if (text.length > 1) {
      const pastedText = text.substring(0, length);

      // 分配每个字符到对应的输入框
      for (let i = 0; i < length && i < pastedText.length; i++) {
        newCode[i] = pastedText[i];
      }

      setCode(newCode);

      // 自动触发完成回调
      if (pastedText.length === length && onCodeFilled) {
        onCodeFilled(pastedText);
      }

      // 聚焦到最后一个输入框或填充的最后位置
      const lastIndex = Math.min(pastedText.length, length) - 1;
      if (lastIndex >= 0 && inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex]?.focus();
        setFocusedIndex(lastIndex);
      }

      return;
    }

    // 单个字符输入处理
    newCode[index] = text;
    setCode(newCode);

    // 如果有输入且不是最后一个输入框，自动移动到下一个
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }

    // 检查是否所有输入框都已填充
    if (!newCode.includes("") && onCodeFilled) {
      onCodeFilled(newCode.join(""));
      Keyboard.dismiss();
    }
  };

  // 处理键盘删除操作
  const handleKeyPress = (e: any, index: number) => {
    const { key } = e.nativeEvent;

    // 如果按下删除键且当前输入框为空，且不是第一个输入框，聚焦到前一个输入框
    if (key === "Backspace" && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);

      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  // 处理输入框聚焦
  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  // 通过点击外部关闭键盘
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={[styles.container, style]}>
        {title && (
          <Text style={[styles.title, { color: colors.text }, titleStyle]}>
            {title}
          </Text>
        )}

        <View style={styles.inputContainer}>
          {Array(length)
            .fill(null)
            .map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.input,
                  {
                    borderColor: error
                      ? colors.error || "#ff3b30"
                      : focusedIndex === index
                        ? colors.tint
                        : colors.border || "#cccccc",
                    color: colors.text,
                    backgroundColor: colors.card || "#ffffff33",
                  },
                  inputStyle,
                ]}
                value={code[index]}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                keyboardType={keyboardType}
                maxLength={index === 0 ? length : 1}
                secureTextEntry={secureTextEntry}
                selectTextOnFocus
                placeholder={!code[index] ? placeholder : ""}
                placeholderTextColor={colors.border}
              />
            ))}
        </View>

        {error && (
          <Text style={[styles.error, { color: colors.error || "#ff3b30" }]}>
            {error}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    aspectRatio: 1, // 保持输入框正方形
    maxWidth: 70, // 设置最大宽度避免在大屏幕上过大
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "500",
    marginHorizontal: 5,
  },
  error: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default VerificationCodeInput;
