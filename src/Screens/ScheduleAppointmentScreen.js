/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import Colors from '../Constants/Colors';
import Header from '../Components/Header';
import UIText from '../Constants/UIText';
import ConsultantsHorizontalPicker from '../Components/ConsultantsHorizontalPicker';
import ConsultantCard from '../Components/ConsultantCard';
import IconInputField from '../Components/IconInputField';
import PrimaryBtn from '../Components/PrimaryBtn';
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
import Layout from '../Constants/Layout';
import TabBarScreenStyles from '../SharedStyles/TabBarScreenStyles';
import DateAndTimePicker from '../Components/DateAndTimePicker';
import { IONICONS } from '../Constants/IconFamilies';
import { fetchConsultants } from '../Redux/Actions';
import CustomIcon from '../Components/CustomIcon';
import DismissibleModal from '../Components/DismissibleModal';
import localNotificationDefaultConfig from '../Constants/LocalNotificationDefaultConfig';
import PushNotification from 'react-native-push-notification';

const isIos = Platform.OS === 'ios';

const currentDate = new Date();

const defaultAppointmentDate = {
  year: currentDate.getFullYear(),
  month: currentDate.getMonth(),
  date: currentDate.getDate(),
};
const defaultAppointmentTime = {
  localHour: currentDate.getHours(),
  localMinute: currentDate.getMinutes(),
};

