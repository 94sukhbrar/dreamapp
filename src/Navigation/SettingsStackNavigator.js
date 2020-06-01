import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../Screens/SettingsScreen';
import HelpScreen from '../Screens/HelpScreen';
import ProfileScreen from '../Screens/ProfileScreen';


const Stack = createStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;