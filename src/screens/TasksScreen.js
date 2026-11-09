import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Text } from 'react-native';
import Header from '../components/Header';
import TaskList from '../components/TaskList';

const colors = {
  light: { background: '#F7F9F6', textMain: '#111714' },
  dark: { background: '#0D1410', textMain: '#FFFFFF' }
};

export default function TasksScreen({ isDark, toggleTheme, currentDay }) {
  const theme = isDark ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header isDark={isDark} toggleTheme={toggleTheme} currentDay={currentDay} />
        <Text style={[styles.title, { color: theme.textMain, marginBottom: 15 }]}>Все текущие задачи</Text>
        <TaskList isDark={isDark} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingVertical: 20 },
  title: { fontSize: 22, fontWeight: '700' }
});