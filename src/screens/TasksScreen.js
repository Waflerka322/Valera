// src/screens/TasksScreen.js
import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { WifiOff, RefreshCw, CheckCircle2, Circle } from 'lucide-react-native';
import { useFetch } from '../hooks/useFetch';
import Header from '../components/Header';
import { colors } from '../constants/Colors';

export default function TasksScreen({ isDark, toggleTheme }) {
  const theme = isDark ? colors.dark : colors.light;

  const { data, loading, refreshing, error, refetch, loadMore } = useFetch('/todos');

  // Автоматически обновляем список с сервера при каждом переходе на вкладку «Задачи»
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Компонент ошибки с кнопкой повторного запроса (Уровень Б, Спринт 2)
  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <WifiOff color={theme.danger} size={48} />
      <Text style={[styles.errorTitle, { color: theme.textMain }]}>
        Ошибка соединения
      </Text>
      <Text style={[styles.errorSub, { color: theme.textSecondary }]}>
        {error || 'Не удалось загрузить задачи. Проверьте интернет или сервер.'}
      </Text>
      <TouchableOpacity
        style={[styles.retryBtn, { backgroundColor: theme.primary }]}
        onPress={refetch}
        activeOpacity={0.8}
      >
        <RefreshCw color={isDark ? '#0D1410' : '#FFFFFF'} size={18} />
        <Text style={[styles.retryText, { color: isDark ? '#0D1410' : '#FFFFFF' }]}>
          Повторить попытку
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Плашка пустого ответа сервера (Критерий Спринта 2)
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Список сетевых задач пуст
      </Text>
    </View>
  );

  // Карточка одной задачи из сети
  const renderTaskItem = ({ item }) => (
    <View
      style={[
        styles.taskCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderWidth: isDark ? 1 : 0,
        },
        item.completed && { opacity: 0.65 },
      ]}
    >
      {item.completed ? (
        <CheckCircle2 color={theme.primary} size={22} />
      ) : (
        <Circle color={theme.textSecondary} size={22} />
      )}
      <View style={styles.taskInfo}>
        <Text
          style={[
            styles.taskTitle,
            { color: theme.textMain },
            item.completed && styles.taskCompleted,
          ]}
        >
          {item.title}
        </Text>
        <Text style={[styles.taskMeta, { color: theme.textSecondary }]}>
          {item.sub ? item.sub : `ID: #${item.id} · ${item.completed ? 'Выполнено' : 'В работе'}`}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.headerWrapper}>
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <Text style={[styles.sectionTitle, { color: theme.textMain }]}>
          Все текущие задачи
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Загрузка данных...
          </Text>
        </View>
      ) : error && data.length === 0 ? (
        renderErrorState()
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refetch}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  listContent: { paddingHorizontal: 16, paddingBottom: 30, flexGrow: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '500' },
  errorTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  errorSub: { fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 20, lineHeight: 18 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  retryText: { fontSize: 14, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, fontWeight: '500' },
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 10 },
  taskInfo: { marginLeft: 12, flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600' },
  taskCompleted: { textDecorationLine: 'line-through' },
  taskMeta: { fontSize: 11, marginTop: 4 },
});