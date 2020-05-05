import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Platform,
  StatusBar,
  AppState,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import RoundImage from '../Components/RoundImage';
import {ACTIVE, WAITING_PEER, INCOMING} from '../Constants/CallStatus';
import {LARGE, SMALL} from '../Constants/CallBtnSizes';
import Layout from '../Constants/Layout';
import CallBtn from '../Components/CallBtn';
import {DECLINE, MUTE, SPEAKER} from '../Constants/CallBtnTypes';
import {twoDigits, filterOutNonNumberCharacters} from '../Utilities/Tools';
import {RtcEngine} from 'react-native-agora';
import AgoraConfig from '../Configs/AgoraConfig';
import { getAudioPermissions } from '../Utilities/Permissions';
import Colors from '../Constants/Colors';
import useProximity from '../Hooks/useProximity';
import InCallManager from 'react-native-incall-manager';
import UIText from '../Constants/UIText';
import { USER, CONSULTANT } from '../Constants/UserTypes';
import { setCurrentCallData, setShowCallScreen, setAppointments } from '../Redux/Actions';
import { fetchUserData, updateConsultantRating, updateAppointmentStatus } from '../Networking/Firestore';
import Stars from '../Components/Stars';
import DismissibleModal from '../Components/DismissibleModal';
import CustomIcon from '../Components/CustomIcon';
import { FEATHER } from '../Constants/IconFamilies';
import { sendChannelInvitation } from '../Networking/Https';
import PushNotification from 'react-native-push-notification';
import localNotificationDefaultConfig from '../Constants/LocalNotificationDefaultConfig';
import { MAXIMUM_NUMBER_OF_MINUTES_PER_CALL } from '../Constants/ClientPreferences';
import { COMPLETED } from '../Constants/AppointmentStatusTypes';
import useMessageDisplayer from '../Hooks/useMessageDisplayer';
import NavigationHeader from '../Components/NavigationHeader';
import { OUTGOING } from '../Constants/CallDirections';

const isIos = Platform.OS === 'ios';

const muteAndSpeakerBtnsTranslation = Layout.screenWidth * 0.3;


