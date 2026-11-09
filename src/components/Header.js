import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';

const colors = {
  light: { background: '#F7F9F6', surface: '#EAEFE6', card: '#FFFFFF', textMain: '#111714', textSecondary: '#66766B', primary: '#1B2920', border: '#E3E9E1' },
  dark: { background: '#0D1410', surface: '#1D2A22', card: '#131C17', textMain: '#FFFFFF', textSecondary: '#8BAA82', primary: '#CEEC8C', border: '#1C2921' }
};

const quotes = [
  "Привет, Дмитрий! Всё идет по плану?)",
  "Главное — дожить до выходных! 😎",
  "Пары идут, жизнь кипит, код пишется... 💻",
  "Не откладывай на завтра то, что можно сдать в сессию! 😂",
  "React Native сам себя не напишет, погнали! 🚀",
  "Студент спит — лабораторная сдается (в идеальном мире) 😇",
  "Дедлайн уже близко, но чашка кофе ближе ☕",
  "Алгоритмы — это просто. Сказал препод по алгоритмам... 🥲",
  "Работает? Не трогай! Золотое правило программиста 🛠️",
  "99 маленьких багов в коде, 99 багов в коде... Исправил один, получил 126 🤦‍♂️",
  "Кто не спит перед дедлайном, тот сдаёт проект первым! ⚡",
  "В любой непонятной ситуации говори, что это фича, а не баг 😉",
  "Ученье — свет, а за неученье — комиссия по отчислению 💀",
  "Сначала код не работал. Потом я подышал на него, и он запустился 💨",
  "Защита проекта близко! Готовь красивую речь и уверенный взгляд 👀",
  "Пять минут до пары — самое время начать делать домашку ⏱️",
  "Если компилятор молчит, значит, он замышляет что-то неладное... 🤖",
  "Твой код прекрасен, осталось только добавить в него логику 🎨",
  "Проснулся, улыбнулся, открыл VS Code, закрыл VS Code, лёг спать 😴",
  "Самая сложная часть программирования — это придумать имя переменной X 🧩",
  "Преподаватели видят твой код насквозь. Будь аккуратнее с Ctrl+C! 🤫",
  "Автомат по дисциплине — лучшая награда для студента 🏆",
  "Ты создаешь крутое приложение прямо сейчас. Гордись этим! ⭐",
  "Колледж — место, где 45 минут тянутся вечность, а ночь перед сдачей пролетает за секунду 🌌",
  "Дмитрий, сегодня отличный день, чтобы закрыть все долги! Наверное... 🤔"
];

export default function Header({ isDark, toggleTheme, currentDay }) {
  const theme = isDark ? colors.dark : colors.light;
  const [quoteIndex, setQuoteIndex] = useState(0);

  const changeQuote = () => {
    let nextIndex = Math.floor(Math.random() * quotes.length);
    if (nextIndex === quoteIndex) {
      nextIndex = (nextIndex + 1) % quotes.length;
    }
    setQuoteIndex(nextIndex);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={[styles.subDate, { color: theme.textSecondary }]}>
          {currentDay === '3' ? 'ВТОРНИК, 3 НОЯБРЯ' : 'СРЕДА, 4 НОЯБРЯ'}
        </Text>
        <Text style={[styles.title, { color: theme.textMain }]}>Расписание</Text>
        <TouchableOpacity onPress={changeQuote} activeOpacity={0.7}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
            {quotes[quoteIndex]}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={[styles.themeBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} 
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        {isDark ? <Sun color={theme.primary} size={20} /> : <Moon color={theme.primary} size={20} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  subDate: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: 'bold', marginVertical: 2 },
  greeting: { fontSize: 13, marginTop: 4, textDecorationLine: 'underline', textDecorationStyle: 'dashed' },
  themeBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }
});