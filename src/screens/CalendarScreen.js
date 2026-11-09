import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import CalendarStrip from '../components/CalendarStrip';
import TaskList from '../components/TaskList';

const colors = {
  light: { background: '#F7F9F6', surface: '#EAEFE6', card: '#FFFFFF', textMain: '#111714', textSecondary: '#66766B', primary: '#1B2920', border: '#E3E9E1', progressBg: '#E0E8DA', progressFill: '#1B2920', tabActive: '#1B2920', tabInactive: '#A9BAA9' },
  dark: { background: '#0D1410', surface: '#1D2A22', card: '#131C17', textMain: '#FFFFFF', textSecondary: '#8BAA82', primary: '#CEEC8C', border: '#1C2921', progressBg: '#2D3C32', progressFill: '#CEEC8C', tabActive: '#CEEC8C', tabInactive: '#516449' }
};

export default function CalendarScreen({ isDark, toggleTheme, currentDay, setCurrentDay }) {
  const theme = isDark ? colors.dark : colors.light;

  const weeks = [
    ['2', '3', '4', '5', '6', '7', '8'],
    ['9', '10', '11', '12', '13', '14', '15'],
    ['16', '17', '18', '19', '20', '21', '22'],
    ['23', '24', '25', '26', '27', '28', '29']
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header isDark={isDark} toggleTheme={toggleTheme} currentDay={currentDay} />
        
        <Text style={[styles.monthLabel, { color: theme.textMain, marginBottom: 15 }]}>Ноябрь 2026</Text>

        <CalendarStrip isDark={isDark} currentDay={currentDay} setCurrentDay={setCurrentDay} />

        <View style={styles.calendarGrid}>
          {weeks.map((week, idx) => (
            <View key={idx} style={styles.weekRow}>
              {week.map(day => {
                const isSelected = day === currentDay;
                return (
                  <View key={day} style={[styles.gridCell, isSelected && { backgroundColor: theme.primary, borderRadius: 10 }]}>
                    <Text style={[styles.cellText, { color: isSelected ? (isDark ? '#0D1410' : '#FFF') : theme.textMain }]}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <TaskList isDark={isDark} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingVertical: 20 },
  monthLabel: { fontSize: 18, fontWeight: '700' },
  calendarGrid: { marginBottom: 20 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  gridCell: { width: 38, height: 38, justifyContent: 'center', alignItems: 'center' },
  cellText: { fontSize: 14, fontWeight: '600' }
});