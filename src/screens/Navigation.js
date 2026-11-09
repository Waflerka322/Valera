import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, Calendar, ClipboardList, Timer } from 'lucide-react-native';
import ScheduleScreen from './ScheduleScreen';
import CalendarScreen from './CalendarScreen';
import TasksScreen from './TasksScreen';
import FocusScreen from './FocusScreen';

const colors = {
  light: { background: '#F7F9F6', border: '#E3E9E1', tabActive: '#1B2920', tabInactive: '#A9BAA9' },
  dark: { background: '#0D1410', border: '#1C2921', tabActive: '#CEEC8C', tabInactive: '#516449' }
};

const Tab = createBottomTabNavigator();

export default function Navigation({ isDark, toggleTheme, currentDay, setCurrentDay }) {
  const theme = isDark ? colors.dark : colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
      }}
    >
      <Tab.Screen 
        name="Расписание" 
        children={() => (
          <ScheduleScreen 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
            currentDay={currentDay} 
            setCurrentDay={setCurrentDay} 
          />
        )}
        options={{ tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Календарь" 
        children={() => (
          <CalendarScreen 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
            currentDay={currentDay} 
            setCurrentDay={setCurrentDay} 
          />
        )}
        options={{ tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Задачи" 
        children={() => (
          <TasksScreen 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
            currentDay={currentDay} 
          />
        )}
        options={{ tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Фокус" 
        children={() => (
          <FocusScreen 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
            currentDay={currentDay} 
          />
        )}
        options={{ tabBarIcon: ({ color, size }) => <Timer color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
