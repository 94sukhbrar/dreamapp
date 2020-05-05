import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setLoggedIn } from '../Redux/Actions';
import { logUserOut } from '../Networking/Authentication';
import { defaultUserData, defaultConsultantData } from '../Redux/InitialState';
import { updateUserPrivateData } from '../Networking/Firestore';

const useLogout = () => {
  const uid = useSelector(state => state.uid);
  const dispatch = useDispatch();

  const logout = async () => {
    updateUserPrivateData(uid, {deviceToken: ''});
    resetUserDataInStore();
    await logUserOut();
  };

  const resetUserDataInStore = () => {
    const userData = {...defaultUserData, ...defaultConsultantData}
    dispatch(setUserData(userData));
    dispatch(setLoggedIn(false));
  };

  return logout;
}

export default useLogout;