const ScheduleAppointmentScreen = ({ navigation }) => {
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

  const dispatch = useDispatch();

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

  const [messageDisplayer, displayMessage] = useMessageDisplayer();

  useEffect(() => {
    console.log("did mount pocetna! ");
    dispatch(fetchConsultants());
  }, [dispatch]);

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

  const consultantsMapper = consultantUid => {
    const consultant = consultants[consultantUid];
    const {
      name,
      photoUrl,
      pricePerCall,
      rating,
      numberOfRates,
      bio,
    } = consultant;

    return (
      <ConsultantCard
        navigation={navigation}
        selectedId={selectedConsultantUid}
        language={language}
        name={name}
        photoUrl={photoUrl}
        pricePerCall={pricePerCall}
        rating={rating}
        numberOfRates={numberOfRates}
        bio={bio}
        key={consultantUid}
        id={consultantUid}
        onPress={selectConsultantCard}
      />
    );
  };

  const selectConsultantCard = uid => {
    setSelectedConsultant(consultants[uid]);
    setSelectedConsultantUid(uid);
  };

  const showMode = currentMode => {
    displayMessage('');
    setShowPicker(true);
    setPickerMode(currentMode);
  };

  const showDatePicker = () => {
    if (!selectedConsultant) {
      displayMessage(UIText[language].selectConsultantFirst);
      return;
    }

    /* const {consultantMaximumUTCHour} = getConsultantAvailableTimeRange(
      selectedConsultant,
    ); */

    /*  const numberOfWeeksAppointmentMustBeWithin =
      selectedConsultant.numberOfWeeksAppointmentMustBeWithin || 2;
 */
    const currentUTCDate = convertLocalDateToUTC(new Date());

    /*  const todayIsNotAvailable = cantSelectAnAppointmentToday({
      currentUTCDate,
      consultantMaximumUTCHour,
      timeWindow: selectedConsultant.timeWindow || 20,
    }); */

    let newMinimumDate = new Date();
    let newMaximumDate = new Date();

    /*  if (todayIsNotAvailable) {
      addDaysToDate(newMinimumDate, 1);
    } */

    //addWeeksToDate(newMaximumDate, numberOfWeeksAppointmentMustBeWithin);

    setMinimumDate(newMinimumDate);
    setMaximumDate(newMaximumDate);
    /* setDateTimePickerLabel(
      UIText[language].selectDateWithin(numberOfWeeksAppointmentMustBeWithin),
    ); */
    setDateTimePickerLabelColor(Colors.tintColor);
    showMode('date');
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

  const rejectSelectedTimeAndDate = message => {
    if (isIos) {
      setDateTimePickerLabel(message);
      setDateTimePickerLabelColor(Colors.red);
    } else {
      displayMessage(message);
    }
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

  const navigateToPaymentMethodScreen = appointmentUTCDateTime => {
    navigation.navigate('PaymentMethod', {
      selectedConsultant,
      selectedConsultantUid,
      appointmentUTCDateTime,
    });
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

  const onPressLogin = () => {
    setShowLoginPopup(false);
    navigation.navigate('Auth');
  };

  const onScroll = event =>
    setShowHeaderBorder(event.nativeEvent.contentOffset.y > 1);

  const onRefresh = () => {
    dispatch(fetchConsultants());
    resetState();
  };

  const resetState = () => {
    setSelectedConsultantUid('');
    setSelectedConsultant(null);
    setDateTextColor(Colors.placeHolderColor);
    setTimeTextColor(Colors.placeHolderColor);
    setSelectedDate(new Date());
    setAppointmentDate(null);
    setAppointmentTime(null);
    setPickerMode('date');
    setShowPicker(false);
    setMinimumDate(null);
    setMaximumDate(null);
    setDateTimePickerLabel('');
    setDateTimePickerLabelColor(Colors.tintColor);
    setShowHeaderBorder(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />

      <Header
        navigation={navigation}
        photoUrl={photoUrl}
        loggedIn={loggedIn}
        language={language}
        borderShown={showHeaderBorder}
      />

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={25}
        refreshControl={
          <RefreshControl
            refreshing={loadingConsultants}
            onRefresh={onRefresh}
            tintColor={Colors.fadedTextColor}
            colors={['#0077bc']}
          />
        }>

        {/*  <Text style={[styles.selectConsultantTitle, {color: Colors.textColor}]}>
          {UIText[language].selectConsultant}
        </Text> */}

        {/*  <FlatList
          style={{width: "100%", backgroundColor: "red", height: 100}}
          data={consultants}
          renderItem={({item}) => <View></View>}
        /> */}


        <View style={styles.aboutMeDialog}>
          <Image
            style={styles.aboutMeIcon}
            source={require("../../assets/images/aboutMeIcon.png")} />
          <View style={styles.infoAboutMeDialog}>
            <Text style={styles.aboutMeText}>Over 30 interpreters with verified experience in the field of Dream interpretation</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AboutUsScreen")}
              style={styles.aboutMeButton}>
              <Text style={styles.aboutMeButtonText}>Read me</Text>
              {/* <Ionicons name="ios-arrow-round-forward" size={30} color="#ffffff" /> */}
            </TouchableOpacity>
          </View>
        </View>



        {!loadingConsultants && Object.keys(consultants).map(consultantsMapper)}
        {/* <ConsultantsHorizontalPicker>
          {!loadingConsultants &&
            Object.keys(consultants).map(consultantsMapper)}
        </ConsultantsHorizontalPicker> */}

        {/*  <IconInputField
          iconName="md-calendar"
          iconFamily={IONICONS}
          title={UIText[language].selectDate}
          placeholder={convertDateToText(
            appointmentDate || defaultAppointmentDate,
            language,
          )}
          textColor={dateTextColor}
          onPress={showDatePicker}
        /> */}
        {/*  <IconInputField
          iconName="md-time"
          iconFamily={IONICONS}
          title={UIText[language].selectTime}
          placeholder={convertTimeToText(
            appointmentTime || defaultAppointmentTime,
            language,
          )}
          textColor={timeTextColor}
          onPress={showTimePicker}
        /> */}
      </ScrollView>

      {/* <View style={TabBarScreenStyles.bottomBtnContainer}>
        <PrimaryBtn
          label={UIText[language].scheduleAppointment}
          onPress={onPressSchedule}
        />
      </View> */}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  selectConsultantTitle: {
    alignSelf: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 4,
    marginBottom: Layout.screenHeight > 850 ? 10 : 0,
  },
  popupIcon: {
    alignSelf: 'center',
    marginTop: 10,
  },
  aboutMeDialog: {
    width: "100%",
    height: 100,
    backgroundColor: "#f9f8f8",
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flexDirection: "row",
    marginTop: 7
  },
  aboutMeIcon: {
    width: 65,
    height: 60,
    marginTop: 10,
    marginLeft: 5
  },
  infoAboutMeDialog: {
    flex: 1,
    marginLeft: 18,
    marginRight: 10,
    justifyContent: "center"
  },
  aboutMeText: {
    fontSize: 12,
    color: "#425c5a"
  },
  aboutMeButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#425c5a",
    borderRadius: 5,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  aboutMeButtonText: {
    color: "#ffffff",
    fontSize: 12,
    marginRight: 20
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
});

ScheduleAppointmentScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ScheduleAppointmentScreen;
