import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const colors = {
  light: { background: '#F7F9F6', surface: '#EAEFE6', card: '#FFFFFF', textMain: '#111714', textSecondary: '#66766B', primary: '#1B2920' },
  dark: { background: '#0D1410', surface: '#1D2A22', card: '#131C17', textMain: '#FFFFFF', textSecondary: '#8BAA82', primary: '#CEEC8C' }
};

const scheduleData = {
  '2': { name: 'Архитектура ИС', room: '101', time: '09:00–10:15', teacher: 'Иванов Петр Сергеевич', label: 'ПЕРВАЯ ПАРА НЕДЕЛИ' },
  '3': { name: 'Моделирование', room: '206', time: '09:00–10:15', teacher: 'Ларионов Дмитрий Ильич', label: 'ПАРА, КОТОРАЯ БЫЛА ВЧЕРА' },
  '4': { name: 'Программирование', room: '202', time: '09:00–10:15', teacher: 'Емелина Елена Ивановна', label: 'ТЕКУЩАЯ ПАРА' },
  '5': { name: 'Иностранный язык', room: '402', time: '10:30–11:45', teacher: 'Смит Анна Андреевна', label: 'БЛИЖАЙШАЯ ПАРА' },
  '6': { name: 'Физическая культура', room: 'Спортзал', time: '09:00–10:15', teacher: 'Зайцев Олег Николаевич', label: 'ФИНАЛЬНАЯ ПАРА' },
};

export default function CurrentClass({ isDark, currentDay }) {
  const theme = isDark ? colors.dark : colors.light;
  const currentLesson = scheduleData[currentDay] || scheduleData['4'];
  const isToday = currentDay === '4';

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.row}>
        <Text style={[styles.topLabel, { color: theme.textSecondary }]}>{currentLesson.label}</Text>
        {isToday && (
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.badgeText, { color: isDark ? '#0D1410' : '#FFFFFF' }]}>Сейчас</Text>
          </View>
        )}
      </View>
      <Text style={[styles.className, { color: theme.textMain }]}>{currentLesson.name}</Text>
      <View style={styles.row}>
        <Text style={{ color: theme.textSecondary }}>Каб. {currentLesson.room}</Text>
        <Text style={{ color: theme.textSecondary }}>{currentLesson.time}</Text>
      </View>
      <Text style={[styles.teacher, { color: theme.textSecondary }]}>
        Преподаватель: {currentLesson.teacher}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  topLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  className: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  teacher: { fontSize: 12, marginTop: 8 }
});
