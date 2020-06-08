import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
//import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../Components/Header';
import RoundImage from '../Components/RoundImage';
import Icon from 'react-native-vector-icons/Ionicons';
import Rating from '../Components/Rating';
import UIText from '../Constants/UIText';
import Colors from '../Constants/Colors';
import IconInputField from '../Components/IconInputField';
import { translateDigitsToArabicIfLanguageIsArabic } from '../Utilities/DateAndTimeTools';
import DismissibleModal from '../Components/DismissibleModal';
import CustomIcon from '../Components/CustomIcon';
import { IONICONS } from '../Constants/IconFamilies';
import DateAndTimePicker from '../Components/DateAndTimePicker';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import useMessageDisplayer from '../Hooks/useMessageDisplayer';

import {
  cantSelectAnAppointmentToday,
  convertLocalDateToUTC,
  addDaysToDate,
  addWeeksToDate,
  convertUTCHourToLocal,
  hourIsBetweenTwoHours,
  convertDateToText,
  convertTimeToText,
  isSelectedDateBeforeMinimumDate,
  isSelectedDateAndTimeAlreadyTaken,
  getNearestAvailableTime,
} from '../Utilities/DateAndTimeTools';
import { ScrollView } from 'react-native-gesture-handler';
//import {Ionicons} from '@expo/vector-icons';
//import {Divider} from 'react-native-elements';
const currentDate = new Date();

//import ConsultantComponent from '../../../components/schedule/ConsultantComponent';
const defaultAppointmentDate = {
  year: currentDate.getFullYear(),
  month: currentDate.getMonth(),
  date: currentDate.getDate(),
};
const defaultAppointmentTime = {
  localHour: currentDate.getHours(),
  localMinute: currentDate.getMinutes(),
};

