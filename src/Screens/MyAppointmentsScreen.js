import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import Colors from '../Constants/Colors';
import { USER } from '../Constants/UserTypes';
import Header from '../Components/Header';
import UIText from '../Constants/UIText';
import { OUTGOING } from '../Constants/CallDirections';
import { updateAppointmentStatus, updateUserData, deleteAppointment } from '../Networking/Firestore';
import {
  REQUESTED,
  ACCEPTED,
  DECLINED,
  COMPLETED,
} from '../Constants/AppointmentStatusTypes';
import Layout from '../Constants/Layout';
import {
  setCurrentCallData,
  setShowCallScreen,
  setAppointments,
  fetchAppointments,
  setUpcomingAppointmentDates,
} from '../Redux/Actions';
import { areArraysEqual, getUpcomingAppointmentDates, reportProblem } from '../Utilities/Tools';
import SegmentedControl from '@react-native-community/segmented-control';
import AppointmentsContainer from '../Components/AppointmentsContainer';
import DismissibleModal from '../Components/DismissibleModal';
import CustomIcon from '../Components/CustomIcon';
import { IONICONS } from '../Constants/IconFamilies';
import { chargeConsultationPrice } from '../Networking/Https';
import useMessageDisplayer from '../Hooks/useMessageDisplayer';
import { WAITING_PEER } from '../Constants/CallStatus';

const scrollViewVerticalPadding = 20;

const segmentedControlHeight = 32;

const scrollViewHeight =
  Layout.screenHeight -
  Layout.rootScreensAbsoluteHeaderHeight -
  Layout.tabBarMaxHeight -
  scrollViewVerticalPadding * 2 -
  segmentedControlHeight -
  20;

const segmentedControlStatusValues = [REQUESTED, ACCEPTED, COMPLETED];

