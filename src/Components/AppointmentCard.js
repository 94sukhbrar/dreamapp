/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import CardActionBtn from './CardActionBtn';
import Layout from '../Constants/Layout';
import UIText from '../Constants/UIText';
import { USER, CONSULTANT } from '../Constants/UserTypes';
import Rating from './Rating';
import {
  REQUESTED,
  DECLINED,
  ACCEPTED,
  MISSED,
  COMPLETED,
} from '../Constants/AppointmentStatusTypes';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AppointmentCard = props => {
  const {
    language,
    appointmentId,
    localDateText,
    localTimeText,
    localAppointmentTime,
    localAppointmentDate,
    onPressCall,
    respond,
    status,
    name,
    rating,
    userType,
    minimized,
    style,
    charging,
  } = props;

  const dateAndTimeContainer = color => (
    <View style={styles.dateAndTimeContainer}>
      <View style={{ flexDirection: 'row', alignItems: "center" }}>
        <Icon
          name="md-calendar"
          size={25}
          style={{}}
          color={color}
        />
        <Text style={[styles.dateAndTimeText, { color: "#ffcea2" }]}>{localDateText}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: "center" }}>
        <Icon
          name="md-time"
          size={25}
          style={{}}
          color={color}
        />
        <Text style={[styles.dateAndTimeText, { color: "#ffcea2" }]}>{localTimeText}</Text>
      </View>
      {/*  <Icon name="md-time" size={25} style={{ marginBottom: -4 }} color={color} />
      <Text style={[styles.dateAndTimeText, { color }]}>
        {localDateText}, {localTimeText}
      </Text> */}
    </View>
  );

  const acceptAndDeclineBtns = [
    <TouchableOpacity
      key={1}
      onPress={() => {
        respond(appointmentId, false);
      }}
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        borderColor: '#b5b4b4',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon name="ios-close" size={35} style={{}} color={'#b5b4b4'} />
    </TouchableOpacity>,
    <TouchableOpacity
      key={0}
      onPress={() => {
        respond(appointmentId, true);
      }}
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#425c5a',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon name="ios-checkmark" size={35} style={{}} color={'white'} />
    </TouchableOpacity>,

    /*  <CardActionBtn
       key={0}
       backgroundColor={Colors.tintColor}
       labelColor={'#fff'}
       btnLabel={UIText[language].accept}
       onPress={() => respond(appointmentId, true)}
       disabled={charging}
     />,
     <CardActionBtn
       key={1}
       backgroundColor={Colors.secondaryElementsColor}
       labelColor={Colors.tintColor}
       btnLabel={UIText[language].decline}
       onPress={() => respond(appointmentId, false)}
     />, */
  ];

  const showStatus = () => {
    const statusFontColor = [DECLINED, MISSED].includes(status)
      ? Colors.red
      : Colors.tintColor;

    let btnText = UIText[language][status.toLowerCase()];

    if (language === 'ar' && status === COMPLETED) {
      btnText = 'تم الإنتهاء';
    }

    return (
      <View style={styles.statusContainer}>
        <Text style={{ color: '#425c5a', fontSize: 13, fontWeight: '700' }}>
          {UIText[language].status}
        </Text>
        <Text
          style={{
            color: '#425c5a',
            fontSize: 10,
            fontWeight: '200',
            //marginBottom: 2,
          }}>
          {btnText}
        </Text>
      </View>
    );
  };

  let appointmentIsThisHour = false;

  if (!minimized) {
    const currentDate = new Date();
    const datesMatch = localAppointmentDate.localDate == currentDate.getDate();
    const hoursMatch = localAppointmentTime.localHour == currentDate.getHours();
    appointmentIsThisHour = datesMatch && hoursMatch;
  }

  const callNowBtnIsEnabled =
    userType === CONSULTANT || (status === ACCEPTED && appointmentIsThisHour);

  if (minimized) {
    return (
      <View
        style={[
          styles.container,
          { paddingHorizontal: '5%', paddingVertical: 20 },
          style,
        ]}>
        <Text style={styles.name}>{name}</Text>

        <Rating
          style={{ marginBottom: 10 }}
          rating={rating}
          language={language}
        />

        {dateAndTimeContainer(Colors.fadedTextColor)}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {userType == CONSULTANT && status == REQUESTED && (
          <Text style={{ color: '#fff', minHeight: 22 }}>
            {UIText[language].appointmentRequest}
          </Text>
        )}

        {dateAndTimeContainer('#fff')}
      </View>

      <View style={styles.body}>
        <View style={styles.nameAndRatingContainer}>
          {userType === USER || status !== REQUESTED ? (
            <View style={{ flex: 1, paddingVertical: 15 }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.name}>{name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    onPressCall(appointmentId);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#425c5a',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="ios-call" size={25} style={{}} color={'white'} />
                </TouchableOpacity>
              </View>
              {showStatus()}
            </View>
          ) : (
              <View>
                <Text style={styles.name}>{name}</Text>
                {acceptAndDeclineBtns}
              </View>
            )}
        </View>
        <Rating rating={rating} language={language} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '92%',
    marginVertical: 10,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    width: '100%',
    minHeight: 50,
    paddingVertical: 15,
    paddingHorizontal: '5%',
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  dateAndTimeContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between"
  },
  dateAndTimeText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 13,
  },
  body: {
    backgroundColor: Colors.elementsColor,
    paddingHorizontal: '5%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  nameAndRatingContainer: {
    minHeight: 50,
    //paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: Colors.textColor,
    fontSize: 15,
    fontWeight: '700',
    //marginBottom: 5,
  },
  btnsAndStatusRow: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 55,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '50%',
  },
});

AppointmentCard.propTypes = {
  language: PropTypes.string.isRequired,
  appointmentId: PropTypes.string.isRequired,
  localDateText: PropTypes.string.isRequired,
  localTimeText: PropTypes.string.isRequired,
  localAppointmentDate: PropTypes.object,
  localAppointmentTime: PropTypes.object,
  onPressCall: PropTypes.func,
  respond: PropTypes.func,
  status: PropTypes.string,
  name: PropTypes.string,
  rating: PropTypes.number,
  userType: PropTypes.string,
  minimized: PropTypes.bool,
  style: ViewPropTypes.style,
  charging: PropTypes.bool,
};

export default AppointmentCard;
