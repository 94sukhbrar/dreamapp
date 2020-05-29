import { CHANNEL_INVITATION } from '../Constants/MessageTypes';
import { isTimeStampOlderThanEightMinutes } from './DateAndTimeTools';
import { setItemsInAsyncStorage, retrieveItemFromAsyncStorage } from './AsyncStorageTools';
import { RECEIVING_CHANNEL_INVITATION, CURRENT_CALL_DATA } from '../Constants/AsyncStorageKeys';
import { BACKGROUND } from '../Constants/AppStates';
import { store } from '../Redux/Store';
import localNotificationDefaultConfig from '../Constants/LocalNotificationDefaultConfig';
import PushNotification from 'react-native-push-notification';
import UIText from '../Constants/UIText';
import { setShowCallScreen, setCurrentCallData } from '../Redux/Actions';
import { reportProblem } from './ErrorHandlers';
import { Platform } from 'react-native';

const isIos = Platform.OS === 'ios';

export const handleFcmMessage = (message, appState, dispatch=null) => {
  switch (message.data.messageType) {
    case CHANNEL_INVITATION:
      handleChannelInvitationMessage(message, appState, dispatch);
      break;
  }
};


const handleChannelInvitationMessage = async (message, appState, dispatch) => {
  __DEV__ && console.log("handleChannelInvitationMessage -> message", message);

  try {
    const {
      timestamp: messageTimeStamp,
      name: peerName,
      language,
    } = message.data;

    if (await thereAlreadyIsActiveCall()) {
      const currentCallData = await getCurrentCallData(appState);
      if (
        currentCallData.appointmentId === message.data.appointmentId &&
        appState === BACKGROUND
      ) {
        triggerLocalNotification(
          UIText[language].appointmentIsNowNotification(peerName),
        );
      } else {
        triggerLocalNotification(
          UIText[language].appointmentMessageWhileAnotherCallIsActive(
            peerName,
          ),
        );
      }
      return;
    };
  
    if (!isTimeStampOlderThanEightMinutes(messageTimeStamp)) {
      triggerLocalNotification(
        UIText[language].appointmentIsNowNotification(peerName),
      );
  
      if (appState === BACKGROUND) {
        try {
          store.dispatch(setShowCallScreen(true));
          store.dispatch(setCurrentCallData(message.data));
        } catch (error) {
          reportProblem(error);
          setItemsInAsyncStorage([
            {key: RECEIVING_CHANNEL_INVITATION, value: true},
            {key: CURRENT_CALL_DATA, value: message.data},
          ]);
        }
      } else {
        dispatch(setShowCallScreen(true));
        dispatch(setCurrentCallData(message.data));
      }
    } else {
     triggerLocalNotification(
       UIText[language].missedConsultationNotification(peerName),
     );
    }
  } catch (error) {
    reportProblem(error);
  }
};


const triggerLocalNotification = message => {
  if (isIos) return;

  PushNotification.localNotification({
    ...localNotificationDefaultConfig,
    message,
  });
};

const thereAlreadyIsActiveCall = async appState => {
  if (appState === BACKGROUND) {
    try {
        return store.getState().showCallScreen;
    } catch (error) {
      const receivingChannelInvitation = await retrieveItemFromAsyncStorage(
        RECEIVING_CHANNEL_INVITATION,
      );
      return receivingChannelInvitation;
    }
  } else {
    return store.getState().showCallScreen;
  }
};

const getCurrentCallData = async appState => {
  if (appState === BACKGROUND) {
    try {
        return store.getState().currentCallData;
    } catch (error) {
      const currentCallData = await retrieveItemFromAsyncStorage(
        CURRENT_CALL_DATA,
      );
      return currentCallData;
    }
  } else {
    return store.getState().currentCallData;
  }
};