import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";

// 定义 Todo 类型
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// 文件路径常量
const TODO_FILE = FileSystem.documentDirectory + "todos.json";

// 主组件
export default function FileSystemExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const router = useRouter();

  // 状态管理
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [fileStats, setFileStats] = useState({
    fileSize: "0 KB",
    lastModified: "-",
    completedCount: 0,
  });

  // 加载待办事项
  const loadTodos = async () => {
    try {
      // 检查文件是否存在
      const fileInfo = await FileSystem.getInfoAsync(TODO_FILE);

      if (fileInfo.exists) {
        // 读取文件内容
        const content = await FileSystem.readAsStringAsync(TODO_FILE);
        const loadedTodos = JSON.parse(content);
        setTodos(loadedTodos);

        // 更新文件统计信息
        updateFileStats(loadedTodos, fileInfo);
      } else {
        // 首次使用，创建示例数据
        const initialTodos: Todo[] = [
          {
            id: "1",
            title: "学习文件系统API",
            completed: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "尝试保存待办事项",
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ];

        setTodos(initialTodos);
        await saveTodosToFile(initialTodos);
      }
    } catch (error) {
      console.error("加载待办事项失败", error);
      Alert.alert("错误", "无法加载待办事项列表");
    } finally {
      setLoading(false);
    }
  };

  // 保存待办事项到文件
  const saveTodosToFile = async (todoList: Todo[]) => {
    try {
      // 将数据转换为JSON字符串
      const jsonData = JSON.stringify(todoList);

      // 写入文件
      await FileSystem.writeAsStringAsync(TODO_FILE, jsonData);

      // 更新文件统计信息
      const fileInfo = await FileSystem.getInfoAsync(TODO_FILE);
      updateFileStats(todoList, fileInfo);

      return true;
    } catch (error) {
      console.error("保存待办事项失败", error);
      Alert.alert("错误", "无法保存待办事项列表");
      return false;
    }
  };

  // 更新文件统计信息
  const updateFileStats = (todoList: Todo[], fileInfo: any) => {
    // 计算文件大小
    const size = fileInfo.size || 0;
    const formattedSize =
      size > 1024 ? `${(size / 1024).toFixed(2)} KB` : `${size} B`;

    // 格式化最后修改时间
    const modificationTime = fileInfo.modificationTime
      ? new Date(fileInfo.modificationTime * 1000).toLocaleString()
      : "-";

    // 计算已完成待办数量
    const completedCount = todoList.filter((todo) => todo.completed).length;

    setFileStats({
      fileSize: formattedSize,
      lastModified: modificationTime,
      completedCount,
    });
  };

  // 添加新待办事项
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const newItem: Todo = {
      id: Date.now().toString(),
      title: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos, newItem];
    setTodos(updatedTodos);
    setNewTodo("");

    await saveTodosToFile(updatedTodos);
  };

  // 切换待办事项状态
  const toggleTodo = async (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(updatedTodos);
    await saveTodosToFile(updatedTodos);
  };

  // 删除待办事项
  const deleteTodo = async (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    await saveTodosToFile(updatedTodos);
  };

  // 导出待办事项
  const exportTodos = async () => {
    try {
      const backupPath =
        FileSystem.documentDirectory + `todos_backup_${Date.now()}.json`;
      await FileSystem.copyAsync({
        from: TODO_FILE,
        to: backupPath,
      });

      Alert.alert("导出成功", `待办事项已备份到:\n${backupPath}`);
    } catch (error) {
      console.error("导出失败", error);
      Alert.alert("错误", "无法导出待办事项列表");
    }
  };

  // 删除所有待办事项
  const deleteAllTodos = async () => {
    Alert.alert(
      "删除所有待办事项",
      "确定要删除所有待办事项吗？此操作不可撤销。",
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: async () => {
            try {
              // 检查文件是否存在
              const fileInfo = await FileSystem.getInfoAsync(TODO_FILE);

              if (fileInfo.exists) {
                // 删除文件
                await FileSystem.deleteAsync(TODO_FILE);
                // 重新创建空文件
                await FileSystem.writeAsStringAsync(
                  TODO_FILE,
                  JSON.stringify([]),
                );
              }

              // 清空待办事项列表
              setTodos([]);
              updateFileStats([], {
                size: 0,
                modificationTime: Date.now() / 1000,
              });

              Alert.alert("已删除", "所有待办事项已删除");
            } catch (error) {
              console.error("删除失败", error);
              Alert.alert("错误", "无法删除待办事项");
            }
          },
        },
      ],
    );
  };

  // 组件加载时读取待办事项
  useEffect(() => {
    loadTodos();
  }, []);

  // 渲染待办事项
  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={[styles.todoItem, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTodo(item.id)}
      >
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={item.completed ? "#4CAF50" : colors.tint}
        />
      </TouchableOpacity>

      <View style={styles.todoContent}>
        <Text
          style={[
            styles.todoTitle,
            {
              color: colors.text,
              textDecorationLine: item.completed ? "line-through" : "none",
              opacity: item.completed ? 0.6 : 1,
            },
          ]}
        >
          {item.title}
        </Text>
        <Text style={[styles.todoDate, { color: colors.secondaryAccent }]}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
      >
        <Ionicons name="trash-outline" size={22} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  // 返回上一页
  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {/* 头部导航 */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          文件系统待办清单
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* 文件信息 */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.secondaryAccent }]}>
              文件大小
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {fileStats.fileSize}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.secondaryAccent }]}>
              最后修改
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {fileStats.lastModified}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.secondaryAccent }]}>
              已完成
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {fileStats.completedCount}/{todos.length}
            </Text>
          </View>
        </View>

        <Text style={[styles.filePath, { color: colors.secondaryAccent }]}>
          存储路径: {TODO_FILE}
        </Text>
      </View>

      {/* 输入框 */}
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder="添加新待办事项..."
          placeholderTextColor={colors.secondaryAccent}
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={addTodo}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 待办事项列表 */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>
            待办事项列表
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: colors.tint }]}
              onPress={exportTodos}
            >
              <Ionicons name="download-outline" size={18} color={colors.tint} />
              <Text style={[styles.actionButtonText, { color: colors.tint }]}>
                导出
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { borderColor: "#F44336" }]}
              onPress={deleteAllTodos}
            >
              <Ionicons name="trash-outline" size={18} color="#F44336" />
              <Text style={[styles.actionButtonText, { color: "#F44336" }]}>
                清空
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Text
              style={[styles.loadingText, { color: colors.secondaryAccent }]}
            >
              正在读取待办事项...
            </Text>
          </View>
        ) : todos.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons name="list" size={64} color={colors.secondaryAccent} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              暂无待办事项
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.secondaryAccent }]}
            >
              添加一些待办事项来体验文件系统存储功能
            </Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* 文件系统说明 */}
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Text style={[styles.footerTitle, { color: colors.text }]}>
          文件系统功能展示
        </Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.tint}
            />
            <Text
              style={[styles.featureText, { color: colors.secondaryAccent }]}
            >
              JSON格式存储
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="save-outline" size={18} color={colors.tint} />
            <Text
              style={[styles.featureText, { color: colors.secondaryAccent }]}
            >
              自动持久化
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="folder-outline" size={18} color={colors.tint} />
            <Text
              style={[styles.featureText, { color: colors.secondaryAccent }]}
            >
              文件备份
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === "ios" ? 48 : 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 40,
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  filePath: {
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginTop: 12,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 15,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    maxWidth: "80%",
  },
  listContent: {
    paddingBottom: 16,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  checkbox: {
    marginRight: 12,
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  todoDate: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  featureList: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 4,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
