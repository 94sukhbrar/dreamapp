import { useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector, useDispatch} from 'react-redux';
import useLogout from './useLogout';
import { isDeviceLanguageArabic, logData } from '../Utilities/Tools';
import { isTimeStampOlderThanEightMinutes } from '../Utilities/DateAndTimeTools';
import { setLanguage, setCurrentCallData, setShowCallScreen, setDeviceLanguage, setIsConnectedToInternet } from '../Redux/Actions';
import useNotificationRegisterer from './useNotificationRegisterer';
import messaging from '@react-native-firebase/messaging';
import { handleFcmMessage } from '../Utilities/NotificationsAndMessagesHandlers';
import { RECEIVING_CHANNEL_INVITATION, CURRENT_CALL_DATA } from '../Constants/AsyncStorageKeys';
import { retrieveItemsFromAsyncStorageAndRemoveThem } from '../Utilities/AsyncStorageTools';
import { updateUserPrivateData } from '../Networking/Firestore';
import { FOREGROUND } from '../Constants/AppStates';
import PushNotification from 'react-native-push-notification';
import localNotificationDefaultConfig from '../Constants/LocalNotificationDefaultConfig';
import UIText from '../Constants/UIText';
import { Platform } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";

const isIos = Platform.OS === 'ios';

const useInitializer = () => {
  const { state, loggedIn, keepLoggedIn, language, languageIsSetManually, uid } = useSelector(
    state => ({
      state: __DEV__ ? state : null,
      loggedIn: state.loggedIn,
      keepLoggedIn: state.keepLoggedIn,
      language: state.language,
      languageIsSetManually: state.languageIsSetManually,
      uid: state.uid,
    }),
    shallowEqual,
  );
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);

  let unsubscribeMessageHandler = useRef(null);

  const netInfo = useNetInfo();

  const logout = useLogout();
  const registerForNotification = useNotificationRegisterer();


  useEffect(() => {
    setLanguageToMatchDeviceLocale();

    if (loggedIn && !keepLoggedIn) {
      logout();
      setLoading(false);
      return;
    }

    if (loggedIn) {
      registerForNotification(uid);
      checkIfReceivingAnInvitation();
    } else {
      setLoading(false);
    }

    setUpMessageHandler();
    return () => {
      unsubscribeMessageHandler.current();
    };
  }, []);

  useEffect(() => {
    dispatch(setIsConnectedToInternet(netInfo.isConnected));
  }, [netInfo]);

  useEffect(() => {
    logData(state);
  }, [state]);

  const setLanguageToMatchDeviceLocale = () => {
    const deviceLanguage = isDeviceLanguageArabic() ? 'ar' : 'en';

    dispatch(setDeviceLanguage(deviceLanguage));

    if (languageIsSetManually) return;


    if (deviceLanguage !== language) {
      loggedIn && updateUserPrivateData(uid, {language});
      dispatch(setLanguage(deviceLanguage));
    };
  };

  const checkIfReceivingAnInvitation = async () => {
    const [
      receivingChannelInvitation,
      currentCallData,
    ] = await retrieveItemsFromAsyncStorageAndRemoveThem([
      RECEIVING_CHANNEL_INVITATION,
      CURRENT_CALL_DATA,
    ]);

    if (receivingChannelInvitation) {
      if (isTimeStampOlderThanEightMinutes(currentCallData.timestamp)) {
        PushNotification.localNotification({
          ...localNotificationDefaultConfig,
          message: UIText[language].missedConsultationNotification(currentCallData.name),
        });
        setLoading(false);
        return;
      }

      dispatch(setShowCallScreen(true));
      dispatch(setCurrentCallData(currentCallData));
    }
    setLoading(false);
  };

  const setUpMessageHandler = () => {
    unsubscribeMessageHandler.current = messaging().onMessage(message => {
      handleFcmMessage(message, FOREGROUND, dispatch);
    });
  };

  return loading;
}

export default useInitializer;
