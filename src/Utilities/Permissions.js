import PushNotificationIOS from "@react-native-community/push-notification-ios";
import reactNativePermissions from 'react-native-permissions';
import { Platform } from 'react-native';

const isIos = Platform.OS === 'ios';

export const requestIosNotificationPermission = async() => {
  if (!isIos) return;
  return PushNotificationIOS.requestPermissions();
};

export const getAudioPermissions = async () => {
  if (isIos) return;
  return reactNativePermissions.request(reactNativePermissions.PERMISSIONS.ANDROID.RECORD_AUDIO);
};