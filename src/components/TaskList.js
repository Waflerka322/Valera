import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, Check, Trash2 } from 'lucide-react-native';
import AddTaskModal from './AddTaskModal';
import { apiService } from '../api/apiService';

const colors = {
  light: { background: '#F7F9F6', surface: '#EAEFE6', card: '#FFFFFF', textMain: '#111714', textSecondary: '#66766B', primary: '#1B2920', border: '#D7E2D2', danger: '#D9534F' },
  dark: { background: '#0D1410', surface: '#1D2A22', card: '#131C17', textMain: '#FFFFFF', textSecondary: '#8BAA82', primary: '#CEEC8C', border: '#27382D', danger: '#E76F51' }
};

export default function TaskList({ isDark }) {
  const theme = isDark ? colors.dark : colors.light;
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);

  const loadTasks = async () => {
    try {
      const serverTasks = await apiService.get('/todos');
      const formatted = serverTasks.map(t => ({
        id: String(t.id),
        text: t.title,
        sub: t.sub || 'Сегодня · Колледж',
        dot: t.dot || '#A8DADC',
        completed: t.completed,
      }));
      setTasks(formatted);
      await AsyncStorage.setItem('@student_tasks', JSON.stringify(formatted));
    } catch {
      const saved = await AsyncStorage.getItem('@student_tasks');
      if (saved) setTasks(JSON.parse(saved));
    }
  };

  // Автоматически обновляем список при каждом возврате на экран
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const handleAddTask = async (newTask) => {
    const id = String(Date.now());
    const taskForUi = { ...newTask, id };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => [taskForUi, ...prev]);

    try {
      await apiService.post('/todos', {
        id,
        title: newTask.text,
        sub: newTask.sub,
        dot: newTask.dot,
        completed: false,
      });
    } catch {
      // Если сети нет, данные останутся в локальном стейте
    }
  };

  const toggleTask = async (id) => {
    const target = tasks.find(t => String(t.id) === String(id));
    if (!target) return;
    const nextStatus = !target.completed;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => prev.map(t => String(t.id) === String(id) ? { ...t, completed: nextStatus } : t));

    try {
      await apiService.patch(`/todos/${id}`, { completed: nextStatus });
    } catch {}
  };

  const deleteTask = async (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => prev.filter(t => String(t.id) !== String(id)));

    try {
      await apiService.delete(`/todos/${id}`);
    } catch {}
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Done') return t.completed;
    return true;
  });

  return (
    <View>
      <View style={[styles.progressContainer, { backgroundColor: theme.surface }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: theme.textMain }]}>Прогресс на день</Text>
          <Text style={[styles.progressCount, { color: theme.primary }]}>{completedCount} из {tasks.length} ({progressPercent}%)</Text>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#131C17' : '#D7E2D2' }]}>
          <View style={[styles.progressBarFill, { backgroundColor: theme.primary, width: `${progressPercent}%` }]} />
        </View>
      </View>

      <View style={styles.filterRow}>
        {[
          { key: 'All', label: 'Все' },
          { key: 'Active', label: 'Активные' },
          { key: 'Done', label: 'Готовые' }
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && { backgroundColor: theme.primary }]}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setFilter(f.key);
            }}
          >
            <Text style={[styles.filterText, { color: filter === f.key ? (isDark ? '#0D1410' : '#FFFFFF') : theme.textSecondary }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tasksHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Задания</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={() => setModalVisible(true)}>
          <Plus color={isDark ? '#0D1410' : '#FFFFFF'} size={18} />
        </TouchableOpacity>
      </View>

      {filteredTasks.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>В этой категории задач пока нет</Text>
      ) : (
        filteredTasks.map((task) => (
          <View key={task.id} style={[styles.taskCard, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: isDark ? 1 : 0 }, task.completed && { opacity: 0.6 }]}>
            <TouchableOpacity style={styles.taskLeft} onPress={() => toggleTask(task.id)} activeOpacity={0.7}>
              <View style={[styles.checkbox, { borderColor: task.completed ? theme.primary : theme.textSecondary }, task.completed && { backgroundColor: theme.primary }]}>
                {task.completed && <Check color={isDark ? '#0D1410' : '#FFFFFF'} size={14} strokeWidth={3} />}
              </View>
              <View style={[styles.dot, { backgroundColor: task.dot }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.taskTitle, { color: theme.textMain }, task.completed && styles.taskCompletedText]}>{task.text}</Text>
                <Text style={[styles.taskSub, { color: theme.textSecondary }]}>{task.sub}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(task.id)} style={{ padding: 6 }}>
              <Trash2 color={theme.danger} size={18} />
            </TouchableOpacity>
          </View>
        ))
      )}

      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={handleAddTask} theme={theme} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: { padding: 14, borderRadius: 16, marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressTitle: { fontSize: 13, fontWeight: '600' },
  progressCount: { fontSize: 13, fontWeight: 'bold' },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(139, 170, 130, 0.15)' },
  filterText: { fontSize: 12, fontWeight: '600' },
  tasksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  addBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginVertical: 20, fontSize: 13 },
  taskCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, marginBottom: 10 },
  taskLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  taskTitle: { fontSize: 14, fontWeight: '600' },
  taskCompletedText: { textDecorationLine: 'line-through', opacity: 0.7 },
  taskSub: { fontSize: 11, marginTop: 2 }
});
