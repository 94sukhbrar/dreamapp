import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AuthOptions from '../Screens/AuthOptions';
import SignUpScreen from '../Screens/SignUpScreen';
import SignUpOptions from '../Screens/SignUpOptions';
import LoginScreen from '../Screens/LoginScreen';
import SignUpSuccessfully from '../Screens/SignUpSuccessfully';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AuthOptions" component={AuthOptions} />
      <Stack.Screen name="SignUpOptions" component={SignUpOptions} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignUpSuccessfully" component={SignUpSuccessfully} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