const CallScreen = props => {

  const {language, userType, uid, name, photoUrl, appointments} = useSelector(
    state => ({
      language: state.language,
      userType: state.userType,
      uid: state.uid,
      name: state.name,
      photoUrl: state.photoUrl,
      appointments: state.appointments,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const [componentMounted, setComponentMounted] = useState(false);
  const [appointmentId, setAppointmentId] = useState('');
  const [peerUid, setPeerUid] = useState('');
  const [peerName, setPeerName] = useState('');
  const [peerPhotoUrl, setPeerPhotoUrl] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [callDirection, setCallDirection] = useState('');
  const [speakerIsActive, setSpeakerIsActive] = useState(false);
  const [muteIsActive, setMuteIsActive] = useState(false);
  const [timer, setTimer] = useState('00:00:00');
  const [timerExceededOneHour, setTimerExceededOneHour] = useState(false);
  const [joinedRTCChannel, setJoinedRTCChannel] = useState(false);
  const [RTCId] = useState(filterOutNonNumberCharacters(uid));
  const [proximityDetectionIsEnabled, setProximityDetectionIsEnabled] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [userMessage, setUserMessage] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [unAppliedConsultantRating, setUnAppliedConsultantRating] = useState(0);
  const [channelInvitationSentToPeer, setChannelInvitationSentToPeer] = useState(false);
  const [canSendInvitation, setCanSendInvitation] = useState(false);
  const [waitingPeerMessage, setWaitingPeerMessage] = useState('');
  const [joinCallMessage, setJoinCallMessage] = useState('');

  let timerRef = useRef(null);

  const [messageDisplayer, displayMessage] = useMessageDisplayer();

  const hasProximity = useProximity();

  useEffect(() => {
		AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      setShowRatingModal(false);
      try {
        RtcEngine.destroy();
      } catch {/*skip*/}
    };
  }, []);

  useEffect(() => {
    if (appState === 'active' && !componentMounted)
      onMount();
  }, [appState]);

  useEffect(() => {
    switch (callStatus) {
      case WAITING_PEER:
        requestAudioPermissionsAndjoinCallChannel();

        // Wait 5 seconds for the peer to join the cannel and then 
        // allow sending the invitation if they didn't join yet.
        setTimeout(() => setCanSendInvitation(true), 5000);
        break;
    
      case ACTIVE:
        if (appState !== 'active') {
          PushNotification.localNotification({
            ...localNotificationDefaultConfig,
            message: UIText[language].userJoinedChannel(peerName),
          });
        }
        break;
    }
  }, [callStatus]);

  useEffect(() => {
    if (peerName) {
      setWaitingPeerMessage(UIText[language].waitForPeerToJoinChannel(peerName));
      setJoinCallMessage(UIText[language].joinCallWith(peerName));
    }
  }, [peerName]);

  useEffect(() => {
    if (proximityDetectionIsEnabled)
      hasProximity ? InCallManager.turnScreenOff() : InCallManager.turnScreenOn();
  }, [hasProximity, proximityDetectionIsEnabled]);

  useEffect(() => {
		// Only send the invitation after the local user has joined the RTC channel
		// and after 5 seconds has passed 
		// and if the call status is still waiting peer
    // and if an invitation hasn't been already sent.
    if (canSendInvitation) {
      console.log("joinedRTCChannel", joinedRTCChannel)
      console.log("canSendInvitation", canSendInvitation)
      console.log("callStatus", callStatus)
      console.log("channelInvitationSentToPeer", channelInvitationSentToPeer)
    }
    if (
			joinedRTCChannel &&
			(canSendInvitation || callDirection === OUTGOING) &&
      callStatus === WAITING_PEER &&
      !channelInvitationSentToPeer
    ) {
      invitePeerToChannel();
    }
  }, [joinedRTCChannel, callStatus, canSendInvitation]);

  const onMount = async () => {
    setComponentMounted(true);
    setShowRatingModal(false);
    const callData = getCallData();

    if (callData.uid && callData.photoUrl === null)
      fetchPeerPhotoUrl(callData.uid);

    setUpRTCEngine();
    mapCallDataToState(callData);
  };

  const invitePeerToChannel = async () => {
    setChannelInvitationSentToPeer(true);

    let response;

    try {
      response = await sendChannelInvitation(
        peerUid,
        appointmentId,
        name,
        photoUrl,
      );
      displayMessage(UIText[language].sendingInvitationTo(peerName));
    } catch (error) {
      setWaitingPeerMessage(UIText[language].peerNotConnected(peerName));
    }
  };

  const fetchPeerPhotoUrl = async peerUid => {
    try {
      const peerDoc = await fetchUserData(peerUid);
      if (peerDoc && peerDoc.exists) {
        const { photoUrl } = peerDoc.data();
        setPeerPhotoUrl(photoUrl);
      }
    } catch (error) {
      reportProblem(error);
    }
  };

  const handleAppStateChange = nextAppState => {
    setAppState(nextAppState);
  };

  const setUpRTCEngine = () => {
    RtcEngine.init(AgoraConfig);

    RtcEngine.setDefaultAudioRouteToSpeakerphone(false);

    RtcEngine.on('joinChannelSuccess', data => {
      // When Local user joins RTC channel
      console.log(`joined the channel successfully form ${name}'s side`);
      setJoinedRTCChannel(true);
    });

    RtcEngine.on('userJoined', data => {
      startCall();
    });
  };

  const requestAudioPermissionsAndjoinCallChannel = async () => {
    await getAudioPermissions();
    console.log(`joining the channel from ${name}'s side`);
    const channelId = appointmentId;
    RtcEngine.joinChannel(channelId, RTCId);
    setJoinedRTCChannel(true);
  };

  const getCallData = () => {
    let callData = props;
    return callData;
  };

  const dismissCallScreen = () => {
    dispatch(setCurrentCallData(null));
    dispatch(setShowCallScreen(false));
  }

  const mapCallDataToState = callData => {
    const {
      appointmentId: fetchedAppointmentId,
      uid,
      name,
      photoUrl,
      callStatus,
      direction,
    } = callData;

    console.log(`callStatus from the ${Platform.OS} side`, callStatus);
    
    setAppointmentId(fetchedAppointmentId);
    setPeerUid(uid);
    setPeerName(name);
    setPeerPhotoUrl(photoUrl);
    setCallStatus(callStatus);
    setCallDirection(direction || '');
  };

  const updateAppointmentStatusToCompleted = () => {
    if (!appointmentId) return;

    const appointment = appointments[appointmentId];

    if (userType === CONSULTANT)
      updateAppointmentStatus(appointmentId, COMPLETED);

    const updatedAppointment = {...appointment, status: COMPLETED};

    const updatedAppointmentsObject = {
      ...appointments,
      [appointmentId]: updatedAppointment,
    };

    dispatch(setAppointments(updatedAppointmentsObject));
  }

  const endCall = (because='', successfully=true) => {
    try {
      RtcEngine.destroy();
    } catch (error) {/*skip*/}
    setProximityDetectionIsEnabled(false);
    setUserMessage(because);
    clearInterval(timerRef.current);

    callStatus === ACTIVE && vibrate();
    successfully && updateAppointmentStatusToCompleted();

    setTimeout(() => {
      if (userType === USER && successfully) {
        setShowRatingModal(true);
        return;
      }

      dismissCallScreen();
    }, because.length * 120);
  };

  const startCall = () => {
    InCallManager.setSpeakerphoneOn(false);
    RtcEngine.muteLocalAudioStream(false);
    RtcEngine.setEnableSpeakerphone(false);

    setProximityDetectionIsEnabled(true);
    startTimer();
    vibrate();

    setupUserOfflineEventListener();
    setCallStatus(ACTIVE);
  };

  const onSubmitRating = () => {
    updateConsultantRating(peerUid, uid, unAppliedConsultantRating);
    onDismissRatingModal();
  };

  const onDismissRatingModal = () => {
    setShowRatingModal(false);
    dismissCallScreen();
  };

  const setupUserOfflineEventListener = () => {
    const callStartTimeStamp = Date.now();

    RtcEngine.on('userOffline', data => {
      const differenceInSeconds = getDifferenceInSeconds(callStartTimeStamp);
      if (Math.abs(differenceInSeconds - MAXIMUM_NUMBER_OF_MINUTES_PER_CALL * 60) < 5)
        endCall(UIText[language].consultationTimedOut);
      else endCall();
    });
  };

  const onPressMute = () => {
    const muteState = !muteIsActive;
    setMuteIsActive(muteState);
    RtcEngine.muteLocalAudioStream(muteState);
  };

  const onPressSpeaker = () => {
    const speakerState = !speakerIsActive;
    setSpeakerIsActive(speakerState);
    RtcEngine.setEnableSpeakerphone(speakerState);
  };

  const getDifferenceInSeconds = callStartTimestamp => {
    const now = Date.now();
    return Math.floor((now - callStartTimestamp) / 1000);
  };

  const startTimer = () => {
    const callStartTimestamp = Date.now();
    timerRef.current = setInterval(async () => {

      const differenceInSeconds = getDifferenceInSeconds(callStartTimestamp);

      const hours = Math.floor(differenceInSeconds / (60 * 60));
      const minutes = Math.floor((differenceInSeconds / 60) % 60);
      const seconds = differenceInSeconds % 60;

      minutes === MAXIMUM_NUMBER_OF_MINUTES_PER_CALL &&
        endCall(UIText[language].consultationTimedOut);

      const newTimer =
          twoDigits(hours) + ':' + twoDigits(minutes) + ':' + twoDigits(seconds);
      setTimerExceededOneHour(hours > 0);
      setTimer(newTimer);
    }, 1000);
  };

  const vibrate = () => {
    Vibration.vibrate(80);
  };

  if (!callStatus) return <View style={styles.container} />

  if ([WAITING_PEER, INCOMING].includes(callStatus)) return (
    <View style={[styles.container, styles.centerChildren]}>
      <StatusBar
        translucent
        barStyle="default"
        backgroundColor="rgba(0, 0, 0, 0.1)"
      />

      <NavigationHeader
        language={language}
        absolute
        onPressBack={() => endCall('', false, true)}
      />

      <Text style={styles.waitMessageOrJoin}>
        {callStatus === WAITING_PEER ? waitingPeerMessage : joinCallMessage}
      </Text>

      {callStatus === INCOMING && (
        <TouchableOpacity style={styles.joinCallBtn} onPress={() => setCallStatus(WAITING_PEER)}>
          <Text style={styles.joinCallBtnLabel}>{UIText[language].joinCall}</Text>
        </TouchableOpacity>
      )}

      { messageDisplayer }
    </View>
  );

  const container = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: peerPhotoUrl ? 'rgba(0, 0, 0, .45)' : '#444444',
        },
      ]}>
      <View style={styles.peerImageContainer}>
        <RoundImage
          size={Math.min(
            Layout.screenHeight * 0.25,
            Layout.screenWidth * 0.4,
          )}
          uri={peerPhotoUrl}
        />
      </View>

      <Text style={styles.name}>{peerName}</Text>

      {callStatus === ACTIVE && (
        <Text style={styles.timer}>
          {!timerExceededOneHour ? timer.slice(3) : timer}
        </Text>
      )}
      
      <Text style={styles.userMessage}>
        {userMessage}
      </Text>

      <View style={styles.callBtnsRow}>

        <CallBtn
          onPress={onPressMute}
          size={SMALL}
          type={MUTE}
          active={muteIsActive}
          style={[styles.callBtns, {transform: [{translateX: -muteAndSpeakerBtnsTranslation}]}]}
        />

        <CallBtn
          onPress={() => endCall()}
          size={LARGE}
          type={DECLINE}
          style={[styles.callBtns, {transform: [{rotate: '135deg'}]}]}
        />
        
        <CallBtn
          onPress={onPressSpeaker}
          size={SMALL}
          type={SPEAKER}
          active={speakerIsActive}
          style={[styles.callBtns, {transform: [{translateX: muteAndSpeakerBtnsTranslation}]}]}
        />
      </View>
    </View>
  );

  return (
    <>
      <StatusBar
        translucent
        barStyle="default"
        backgroundColor="rgba(0, 0, 0, 0.1)"
      />

      {peerPhotoUrl === '' || peerPhotoUrl == undefined ? (
        container
      ) : (
        <ImageBackground
          style={{flex: 1}}
          source={{uri: peerPhotoUrl, cache: 'force-cache'}}
          blurRadius={isIos ? 10 : 4}>
          {container}
        </ImageBackground>
      )}

      <DismissibleModal
        visible={showRatingModal}
        okayBtnLabel={UIText[language].submit}
        onPressOk={onSubmitRating}
        dismiss={onDismissRatingModal}
        animateOnDismiss={false}>
        <View style={styles.ratingPopupContainer}>
          <CustomIcon
            iconFamily={FEATHER}
            name="check-circle"
            color={Colors.tintColor}
            size={60}
            style={{marginBottom: 20, marginTop: -25}}
          />

          <Text style={styles.consultationCompleted}>{UIText[language].consultationCompleted}</Text>

          <Stars
            size={Layout.screenWidth * 0.11}
            rating={unAppliedConsultantRating}
            onRate={rating => setUnAppliedConsultantRating(rating)}
            language={language}
          />
        </View>
      </DismissibleModal>

      { messageDisplayer }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  waitMessageOrJoin: {
    fontSize: 20,
    color: Colors.fadedTextColor,
    textAlign: 'center',
    paddingHorizontal: '2%',
  },
  joinCallBtn: {
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    padding: 10,
  },
  joinCallBtnLabel: {
    color: Colors.tintColor,
    fontSize: 18,
  },
  peerImageContainer: {
    marginTop: '20%',
  },
  name: {
    marginTop: 30,
    color: '#fff',
    fontSize: 19,
    textAlign: 'center',
  },
  timer: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  userMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: '2%',
  },
  callBtnsRow: {
    position: 'absolute',
    bottom: '20%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  callBtns: {
    position: 'absolute',
    alignSelf: 'center',
  },
  centerChildren: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingPopupContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultationCompleted: {
    fontSize: 18,
    color: Colors.fadedTextColor,
    paddingHorizontal: '2%',
    textAlign: 'center',
    marginVertical: 15,
  }
});

CallScreen.propTypes = {
  prop: PropTypes.object,
};

export default CallScreen;