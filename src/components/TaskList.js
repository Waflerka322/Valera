import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTaskModal from './AddTaskModal';

const colors = {
  light: { background: '#F7F9F6', surface: '#EAEFE6', card: '#FFFFFF', textMain: '#111714', textSecondary: '#66766B', primary: '#1B2920', border: '#E3E9E1', progressBg: '#E0E8DA', progressFill: '#1B2920' },
  dark: { background: '#0D1410', surface: '#1D2A22', card: '#131C17', textMain: '#FFFFFF', textSecondary: '#8BAA82', primary: '#CEEC8C', border: '#1C2921', progressBg: '#2D3C32', progressFill: '#CEEC8C' }
};

// Дефолтные задачи, если в памяти телефона ещё ничего нет
const defaultTasks = [
  { id: 1, text: 'Решить 5 задач на циклы', sub: 'Программирование · Сегодня · В колледже', location: 'В колледже', dot: '#F4A261', completed: false },
  { id: 2, text: 'Разобрать конфликтный диалог', sub: 'Психология общения · Завтра · Дома', location: 'Дома', dot: '#A8DADC', completed: false },
  { id: 3, text: 'Сдать лабораторную по массивам', sub: 'Программирование · Пт, 6 нояб. · Дома', location: 'Дома', dot: '#457B9D', completed: true },
];

export default function TaskList({ isDark }) {
  const theme = isDark ? colors.dark : colors.light;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Все');
  const [tasks, setTasks] = useState([]);

  // 1. Загрузка задач из памяти при старте приложения
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('@user_tasks');
        if (savedTasks !== null) {
          setTasks(JSON.parse(savedTasks));
        } else {
          setTasks(defaultTasks);
        }
      } catch (e) {
        setTasks(defaultTasks);
      }
    };
    loadTasks();
  }, []);

  // 2. Автоматическое сохранение задач при любом их изменении
  const saveTasksToStorage = async (newTasks) => {
    try {
      await AsyncStorage.setItem('@user_tasks', JSON.stringify(newTasks));
    } catch (e) {
      console.log('Ошибка сохранения задач');
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks); // сохраняем
  };

  const handleAddNewTask = (newTask) => {
    const loc = newTask.sub.includes('В колледже') ? 'В колледже' : 'Дома';
    const updatedTasks = [...tasks, { ...newTask, location: loc }];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks); // сохраняем
  };

  const handleLongPress = (task) => {
    const updatedTasks = tasks.filter(t => t.id !== task.id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks); // сохраняем
  };

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'Все') return true;
    return t.location === activeFilter;
  });

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);
  
  const totalCompleted = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Задачи</Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>Осталось {tasks.filter(t => !t.completed).length}</Text>
      </View>
      
      <Text style={[styles.progressText, { color: theme.textSecondary }]}>
        Прогресс <Text style={{fontWeight:'700', color: theme.textMain}}>{totalCompleted} из {tasks.length} · {progressPercent}%</Text>
      </Text>
      <View style={[styles.progressBar, { backgroundColor: theme.progressBg }]}>
        <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: theme.progressFill }]} />
      </View>

      {progressPercent === 100 && tasks.length > 0 && (
        <View style={[styles.successBanner, { backgroundColor: theme.surface }]}>
          <Text style={[styles.successText, { color: theme.textMain }]}>🎉 Все задачи выполнены! Ты супер! 😎</Text>
        </View>
      )}

      <View style={styles.filterRow}>
        {['Все', 'Дома', 'В колледже'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, { borderColor: theme.border }, activeFilter === filter && { backgroundColor: theme.primary }]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterTabText, { color: activeFilter === filter ? (isDark ? '#0D1410' : '#FFF') : theme.textSecondary }]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTasks.map(task => (
        <TouchableOpacity key={task.id} style={[styles.taskItem, { borderBottomColor: theme.border }]} onPress={() => toggleTask(task.id)} onLongPress={() => handleLongPress(task)} activeOpacity={0.8}>
          <View style={[styles.checkbox, { borderColor: theme.textSecondary }]} />
          <View style={styles.taskMeta}>
            <Text style={[styles.taskText, { color: theme.textMain }]}>{task.text}</Text>
            <Text style={[styles.taskSub, { color: theme.textSecondary }]}>{task.sub}</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: task.dot }]} />
        </TouchableOpacity>
      ))}

      {completedTasks.length > 0 && <Text style={[styles.sepTitle, { color: theme.textSecondary, marginTop: 16 }]}>ВЫПОЛНЕННЫЕ</Text>}
      {completedTasks.map(task => (
        <TouchableOpacity key={task.id} style={[styles.taskItem, { borderBottomColor: theme.border }]} onPress={() => toggleTask(task.id)} onLongPress={() => handleLongPress(task)} activeOpacity={0.8}>
          <View style={[styles.checkbox, { borderColor: theme.textSecondary, backgroundColor: theme.primary }]}><Check color={isDark ? '#0D1410' : '#FFFFFF'} size={12} /></View>
          <View style={styles.taskMeta}>
            <Text style={[styles.taskText, { color: theme.textMain, textDecorationLine: 'line-through', opacity: 0.4 }]}>{task.text}</Text>
            <Text style={[styles.taskSub, { color: theme.textSecondary, opacity: 0.5 }]}>{task.sub}</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: task.dot, opacity: 0.4 }]} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Plus color={isDark ? '#0D1410' : '#FFFFFF'} size={20} style={{ marginRight: 8 }} />
        <View>
          <Text style={[styles.addBtnText, { color: isDark ? '#0D1410' : '#FFFFFF' }]}>Добавить задачу</Text>
          <Text style={[styles.addBtnSub, { color: isDark ? '#2D3E35' : '#D8F3DC', opacity: 0.8 }]}>Домашнее задание или событие</Text>
        </View>
      </TouchableOpacity>

      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={handleAddNewTask} theme={theme} isDark={isDark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  count: { fontSize: 12 },
  progressText: { fontSize: 12, marginBottom: 6 },
  progressBar: { height: 6, borderRadius: 3, marginBottom: 14, overflow: 'hidden' },
  progressFill: { height: '100%' },
  successBanner: { padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 14 },
  successText: { fontSize: 14, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  filterTab: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderRadius: 14 },
  filterTabText: { fontSize: 12, fontWeight: '600' },
  taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  checkbox: { width: 18, height: 18, borderRadius: 6, borderWidth: 1.5, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  taskMeta: { flex: 1 },
  taskText: { fontSize: 14, fontWeight: '500' },
  taskSub: { fontSize: 11, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  sepTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 24, marginTop: 20 },
  addBtnText: { fontSize: 15, fontWeight: 'bold' },
  addBtnSub: { fontSize: 11 }
});