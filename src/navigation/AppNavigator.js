import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MapaScreen from '../screens/MapaScreen';
import { COLORS } from '../utils/constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Monitor de Filas UPA' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let emoji;
            
            if (route.name === 'HomeTab') {
              emoji = focused ? '🏠' : '🏘️';
            } else if (route.name === 'Mapa') {
              emoji = focused ? '📍' : '📌';
            }
            
            return <Text style={{ fontSize: size }}>{emoji}</Text>;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
        options={{ title: 'Monitor de Filas UPA' }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{ title: 'UPAs' }}
        />
        <Tab.Screen name="Mapa" component={MapaScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;