const MyAppointmentsScreen = ({ navigation }) => {
  const {
    uid,
    photoUrl,
    loggedIn,
    language,
    userType,
    loadingAppointments,
    appointments,
    consultants,
    upcomingAppointmentDates,
    isConnectedToInternet,
  } = useSelector(
    state => ({
      uid: state.uid,
      photoUrl: state.photoUrl,
      loggedIn: state.loggedIn,
      language: state.language,
      userType: state.userType,
      loadingAppointments: state.loadingAppointments,
      appointments: state.appointments,
      consultants: state.consultants,
      upcomingAppointmentDates: state.upcomingAppointmentDates,
      isConnectedToInternet: state.isConnectedToInternet,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [showChargingModal, setShowChargingModal] = useState(false);
  const [charging, setCharging] = useState(false);
  const [chargeModalLabel, setChargeModalLabel] = useState('');
  const [chargeModalLabelColor, setChargeModalLabelColor] = useState(Colors.tintColor);
  
  const [messageDisplayer, displayMessage] = useMessageDisplayer();

  useEffect(() => {
    if (!loggedIn) return;
    dispatch(fetchAppointments(userType, uid));
  }, [loggedIn]);

  useEffect(() => {
    if (Object.keys(appointments).length === 0) return;
    try {
      removeDeclinedAppointments();
      updateAppointmentsInUserDoc();
    } catch (error) {
      reportProblem(error);
    }
  }, [appointments]);

  const updateAppointmentsInUserDoc = () => {
    const updatedUpcomingAppointmentDates = getUpcomingAppointmentDates(appointments, userType);

    if (!areArraysEqual(updatedUpcomingAppointmentDates, upcomingAppointmentDates)) {
      dispatch(setUpcomingAppointmentDates(updatedUpcomingAppointmentDates));
      updateUserData(uid, {upcomingAppointmentDates: updatedUpcomingAppointmentDates});
    }
  };

  const removeDeclinedAppointments = () => {
    const updatedAppointments = {...appointments};
    let appointmentsObjectIsModified = false;

    for (const appointmentId in updatedAppointments) {
      const appointment = updatedAppointments[appointmentId];

      if (
        appointment.status === DECLINED
      ) {
        delete updatedAppointments[appointmentId];
        try {
          deleteAppointment(appointmentId);
        } catch (error) {/*It may have been deleted by the other party first*/}
        appointmentsObjectIsModified = true;
      }
    }

    if (appointmentsObjectIsModified)
      dispatch(setAppointments(updatedAppointments));
  };

  const startAppointment = async appointmentId => {
    if (!isConnectedToInternet) {
      displayMessage(UIText[language].checkInternetConnectionAndTry());
      return;
    }

    const { parties } = appointments[appointmentId];

    const peerUid = userType == USER ? parties.consultant.uid : parties.user.uid;
    const peerName = userType == USER ? parties.consultant.name : parties.user.name;

    dispatch(setCurrentCallData({
      appointmentId,
      uid: peerUid,
      name: peerName,
      photoUrl: null,
      direction: OUTGOING,
      callStatus: WAITING_PEER,
    }));

    dispatch(setShowCallScreen(true));
  };

  const respondToAppointment = (appointmentId, accepted, charged=false) => {
    if (!isConnectedToInternet) {
      displayMessage(UIText[language].checkInternetConnectionAndTry());
      return;
    }

    if (charging) return;

    const appointment = appointments[appointmentId];
    const status = accepted ? ACCEPTED : DECLINED;

    if (accepted && !charged) {
      setSelectedAppointmentId(appointmentId);
      const consultationPrice = appointments[appointmentId].price;
      setChargeModalLabel(UIText[language].chargeConsultationPrice(consultationPrice));
      setChargeModalLabelColor(Colors.tintColor);
      setShowChargingModal(true);
      return;
    }

    updateAppointmentStatus(appointmentId, status);
    const updatedAppointment = {...appointment, status: status};

    const updatedAppointmentsObject = {
      ...appointments,
      [appointmentId]: updatedAppointment,
    };

    dispatch(setAppointments(updatedAppointmentsObject));
  };

  const onPressCharge = async () => {
    setCharging(true);

    const { parties: { user, consultant } } = appointments[selectedAppointmentId];


    try {
      const response = await chargeConsultationPrice(selectedAppointmentId, user.uid, consultant.uid);
      const charge = response.data;
      displayMessage(UIText[language].amountChargedSuccessfully);
      setShowChargingModal(false);
      respondToAppointment(selectedAppointmentId, true, true);
      console.log('onPressCharge -> charge', charge);
    } catch (error) {
      console.log("onPressCharge -> error.response.status", error.response.status);
      handleChargeError(error);
    }

    setCharging(false);
  };

  const handleChargeError = error => {  
    setChargeModalLabelColor(Colors.red);
    switch (error.response.status) {
      case 470:
        setChargeModalLabel(UIText[language].insufficientBalance);
        break;

      case 471:
      case 570:
        setChargeModalLabel(UIText[language].paymentCouldNotBeCompleted);
        reportProblem(error);
        break;
    }
  }

  if (!loggedIn) {
    return (
      <View style={styles.container}>
        <Header
          navigation={navigation}
          photoUrl={photoUrl}
          loggedIn={loggedIn}
          language={language}
        />

        <View style={styles.loginFirstMessageContainer}>
          <Text style={styles.loginFirstOrNoAppointmentsMessage}>
            {UIText[language].loginToViewAppointments}
          </Text>
        </View>
      </View>
    );
  }

  const appointmentsStatus = segmentedControlStatusValues[selectedSegmentIndex];

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle="default"
        backgroundColor="rgba(0, 0, 0, 0.1)"
      />

      <Header
        navigation={navigation}
        photoUrl={photoUrl}
        loggedIn={loggedIn}
        language={language}
      />

      <SegmentedControl
        style={styles.segmentedControl}
        values={[UIText[language].requests, UIText[language].upcoming, UIText[language].completed]}
        selectedIndex={selectedSegmentIndex}
        onChange={event => {
          setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
        }}
        appearance='light'
      />

      <ScrollView
        scrollEventThrottle={25}
        contentContainerStyle={styles.scrollViewContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={loadingAppointments}
            onRefresh={() => dispatch(fetchAppointments(userType, uid))}
            tintColor={Colors.fadedTextColor}
            colors={['#0077bc']}
          />
        }>
        <AppointmentsContainer
          appointments={appointments}
          appointmentsStatus={appointmentsStatus}
          userType={userType}
          language={language}
          onPressCall={startAppointment}
          respondToAppointment={respondToAppointment}
          consultants={consultants}
          noAppointmentsContainerHeight={scrollViewHeight}
          loading={loadingAppointments}
          charging={charging}
        />
      </ScrollView>

      <DismissibleModal
        visible={showChargingModal}
        okayBtnLabel={UIText[language].charge}
        onPressOk={onPressCharge}
        dismiss={() => setShowChargingModal(false)}
        loading={charging}>
        <CustomIcon
          name={'ios-card'}
          iconFamily={IONICONS}
          size={35}
          color={Colors.tintColor}
          style={styles.modalIcon}
        />

        <View style={styles.modalLabelContainer}>
          <Text style={[styles.modalLabel, {color: chargeModalLabelColor}]}>
            { chargeModalLabel }
          </Text>
        </View>
      </DismissibleModal>

      { messageDisplayer }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  loginFirstMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointmentsMessageContainer: {
    width: '100%',
    height: scrollViewHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginFirstOrNoAppointmentsMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.fadedTextColor,
    fontSize: 20,
  },
  segmentedControl: {
    height: segmentedControlHeight,
    width: '95%',
    alignSelf: 'center',
    marginTop: 5,
  },
  scrollViewContentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: scrollViewVerticalPadding,
    paddingBottom: 70 + scrollViewVerticalPadding,
  },
  modalIcon: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 10,
  },
  modalLabelContainer: {
    width: '100%',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 3,
    marginTop: 15,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

MyAppointmentsScreen.propTypes = {
  navigation: PropTypes.object,
};

export default MyAppointmentsScreen;
