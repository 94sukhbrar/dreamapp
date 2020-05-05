import { Alert } from 'react-native';
import reactNativePermissions from 'react-native-permissions';

const usePermissionRequester = () => {

  const requestPermission = (requestedPermission, message) => {
    reactNativePermissions(requestedPermission);
  }
}