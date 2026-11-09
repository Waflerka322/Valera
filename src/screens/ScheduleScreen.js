import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import CalendarStrip from '../components/CalendarStrip';
import CurrentClass from '../components/CurrentClass';
import Timeline from '../components/Timeline';
import TaskList from '../components/TaskList';

const colors = {
  light: { background: '#F7F9F6', surface: '#EAEFE6', card: '#FFFFFF', textMain: '#111714', textSecondary: '#66766B', primary: '#1B2920', border: '#E3E9E1', progressBg: '#E0E8DA', progressFill: '#1B2920', tabActive: '#1B2920', tabInactive: '#A9BAA9' },
  dark: { background: '#0D1410', surface: '#1D2A22', card: '#131C17', textMain: '#FFFFFF', textSecondary: '#8BAA82', primary: '#CEEC8C', border: '#1C2921', progressBg: '#2D3C32', progressFill: '#CEEC8C', tabActive: '#CEEC8C', tabInactive: '#516449' }
};

export default function ScheduleScreen({ isDark, toggleTheme, currentDay, setCurrentDay }) {
  const theme = isDark ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header isDark={isDark} toggleTheme={toggleTheme} currentDay={currentDay} />
        
        <View style={styles.dateSelectorRow}>
          <Text style={[styles.monthLabel, { color: theme.textMain }]}>Ноябрь 2026</Text>
          <TouchableOpacity 
            style={[styles.toggleBtn, { backgroundColor: theme.surface }]}
            onPress={() => setCurrentDay(currentDay === '4' ? '3' : '4')}
            activeOpacity={0.7}
          >
            <Text style={{ color: theme.textMain, fontSize: 13, fontWeight: '600' }}>
              {currentDay === '4' ? 'Сегодня' : 'Вчера'}
            </Text>
          </TouchableOpacity>
        </View>

        <CalendarStrip isDark={isDark} currentDay={currentDay} setCurrentDay={setCurrentDay} />

        <CurrentClass isDark={isDark} currentDay={currentDay} />
        <Timeline isDark={isDark} currentDay={currentDay} />
        <TaskList isDark={isDark} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingVertical: 20 },
  dateSelectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  monthLabel: { fontSize: 18, fontWeight: '700' },
  toggleBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 }
});