import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScheduleAppointmentScreen from '../Screens/ScheduleAppointmentScreen';
import TabBarIcon from '../Components/TabBarIcon';
import Colors from '../Constants/Colors';
import MyAppointmentsScreen from '../Screens/MyAppointmentsScreen';
import UIText from '../Constants/UIText';
import { shallowEqual, useSelector } from 'react-redux';
import { CONSULTANT } from '../Constants/UserTypes';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ConsultantPreferencesScreen from '../Screens/ConsultantPreferencesScreen';
import DashboardScreen from '../Screens/DashboardScreen';


const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const {language, userType, isAdmin} = useSelector(state => ({
    language: state.language,
    userType: state.userType,
    isAdmin: state.isAdmin,
  }), shallowEqual);
  
  const userIsConsultant = userType == CONSULTANT;

  return (
    <Tab.Navigator
      initialRouteName="Schedule"
      screenOptions={{
        headerShown: false,
      }}
      tabBarOptions={{
        activeTintColor: Colors.tintColor,
      }}>
      {!userIsConsultant && (
        <Tab.Screen
          name="Schedule"
          component={ScheduleAppointmentScreen}
          options={{
            tabBarLabel: UIText[language].schedule,
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="checklist" color={color} size={size + 6} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="MyAppointments"
        component={MyAppointmentsScreen}
        options={{
          tabBarLabel: UIText[language].myAppointments,
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="calendar" color={color} size={size} />
          ),
        }}
      />

      {userIsConsultant && (
        <Tab.Screen
          name="Preferences"
          component={ConsultantPreferencesScreen}
          options={{
            tabBarLabel: UIText[language].preferences,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name='user-check' color={color} size={size-2} />
            ),
          }}
        />
      )}

      {isAdmin && (
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: UIText[language].dashboard,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name='dashboard' color={color} size={size-2} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default MainTabNavigator;