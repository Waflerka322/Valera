import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const colors = {
  light: { background: '#F7F9F6', surface: '#EAEFE6', card: '#FFFFFF', textMain: '#111714', textSecondary: '#66766B', primary: '#1B2920' },
  dark: { background: '#0D1410', surface: '#1D2A22', card: '#131C17', textMain: '#FFFFFF', textSecondary: '#8BAA82', primary: '#CEEC8C' }
};

const timelineData = {
  '2': { main: 'Архитектура ИС', sec: 'Дискретная математика', count: '2 пары', next: 'Далее: экономика · каб. 210' },
  '3': { main: 'Моделирование', sec: 'Базы данных', count: '2 пары в тот день', next: 'Далее: психология общения · каб. 304' },
  '4': { main: 'Программирование', sec: 'Базы данных', count: '2 пары сегодня', next: 'Далее: психология общения · каб. 304' },
  '5': { main: 'Иностранный язык', sec: 'Веб-разработка', count: '2 пары завтра', next: 'Далее: философия · каб. 411' },
  '6': { main: 'Физическая культура', sec: 'История', count: '2 пары', next: 'Далее: выходные!' },
};

export default function Timeline({ isDark, currentDay }) {
  const theme = isDark ? colors.dark : colors.light;
  const currentTimeline = timelineData[currentDay] || timelineData['4'];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.textMain }]}>Пары</Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>{currentTimeline.count}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.pairNode, { backgroundColor: theme.surface, borderColor: theme.primary, borderWidth: 1 }]}>
          <Text style={[styles.pairTitle, { color: theme.textMain }]}>{currentTimeline.main}</Text>
          <Text style={[styles.pairTime, { color: theme.textSecondary }]}>09:00 - 10:15</Text>
        </View>
        <View style={[styles.pairNode, { backgroundColor: isDark ? '#1C1524' : '#EFE6FD' }]}>
          <Text style={[styles.pairTitle, { color: theme.textMain }]}>{currentTimeline.sec}</Text>
          <Text style={[styles.pairTime, { color: theme.textSecondary }]}>11:00 - 12:00</Text>
        </View>
      </ScrollView>
      <Text style={[styles.footerText, { color: theme.textSecondary }]}>{currentTimeline.next}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  count: { fontSize: 12 },
  pairNode: { padding: 12, borderRadius: 12, marginRight: 12, width: 160 },
  pairTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  pairTime: { fontSize: 11 },
  footerText: { fontSize: 12, marginTop: 8 }
});