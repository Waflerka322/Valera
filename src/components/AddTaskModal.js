import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

export default function AddTaskModal({ visible, onClose, onAdd, theme, isDark }) {
  const [taskText, setTaskText] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [location, setLocation] = useState('Дома');

  const handleSave = () => {
    if (!taskText.trim()) return;

    let dotColor = '#A8DADC';
    if (difficulty === 'Low') dotColor = '#2A9D8F';
    if (difficulty === 'High') dotColor = '#E76F51';

    onAdd({
      id: Date.now(),
      text: taskText,
      sub: `${taskTime || 'Сегодня'} · ${location}`,
      dot: dotColor,
      completed: false
    });

    setTaskText(''); setTaskTime(''); setDifficulty('Medium'); setLocation('Дома');
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: isDark ? '#131C17' : '#FFFFFF' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textMain }]}>Новое задание</Text>
            <TouchableOpacity onPress={onClose}><X color={theme.textMain} size={24} /></TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>ЧТО НУЖНО СДЕЛАТЬ?</Text>
            <TextInput 
              style={[styles.input, { color: theme.textMain, borderColor: theme.border, backgroundColor: isDark ? '#1D2A22' : '#F7F9F6' }]}
              placeholder="Например: Сдать практику по React Native" placeholderTextColor={isDark ? '#516449' : '#A9BAA9'}
              value={taskText} onChangeText={setTaskText}
            />
            <Text style={[styles.label, { color: theme.textSecondary }]}>СРОК ВЫПОЛНЕНИЯ</Text>
            <TextInput 
              style={[styles.input, { color: theme.textMain, borderColor: theme.border, backgroundColor: isDark ? '#1D2A22' : '#F7F9F6' }]}
              placeholder="Например: Сегодня, До 15:00" placeholderTextColor={isDark ? '#516449' : '#A9BAA9'}
              value={taskTime} onChangeText={setTaskTime}
            />
            <Text style={[styles.label, { color: theme.textSecondary }]}>УРОВЕНЬ СЛОЖНОСТИ</Text>
            <View style={styles.row}>
              {[
                { key: 'Low', label: 'Низкий', color: '#2A9D8F' },
                { key: 'Medium', label: 'Средний', color: '#A8DADC' },
                { key: 'High', label: 'Высокий', color: '#E76F51' }
              ].map(item => (
                <TouchableOpacity 
                  key={item.key} 
                  style={[styles.selItem, { borderColor: theme.border }, difficulty === item.key && { backgroundColor: theme.surface, borderColor: theme.primary }]}
                  onPress={() => setDifficulty(item.key)}
                >
                  <View style={[styles.innerDot, { backgroundColor: item.color }]} />
                  <Text style={{ color: theme.textMain, fontSize: 13, fontWeight: '500' }}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, { color: theme.textSecondary }]}>МЕСТО ВЫПОЛНЕНИЯ</Text>
            <View style={styles.row}>
              {['Дома', 'В колледже'].map(loc => (
                <TouchableOpacity 
                  key={loc} 
                  style={[styles.selItem, { flex: 1, borderColor: theme.border }, location === loc && { backgroundColor: theme.surface, borderColor: theme.primary }]}
                  onPress={() => setLocation(loc)}
                >
                  <Text style={{ color: theme.textMain, fontSize: 13, fontWeight: '500', textAlign: 'center', width: '100%' }}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.subBtn, { backgroundColor: theme.primary }]} onPress={handleSave}>
              <Text style={[styles.subBtnText, { color: isDark ? '#0D1410' : '#FFFFFF' }]}>Создать задачу</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginTop: 14 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15 },
  row: { flexDirection: 'row', gap: 10, marginTop: 4 },
  selItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1, borderRadius: 12 },
  innerDot: { width: 8, height: 8, borderRadius: 4 },
  subBtn: { padding: 16, borderRadius: 24, alignItems: 'center', marginTop: 30, marginBottom: 10 },
  subBtnText: { fontSize: 16, fontWeight: 'bold' }
});