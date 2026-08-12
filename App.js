import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

export default function App() {
  return <AppNavigator />;
}