const ConsultantInfo = ({ navigation, route }) => {
  useEffect(() => {
    selectConsultantCard(route.params.consultantID);
    console.log('-------pozivamo na pocetku! konsultant: ', route);
  }, [route, selectConsultantCard]);

  const {
    language,
    loggedIn,
    photoUrl,
    loadingConsultants,
    consultants,
    isConnectedToInternet,
  } = useSelector(
    state => ({
      language: state.language,
      loggedIn: state.loggedIn,
      photoUrl: state.photoUrl,
      loadingConsultants: state.loadingConsultants,
      consultants: state.consultants,
      isConnectedToInternet: state.isConnectedToInternet,
    }),
    shallowEqual,
  );

  const [selectedConsultantUid, setSelectedConsultantUid] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [dateTextColor, setDateTextColor] = useState(Colors.placeHolderColor);
  const [timeTextColor, setTimeTextColor] = useState(Colors.placeHolderColor);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [pickerMode, setPickerMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);
  const [minimumDate, setMinimumDate] = useState(null);
  const [maximumDate, setMaximumDate] = useState(null);
  const [dateTimePickerLabel, setDateTimePickerLabel] = useState('');
  const [dateTimePickerLabelColor, setDateTimePickerLabelColor] = useState(
    Colors.tintColor,
  );
  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const isIos = Platform.OS === 'ios';

  const [messageDisplayer, displayMessage] = useMessageDisplayer();

  const getConsultantAvailableTimeRange = consultantObject => {
    const {
      from: consultantMinimumUTCHour,
      to: consultantMaximumUTCHour,
    } = consultantObject.timeAvailable;
    const consultantMinimumLocalHour = convertUTCHourToLocal(
      consultantMinimumUTCHour,
    );
    const consultantMaximumLocalHour = convertUTCHourToLocal(
      consultantMaximumUTCHour,
    );

    return {
      consultantMinimumUTCHour,
      consultantMaximumUTCHour,
      consultantMinimumLocalHour,
      consultantMaximumLocalHour,
    };
  };

  const selectConsultantCard = uid => {
    setSelectedConsultant(consultants[uid]);
    setSelectedConsultantUid(uid);
  };

  const onDateTimeChange = (event, date) => {
    if (!isIos && event.type) {
      setShowPicker(false);

      if (event.type == 'set') {
        pickerMode == 'time' ? onSelectTime(date) : onSelectDate(date);
      }
    } else if (date) {
      setSelectedDate(date);
    }
  };

  const onSelectDate = date => {
    const pickedDate = isIos ? selectedDate : date;

    const pickedDateIsBeforeMinimumDate = isSelectedDateBeforeMinimumDate(
      pickedDate,
      minimumDate,
    );

    if (pickedDateIsBeforeMinimumDate) {
      addDaysToDate(pickedDate, 1);
    }

    const newAppointmentDate = {
      year: pickedDate.getFullYear(),
      month: pickedDate.getMonth(),
      date: pickedDate.getDate(),
    };

    setAppointmentDate(newAppointmentDate);
    setDateTextColor(Colors.tintColor);
    setShowPicker(false);
  };

  const rejectSelectedTimeAndDate = message => {
    if (isIos) {
      setDateTimePickerLabel(message);
      setDateTimePickerLabelColor(Colors.red);
    } else {
      displayMessage(message);
    }
  };

  const rejectIfSelectedTimeAlreadyTaken = pickedDate => {
    const {
      upcomingAppointmentDates: consultantUpcomingAppointmentDates,
    } = selectedConsultant;

    const {
      consultantMinimumUTCHour,
      consultantMaximumUTCHour,
    } = getConsultantAvailableTimeRange(selectedConsultant);

    const selectedDateAndTimeAlreadyTaken = isSelectedDateAndTimeAlreadyTaken(
      pickedDate,
      consultantUpcomingAppointmentDates,
    );

    if (selectedDateAndTimeAlreadyTaken) {
      const [
        nearestAvailableTimeBefore,
        nearestAvailableTimeAfter,
      ] = getNearestAvailableTime(
        pickedDate,
        consultantUpcomingAppointmentDates,
        consultantMinimumUTCHour,
        consultantMaximumUTCHour,
        language,
      );
      const selectedDateAndTimeAlreadyTakenMessage = UIText[
        language
      ].selectedTimeNotAvailableTry(
        nearestAvailableTimeBefore,
        nearestAvailableTimeAfter,
      );
      rejectSelectedTimeAndDate(selectedDateAndTimeAlreadyTakenMessage);
      return true;
    }

    return false;
  };

  const showMode = currentMode => {
    displayMessage('');
    setShowPicker(true);
    setPickerMode(currentMode);
  };
  const showDatePicker = () => {
    /* if (!selectedConsultant) {
      displayMessage(UIText[language].selectConsultantFirst);
      return;
    } */

    const { consultantMaximumUTCHour } = getConsultantAvailableTimeRange(
      selectedConsultant,
    );

    const numberOfWeeksAppointmentMustBeWithin =
      selectedConsultant.numberOfWeeksAppointmentMustBeWithin || 2;

    const currentUTCDate = convertLocalDateToUTC(new Date());

    const todayIsNotAvailable = cantSelectAnAppointmentToday({
      currentUTCDate,
      consultantMaximumUTCHour,
      timeWindow: selectedConsultant.timeWindow || 20,
    });

    let newMinimumDate = new Date();
    let newMaximumDate = new Date();

    if (todayIsNotAvailable) {
      addDaysToDate(newMinimumDate, 1);
    }

    addWeeksToDate(newMaximumDate, numberOfWeeksAppointmentMustBeWithin);

    setMinimumDate(newMinimumDate);
    setMaximumDate(newMaximumDate);
    setDateTimePickerLabel(
      UIText[language].selectDateWithin(numberOfWeeksAppointmentMustBeWithin),
    );
    setDateTimePickerLabelColor(Colors.tintColor);
    showMode('date');
  };

  const getAppointmentUTCDateTime = () => {
    const LocalAppointmentDate = new Date();

    LocalAppointmentDate.setFullYear(appointmentDate.year);
    LocalAppointmentDate.setMonth(appointmentDate.month);
    LocalAppointmentDate.setDate(appointmentDate.date);

    LocalAppointmentDate.setHours(appointmentTime.localHour);
    LocalAppointmentDate.setMinutes(appointmentTime.localMinute);

    const UTCAppointmentDate = convertLocalDateToUTC(LocalAppointmentDate);

    const appointmentUTCDateTime = {
      date: {
        year: UTCAppointmentDate.getFullYear(),
        month: UTCAppointmentDate.getMonth(),
        date: UTCAppointmentDate.getDate(),
      },
      time: {
        hour: UTCAppointmentDate.getHours(),
        minute: UTCAppointmentDate.getMinutes(),
      },
    };

    return appointmentUTCDateTime;
  };

  const showTimePicker = () => {
    if (!selectedConsultant) {
      displayMessage(UIText[language].selectConsultantFirst);
      return;
    }

    const {
      consultantMinimumLocalHour,
      consultantMaximumLocalHour,
    } = getConsultantAvailableTimeRange(selectedConsultant);

    setMinimumDate(null);
    setMaximumDate(null);

    setDateTimePickerLabel(
      UIText[language].selectHourWithin(
        consultantMinimumLocalHour,
        consultantMaximumLocalHour,
      ),
    );

    setDateTimePickerLabelColor(Colors.tintColor);

    showMode('time');
  };

  const onPressSchedule = async () => {
    if (!loggedIn) {
      setShowLoginPopup(true);
      return;
    }

    /*  if (!selectedConsultant) {
       displayMessage(UIText[language].selectConsultantFirst);
       return;
     } */

    if (!appointmentDate || !appointmentTime) {
      displayMessage(UIText[language].selectTimeAndDateFirst);
      return;
    }

    if (!isConnectedToInternet) {
      displayMessage(UIText[language].checkInternetConnectionAndTry());
      return;
    }

    const pickedDate = new Date();

    pickedDate.setFullYear(appointmentDate.year);
    pickedDate.setMonth(appointmentTime.month);
    pickedDate.setDate(appointmentTime.date);
    pickedDate.setHours(appointmentTime.localHour);
    pickedDate.setMinutes(appointmentTime.localMinute);

    const selectedTimeAlreadyTaken = rejectIfSelectedTimeAlreadyTaken(
      pickedDate,
    );

    if (selectedTimeAlreadyTaken) {
      return;
    }

    const appointmentUTCDateTime = getAppointmentUTCDateTime();

    navigateToPaymentMethodScreen(appointmentUTCDateTime);
  };

  const navigateToPaymentMethodScreen = appointmentUTCDateTime => {
    navigation.navigate('PaymentMethod', {
      selectedConsultant,
      selectedConsultantUid,
      appointmentUTCDateTime,
    });
  };

  const onPressLogin = () => {
    setShowLoginPopup(false);
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const onSelectTime = date => {
    const pickedDate = isIos ? selectedDate : date;

    if (appointmentDate) {
      pickedDate.setDate(appointmentDate.date);
      pickedDate.setFullYear(appointmentDate.year);
      pickedDate.setMonth(appointmentDate.month);
    }

    const {
      consultantMinimumLocalHour,
      consultantMaximumLocalHour,
    } = getConsultantAvailableTimeRange(selectedConsultant);

    const selectedHourIsInRange = hourIsBetweenTwoHours({
      hour: pickedDate.getHours(),
      twoHours: [consultantMinimumLocalHour, consultantMaximumLocalHour],
    });

    if (!selectedHourIsInRange) {
      const timeNotInRangeMessage = UIText[language].mustSelectHourWithin(
        consultantMinimumLocalHour,
        consultantMaximumLocalHour,
      );

      rejectSelectedTimeAndDate(timeNotInRangeMessage);
      return;
    }

    const selectedTimeAlreadyTaken = rejectIfSelectedTimeAlreadyTaken(
      pickedDate,
    );

    if (selectedTimeAlreadyTaken) {
      return;
    }

    const newAppointmentTime = {
      UTCHour: convertLocalDateToUTC(pickedDate).getHours(),
      UTCMinute: convertLocalDateToUTC(pickedDate).getMinutes(),
      localHour: pickedDate.getHours(),
      localMinute: pickedDate.getMinutes(),
    };

    setAppointmentTime(newAppointmentTime);
    setTimeTextColor(Colors.tintColor);
    setShowPicker(false);
  };
  /* constructor() {
    super();

    this.state = {
      showPicker: false,
      mode: 'time',
      date: new Date(1598051730000),
    };
  } */

  /* componentDidMount = () => {
    console.log('Komponenta konsultant info: ', this.props);
    this.adjustLook();
  }; */

  /* adjustLook = () => {
    this.props.navigation.setOptions({
      title: '',
      headerStyle: {
        shadowOffset: { width: 0, height: 0 },
      },
      /* headerRight: () => (
        <TouchableOpacity
          onPress={() => this.props.navigation.toggleDrawer()}
          style={styles.drawerIconTouch}>
          <Image
            style={styles.drawerIcon}
            source={require('../../../assets/drawerIcon.png')}
          />
        </TouchableOpacity>
      ), */
  /* });
    }; * / */

  /* onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log('odabrano vreme: ', currentDate);
    //setShow(Platform.OS === 'ios');
    //setDate(currentDate);
  }; */
  return (
    <View style={styles.container}>

      <View style={{ width: 40, height: 40, position: "absolute", top: 29, left: 25, zIndex: 999 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <Icon name="ios-arrow-round-back" size={35} style={{}} color={'black'} />
        </TouchableOpacity>
      </View>
      <Header
        navigation={navigation}
        photoUrl={photoUrl}
        loggedIn={loggedIn}
        language={language}
        borderShown={showHeaderBorder}
      />
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
      {/* <ConsultantComponent
          disable={true}
          info={this.props.route.params.info}
        /> */}
      <ScrollView style={{ width: "100%", paddingHorizontal: 25, }}>
        <View style={styles.scheduleAppointmentLayoutContainer}>
          <RoundImage
            style={{ marginVertical: 4 }}
            uri={route.params.photoUrl}
            size={65}
          />
          <View style={{ marginLeft: 5, flex: 1 }}>
            <Text style={[styles.name, { color: Colors.textColor }]}>{route.params.name}</Text>

            <Text style={[styles.bodyText]}>{route.params.bio}</Text>
            <Rating
              size={22}
              rating={route.params.rating}
              language={language}
              style={styles.ratingContainer}
            />
          </View>

          <Text style={[styles.price, { color: '#425c5a', fontWeight: 'bold' }]}>
            {translateDigitsToArabicIfLanguageIsArabic(route.params.pricePerCall, language)}${' '}
            {/* /{' '} */}
            {/*  {UIText[language].call} */}
          </Text>
        </View>

        {/* <View style={styles.reviewsButton}>
          <Text style={styles.reviewsButtonText}>Reviews</Text>
          <Ionicons name="ios-arrow-down" size={17} color="#ffcea2" />
        </View> */}

        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40 }}>
          <Text style={styles.availabilityText}>Availability</Text>
          <Divider style={{backgroundColor: '#000000', height: 1, flex: 1}} />
        </View> */}

        {/*  <Text style={{ marginTop: 21 }}>Days:</Text>
        <Text style={styles.availabilityInfo}>Monday,Friday, Sunday</Text>

        <Text style={{ marginTop: 21 }}>Time:</Text>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <Text>From </Text>
          <Text style={{ fontWeight: '800' }}>11:00 am</Text>
          <Text> to </Text>
          <Text style={{ fontWeight: '800' }}>11:00 pm</Text>
        </View> */}

        <Text style={{ marginTop: 15 }}>Please select the appointment</Text>
        {/* {this.state.showPicker && (
          <DateTimePicker
            //style={{ position: "absolute", top: 0 }}
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={this.state.date}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            //onChange={onChange}
          />
        )} */}
        {/*  <View style={{ flexDirection: 'row' }}>
        <View style={styles.input}>
          <Text style={styles.inputText}>Select date</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.setState({ showPicker: true, mode: 'date' })}
          style={styles.pick}>
          {/* <Ionicons name="md-time" size={24} color="white" />
        </TouchableOpacity>
      </View> */}

        {/* {this.state.showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={this.state.date}
            mode={this.state.mode}
            is24Hour={true}
            display="default"
            //onChange={onChange}
          />
        )} */}

        <IconInputField
          iconName="md-calendar"
          iconFamily={IONICONS}
          title={UIText[language].selectDate}
          placeholder={convertDateToText(
            appointmentDate || defaultAppointmentDate,
            language,
          )}
          textColor={dateTextColor}
          onPress={showDatePicker}
        />

        <IconInputField
          iconName="md-time"
          iconFamily={IONICONS}
          title={UIText[language].selectTime}
          placeholder={convertTimeToText(
            appointmentTime || defaultAppointmentTime,
            language,
          )}
          textColor={timeTextColor}
          onPress={showTimePicker}
        />

        <DateAndTimePicker
          language={language}
          visible={showPicker}
          onPressSelect={pickerMode === 'date' ? onSelectDate : onSelectTime}
          dismiss={() => setShowPicker(false)}
          pickerMode={pickerMode}
          labelColor={dateTimePickerLabelColor}
          label={dateTimePickerLabel}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          value={selectedDate}
          onChange={onDateTimeChange}
        />

        <DismissibleModal
          visible={showLoginPopup}
          okayBtnLabel={UIText[language].login}
          cancelBtnLabel={UIText[language].cancel}
          onPressOk={onPressLogin}
          dismiss={() => setShowLoginPopup(false)}
          style={{ width: '80%' }}
          includeCancelBtn>
          <CustomIcon
            name="ios-log-in"
            iconFamily={IONICONS}
            size={35}
            color={Colors.tintColor}
            style={styles.popupIcon}
          />

          <View style={styles.popupLabelContainer}>
            <Text style={styles.popupLabel}>{UIText[language].loginFirst}</Text>
          </View>
        </DismissibleModal>

        {messageDisplayer}

        <TouchableOpacity onPress={onPressSchedule} style={styles.scheduleButton}>
          <Text style={styles.scheduleButtonText}>Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    //paddingHorizontal: 25,
    //paddingTop: 40,
    alignItems: 'center',
  },
  scheduleAppointmentLayoutContainer: {
    //flex: 1,
    width: '100%',
    backgroundColor: "#f9f8f8",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  drawerIconTouch: {
    marginRight: 25,
    width: 20,
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  drawerIcon: {
    width: 17,
    height: 16,
  },
  reviewsButton: {
    backgroundColor: '#425c5a',
    width: '100%',
    height: 37,
    marginTop: -4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewsButtonText: {
    color: '#ffcea2',
    fontSize: 13,
    marginTop: 5,
    fontWeight: '600',
  },
  availabilityText: {
    color: '#425c5a',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 4,
  },
  availabilityInfo: {
    fontWeight: '800',
    marginTop: 4,
  },
  scheduleButton: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    backgroundColor: '#425c5a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    flexDirection: 'row',
    marginBottom: 11
  },
  scheduleButtonText: {
    color: '#ffcea2',
    fontSize: 15,
    fontWeight: '600',
  },
  popupIcon: {
    alignSelf: 'center',
    marginTop: 10,
  },
  popupLabelContainer: {
    width: '100%',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 10,
  },
  popupLabel: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.grayTextColor,
  },
  pick: {
    width: 67,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#425c5a',
    marginLeft: 6,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#f9f8f8',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  inputText: {
    fontSize: 14,
    fontWeight: '100',
    color: '#b5b4b4',
  },
  picker: {
    position: 'absolute',
    top: 0,
    left: 25,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default ConsultantInfo;
