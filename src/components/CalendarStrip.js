import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const colors = {
  light: { primary: '#1B2920', tabInactive: '#A9BAA9', textMain: '#111714' },
  dark: { primary: '#CEEC8C', tabInactive: '#516449', textMain: '#FFFFFF' }
};

export default function CalendarStrip({ isDark, currentDay, setCurrentDay }) {
  const theme = isDark ? colors.dark : colors.light;

  const days = [
    { day: 'Пн', num: '2' },
    { day: 'Вт', num: '3' },
    { day: 'Ср', num: '4' },
    { day: 'Чт', num: '5' },
    { day: 'Пт', num: '6' }
  ];

  return (
    <View style={styles.daysWeekRow}>
      {days.map((item) => {
        const isSelected = currentDay === item.num;

        return (
          <TouchableOpacity
            key={item.num}
            onPress={() => setCurrentDay(item.num)}
            style={[
              styles.dayItem,
              isSelected && { backgroundColor: theme.primary, borderRadius: 14 }
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayName, { color: isSelected ? (isDark ? '#0D1410' : '#FFFFFF') : theme.tabInactive }]}>
              {item.day}
            </Text>
            <Text style={[styles.dayNum, { color: isSelected ? (isDark ? '#0D1410' : '#FFFFFF') : theme.textMain }]}>
              {item.num}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  daysWeekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dayItem: { width: 48, height: 58, justifyContent: 'center', alignItems: 'center' },
  dayName: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
  dayNum: { fontSize: 16, fontWeight: '700' }
});