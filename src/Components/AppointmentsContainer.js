import React from 'react';
import { 
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import UIText from '../Constants/UIText';
import { CONSULTANT, USER } from '../Constants/UserTypes';
import {
  getAppointmentDate,
  convertDateToText,
  getAppointmentTime,
  convertTimeToText,
} from '../Utilities/DateAndTimeTools';
import AppointmentCard from './AppointmentCard';
import Colors from '../Constants/Colors';
import { REQUESTED, ACCEPTED, COMPLETED } from '../Constants/AppointmentStatusTypes';

const AppointmentsContainer = ({
  appointments,
  appointmentsStatus,
  userType,
  language,
  onPressCall,
  respondToAppointment,
  consultants,
  noAppointmentsContainerHeight,
  loading,
  charging,
}) => {

  const appointmentsMapper = (appointmentId, index) => {
    const appointment = appointments[appointmentId];

    const {localDate, localMonth, localYear} = getAppointmentDate(appointment);

    const dateText = convertDateToText(
      {
        date: localDate,
        month: localMonth,
        year: localYear,
      },
      language,
    );

    const {localHour, localMinute} = getAppointmentTime(appointment);

    const timeText = convertTimeToText({localHour, localMinute}, language);

    const {status, parties} = appointment;
    const peerName = userType == USER ? parties.consultant.name : parties.user.name;

    let rating;

    if (userType == USER) {
      const consultantUid = parties.consultant.uid;
      const consultant = consultants[consultantUid];
      if (consultant) {
        rating = consultant.rating;
      }
    }

    return (
      <AppointmentCard
        key={index}
        appointmentId={appointmentId}
        localDateText={dateText}
        localTimeText={timeText}
        localAppointmentDate={{localDate, localMonth, localYear}}
        localAppointmentTime={{localHour, localMinute}}
        onPressCall={onPressCall}
        respond={respondToAppointment}
        status={status}
        name={peerName}
        rating={rating}
        userType={userType}
        language={language}
        charging={charging}
      />
    );
  };

  const getFilteredAppointments = () => {
    return Object.keys(appointments)
      .filter(appointmentId => appointments[appointmentId].status === appointmentsStatus)
      .map(appointmentsMapper);
  };

  if (loading) return null;

  const filteredAppointments = getFilteredAppointments();

  if (filteredAppointments.length === 0) {
    const appointmentsAdjective = 
      UIText[language][`${appointmentsStatus.toLowerCase()}Adjective`];
    return (
      <View
        style={[
          styles.noAppointmentsMessageContainer,
          {height: noAppointmentsContainerHeight},
        ]}>
        <Text style={styles.noAppointmentsMessage}>
          {UIText[language].noAppointments(appointmentsAdjective)}
        </Text>
      </View>
    );
  }

  let title;

  switch (appointmentsStatus) {
    case REQUESTED:
      title = userType === CONSULTANT
        ? UIText[language].requestedAppointments
        : UIText[language].pending;
      break;

    case ACCEPTED:
      title = UIText[language].upcomingAppointments;
      break;

    case COMPLETED:
      title = UIText[language].completedAppointments;
      break;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      {filteredAppointments}
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    width: '100%',
    alignItems: 'center',
  },
  title: {
    width: '100%',
    textAlign: 'left',
    marginTop: 35,
    marginBottom: 15,
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.fadedTextColor,
  },
  noAppointmentsMessageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointmentsMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.fadedTextColor,
    fontSize: 20,
  },
});

AppointmentsContainer.propTypes = {
  appointments: PropTypes.object.isRequired,
  appointmentsStatus: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  onPressCall: PropTypes.func.isRequired,
  respondToAppointment: PropTypes.func.isRequired,
  consultants: PropTypes.object.isRequired,
  noAppointmentsContainerHeight: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  charging: PropTypes.bool,
}

export default AppointmentsContainer;