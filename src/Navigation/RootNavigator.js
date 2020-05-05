import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsStackNavigator from './SettingsStackNavigator';
import PaymentScreen from '../Screens/PaymentScreen';
import CallScreen from '../Screens/CallScreen';


export const navigationRef = React.createRef();

/**
 * @description Navigate to the specified route.
 * @param {string} routName The name of the route to which to navigate.
 * @param {object} params The params that will be passed to the route.
 */
export const navigate = (routName, params) => {
  navigationRef.current?.navigate(routName, params);
};

const RootStack = createStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator mode="card" screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Main" component={MainTabNavigator} />
        <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        <RootStack.Screen name="Profile" component={ProfileScreen} />
        <RootStack.Screen name="Settings" component={SettingsStackNavigator} />
        <RootStack.Screen name="PaymentMethod" component={PaymentScreen} />
        <RootStack.Screen name="CallScreen" component={CallScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;