import {
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {Platform} from 'react-native';

const isIos = Platform.OS === 'ios';

export const getAudioPermissions = async () => {
  if (isIos) return;
  return request(PERMISSIONS.ANDROID.RECORD_AUDIO);
};

export const getIosCameraAndPhotoLibraryPermissions = async () => {
  if (!isIos) return;
  const [
    cameraPermissionStatus,
    photoLibraryPermissionStatus,
  ] = await Promise.all([
    request(PERMISSIONS.IOS.CAMERA),
    request(PERMISSIONS.IOS.PHOTO_LIBRARY),
  ]);

  const cameraPermissionGranted =
    cameraPermissionStatus === RESULTS.GRANTED;
  const photoLibraryPermissionGranted =
    photoLibraryPermissionStatus === RESULTS.GRANTED;

  return {cameraPermissionGranted, photoLibraryPermissionGranted};
};
