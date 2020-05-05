import { requestIosNotificationPermission } from '../Utilities/Permissions';
import { Platform } from 'react-native';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { updateUserPrivateData } from '../Networking/Firestore';
import { setUserData } from '../Redux/Actions';
import { IOS, ANDROID } from '../Constants/DeviceOsTypes';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';


const isIos = Platform.OS === 'ios';

const useNotificationRegisterer = () => {

	const storedDeviceToken = useSelector(state => state.deviceToken);

	const dispatch = useDispatch();

  const register = async uid => {
    if (isIos) {
			PushNotificationIOS.addEventListener('register', token => {
				if (token != storedDeviceToken)
					saveDeviceToken(uid, token, IOS);
			});

			PushNotificationIOS.addEventListener('registrationError', error => {
				console.log("register -> error", error);
			});

    	const permissions = await requestIosNotificationPermission();
			console.log("useNotificationRegisterer -> permissions", permissions);
    }	else {
			PushNotification.configure({
				// onNotification: onReceivingAndroidNotification,
				popInitialNotification: true,
				requestPermissions: true,
				onRegister: token => saveDeviceToken(uid, token, ANDROID),
			});

			const fcmToken = await messaging().getToken();
			if (fcmToken != storedDeviceToken)
				saveDeviceToken(uid, fcmToken, ANDROID);
  	}
	}

	const saveDeviceToken = (uid, deviceToken, deviceOS) => {
		if (deviceToken) {
			const updatedUserData = {deviceToken, deviceOS};
			updateUserPrivateData(uid, updatedUserData);
			dispatch(setUserData(updatedUserData));
		}
	}

	return register;
}

export default useNotificationRegisterer;