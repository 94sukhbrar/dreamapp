import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../Screens/SignUpScreen';
import LoginScreen from '../Screens/LoginScreen';


const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

export default AuthStackNavigator;