import React from 'react';
import { AppRegistry } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return <AppNavigator />;
}

export default App;
AppRegistry.registerComponent('main', () => App);