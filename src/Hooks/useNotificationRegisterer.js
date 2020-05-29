import { Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserPrivateData } from '../Networking/Firestore';
import { setUserData } from '../Redux/Actions';
import { IOS, ANDROID } from '../Constants/DeviceOsTypes';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { handleFcmMessage } from '../Utilities/NotificationsAndMessagesHandlers';
import { FOREGROUND } from '../Constants/AppStates';
import { isTimeStampOlderThanEightMinutes } from '../Utilities/DateAndTimeTools';
import UIText from '../Constants/UIText';

const isIos = Platform.OS === 'ios';
const currentDeviceOS = isIos ? IOS : ANDROID;

const useNotificationRegisterer = () => {
	const storedDeviceToken = useSelector(state => state.deviceToken);

	const dispatch = useDispatch();

  const register = async uid => {
		PushNotification.configure({
			popInitialNotification: true,
			onNotification: onReceiveNotificationOnIos,
		});

		try {
			await messaging().registerDeviceForRemoteMessages();
			const fcmToken = await messaging().getToken();
	
			if (fcmToken != storedDeviceToken)
				saveDeviceToken(uid, fcmToken, currentDeviceOS);
		} catch (error) {
			console.log(error);
		}
	};

	const saveDeviceToken = (uid, deviceToken, deviceOS) => {
		if (!deviceToken) return;

		const updatedUserData = {deviceToken, deviceOS};
		updateUserPrivateData(uid, updatedUserData);
		dispatch(setUserData(updatedUserData));
	};

	const onReceiveNotificationOnIos = notification => {
		const message = {data: notification};
		if (!isIos) return;

		const {
			timestamp: messageTimeStamp,
			name: peerName,
		} = message.data;

		if (!isTimeStampOlderThanEightMinutes(messageTimeStamp))
			handleFcmMessage(message, FOREGROUND, dispatch);
		else
			showMissedConsultationAlert(peerName);
	};

	const showMissedConsultationAlert = peerName => {
    Alert.alert(
			UIText[language].missedConsultation,
      UIText[language].missedConsultationNotification(peerName),
      [{text: UIText[language].ok}]
    );
  };

	return register;
};

export default useNotificationRegisterer;