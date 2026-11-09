import React, { useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Navigation from './src/screens/Navigation';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [currentDay, setCurrentDay] = useState('4');

  const toggleTheme = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDark(!isDark);
  };

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Navigation 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        currentDay={currentDay} 
        setCurrentDay={setCurrentDay} 
      />
    </NavigationContainer>
  );
}