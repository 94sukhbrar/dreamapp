import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeSchedule from '../Screens/ScheduleAppointmentScreen';
import ConsultantInfo from "../Screens/ScheduleScreenConsultantInfo";

const Stack = createStackNavigator();

const ScheduleStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeSchedule" component={HomeSchedule} />
            <Stack.Screen name="ConsultantInfo" component={ConsultantInfo} />
        </Stack.Navigator>
    );
};

export default ScheduleStackNavigator;
