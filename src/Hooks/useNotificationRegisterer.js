import { requestIosNotificationPermission } from '../Utilities/Permissions';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserPrivateData } from '../Networking/Firestore';
import { setUserData } from '../Redux/Actions';
import { IOS, ANDROID } from '../Constants/DeviceOsTypes';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

const isIos = Platform.OS === 'ios';
const currentDeviceOS = isIos ? IOS : ANDROID;

const useNotificationRegisterer = () => {
	const storedDeviceToken = useSelector(state => state.deviceToken);

	const dispatch = useDispatch();

  const register = async uid => {
		PushNotification.configure({
			popInitialNotification: true,
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

	return register;
}

export default useNotificationRegisterer;