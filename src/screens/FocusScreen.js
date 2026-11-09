import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { Plus, Minus } from 'lucide-react-native';

const colors = {
  light: { background: '#F7F9F6', textMain: '#111714', surface: '#EAEFE6', primary: '#1B2920', textSecondary: '#66766B' },
  dark: { background: '#0D1410', textMain: '#FFFFFF', surface: '#1D2A22', primary: '#CEEC8C', textSecondary: '#8BAA82' }
};

export default function FocusScreen({ isDark, toggleTheme, currentDay }) {
  const theme = isDark ? colors.dark : colors.light;
  const [seconds, setSeconds] = useState(1500); // 25 минут по умолчанию
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const changeTime = (amount) => {
    if (isActive) return; // Нельзя менять время во время работы таймера
    setSeconds(prev => {
      const newTime = prev + amount;
      return newTime < 60 ? 60 : newTime; // Минимальное время — 1 минута
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Header isDark={isDark} toggleTheme={toggleTheme} currentDay={currentDay} />
        
        <View style={styles.centerBox}>
          <Text style={[styles.label, { color: theme.primary }]}>ВРЕМЯ ФОКУСИРОВКИ</Text>
          
          {/* Блок настройки времени */}
          <View style={styles.timerRow}>
            <TouchableOpacity 
              style={[styles.adjustBtn, { backgroundColor: theme.surface, opacity: isActive ? 0.4 : 1 }]} 
              onPress={() => changeTime(-300)}
              disabled={isActive}
            >
              <Minus color={theme.textMain} size={20} />
            </TouchableOpacity>
            
            <Text style={[styles.timerText, { color: theme.textMain }]}>{formatTime(seconds)}</Text>
            
            <TouchableOpacity 
              style={[styles.adjustBtn, { backgroundColor: theme.surface, opacity: isActive ? 0.4 : 1 }]} 
              onPress={() => changeTime(300)}
              disabled={isActive}
            >
              <Plus color={theme.textMain} size={20} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: theme.primary }]}
            onPress={() => setIsActive(!isActive)}
          >
            <Text style={[styles.btnText, { color: isDark ? '#0D1410' : '#FFF' }]}>
              {isActive ? 'Пауза' : 'Старт'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { paddingHorizontal: 16, paddingVertical: 20, flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 20 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 40 },
  adjustBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  timerText: { fontSize: 64, fontWeight: 'bold', minWidth: 180, textAlign: 'center' },
  btn: { paddingHorizontal: 50, paddingVertical: 16, borderRadius: 25 },
  btnText: { fontSize: 16, fontWeight: '700' }
});