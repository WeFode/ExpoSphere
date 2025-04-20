import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import VerificationCodeInput from "@/components/VerificationCodeInput";

export default function VerificationCodeInputPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeWithError, setVerificationCodeWithError] =
    useState("");
  const [hasError, setHasError] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.section}>
        <Text style={[styles.title, { color: colors.text }]}>基本用法</Text>
        <Text style={[styles.description, { color: colors.secondaryAccent }]}>
          验证码输入框，支持自动聚焦和完成回调。自适应不同屏幕尺寸。
        </Text>

        <VerificationCodeInput
          title="请输入验证码"
          onCodeFilled={(code) => setVerificationCode(code)}
          autoFocus={false}
        />

        {verificationCode.length > 0 && (
          <Text
            style={[
              styles.result,
              { color: colors.text, backgroundColor: colors.card },
            ]}
          >
            输入的验证码: {verificationCode}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: colors.text }]}>带错误提示</Text>
        <Text style={[styles.description, { color: colors.secondaryAccent }]}>
          当输入错误时可以显示错误信息。
        </Text>

        <VerificationCodeInput
          title="带错误状态的验证码"
          onCodeFilled={(code) => {
            setVerificationCodeWithError(code);
            // 模拟错误状态 - 当验证码不是1234时显示错误
            setHasError(code !== "1234");
          }}
          error={hasError ? "验证码不正确，请输入1234" : undefined}
          autoFocus={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: colors.text }]}>自定义样式</Text>
        <Text style={[styles.description, { color: colors.secondaryAccent }]}>
          可以自定义输入框的样式。
        </Text>

        <VerificationCodeInput
          title="密码输入"
          onCodeFilled={(code) => console.log(code)}
          secureTextEntry={true}
          autoFocus={false}
          inputStyle={{
            borderRadius: 4,
            backgroundColor: colors.card,
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: colors.text }]}>6位验证码</Text>
        <Text style={[styles.description, { color: colors.secondaryAccent }]}>
          可配置任意长度的验证码，布局会自动调整。
        </Text>

        <VerificationCodeInput
          title="6位数字验证码"
          length={6}
          onCodeFilled={(code) => console.log(code)}
          autoFocus={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.title, { color: colors.text }]}>属性说明</Text>

        <View style={[styles.propsTable, { backgroundColor: colors.card }]}>
          <View style={[styles.propRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.propName, { color: colors.text }]}>
              onCodeFilled
            </Text>
            <Text style={[styles.propDesc, { color: colors.secondaryAccent }]}>
              验证码填写完成后的回调
            </Text>
          </View>
          <View style={[styles.propRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.propName, { color: colors.text }]}>
              length
            </Text>
            <Text style={[styles.propDesc, { color: colors.secondaryAccent }]}>
              验证码长度，默认4位
            </Text>
          </View>
          <View style={[styles.propRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.propName, { color: colors.text }]}>
              autoFocus
            </Text>
            <Text style={[styles.propDesc, { color: colors.secondaryAccent }]}>
              是否自动聚焦，默认true
            </Text>
          </View>
          <View style={[styles.propRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.propName, { color: colors.text }]}>error</Text>
            <Text style={[styles.propDesc, { color: colors.secondaryAccent }]}>
              错误信息
            </Text>
          </View>
          <View style={styles.propRow}>
            <Text style={[styles.propName, { color: colors.text }]}>
              secureTextEntry
            </Text>
            <Text style={[styles.propDesc, { color: colors.secondaryAccent }]}>
              是否隐藏输入内容，默认false
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.8,
  },
  result: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    fontWeight: "500",
  },
  propsTable: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  propRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
  },
  propName: {
    width: 140,
    fontWeight: "500",
  },
  propDesc: {
    flex: 1,
    fontSize: 14,
  },
});
