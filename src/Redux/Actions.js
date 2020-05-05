import { 
  SET_LANGUAGE,
  SET_THEME,
  SET_USER_DATA,
  SET_NAME,
  SET_EMAIL,
  SET_LOGGED_IN,
  SET_KEEP_LOGGED_IN,
  SET_PHOTO_URL,
  SET_UID,
  SET_STRIPE_CUSTOMER_ID,
  SET_SHOW_CALL_SCREEN,
  SET_CURRENT_CALL_DATA,
	SET_LOADING_CONSULTANTS,
	SET_CONSULTANTS,
	SET_LOADING_APPOINTMENTS,
	SET_APPOINTMENTS,
  SET_UPCOMING_APPOINTMENT_DATES,
  SET_BIO,
  SET_IS_ADMIN,
  SET_IS_CONNECTED_TO_INTERNET,
  SET_LANGUAGE_IS_SET_MANUALLY,
  SET_DEVICE_LANGUAGE,
} from './ActionTypes';
import { fetchActiveConsultants, fetchUserAppointments } from '../Networking/Firestore';
import { reportProblem, extractDocDataAndIdsAsObjectFromCollectionSnap } from '../Utilities/Tools';

export const setLanguage = language => ({
  type: SET_LANGUAGE,
  payload: language,
});

export const setTheme = theme => ({
  type: SET_THEME,
  payload: theme,
});

export const setUserData = userData => ({
  type: SET_USER_DATA,
  payload: userData,
});

export const setName = name => ({
  type: SET_NAME,
  payload: name,
});

export const setEmail = email => ({
  type: SET_EMAIL,
  payload: email,
});

export const setLoggedIn = loggedIn => ({
  type: SET_LOGGED_IN,
  payload: loggedIn,
});

export const setKeepLoggedIn = keepLoggedIn => ({
  type: SET_KEEP_LOGGED_IN,
  payload: keepLoggedIn,
});

export const setPhotoUrl = photoUrl => ({
  type: SET_PHOTO_URL,
  payload: photoUrl,
});

export const setUid = uid => ({
  type: SET_UID,
  payload: uid,
});

export const setStripeCustomerId = customerId => ({
  type: SET_STRIPE_CUSTOMER_ID,
  payload: customerId,
});

export const setShowCallScreen = showCallScreen => ({
  type: SET_SHOW_CALL_SCREEN,
  payload: showCallScreen,
});

export const setCurrentCallData = currentCallData => ({
  type: SET_CURRENT_CALL_DATA,
  payload: currentCallData,
});

export const setLoadingConsultants = loading => ({
  type: SET_LOADING_CONSULTANTS,
  payload: loading,
});

export const setConsultants = consultants => ({
  type: SET_CONSULTANTS,
  payload: consultants,
});

export const setLoadingAppointments = loading => ({
  type: SET_LOADING_APPOINTMENTS,
  payload: loading,
});

export const setAppointments = appointments => ({
  type: SET_APPOINTMENTS,
  payload: appointments,
});

export const setUpcomingAppointmentDates = appointmentDates => ({
  type: SET_UPCOMING_APPOINTMENT_DATES,
  payload: appointmentDates,
});

export const setBio = bio => ({
  type: SET_BIO,
  payload: bio,
});

export const setIsAdmin = isAdmin => ({
  type: SET_IS_ADMIN,
  payload: isAdmin,
});

export const setIsConnectedToInternet = isConnected => ({
  type: SET_IS_CONNECTED_TO_INTERNET,
  payload: isConnected,
});

export const setDeviceLanguage = deviceLanguage => ({
  type: SET_DEVICE_LANGUAGE,
  payload: deviceLanguage,
});

export const setLanguageIsSetManually = isSetManually => ({
  type: SET_LANGUAGE_IS_SET_MANUALLY,
  payload: isSetManually,
});

export const fetchConsultants = () => {
  return async dispatch => {
		dispatch(setLoadingConsultants(true));

		try {
			const consultantsCollectionSnap = await fetchActiveConsultants();

			if (!consultantsCollectionSnap || consultantsCollectionSnap.empty) {
				dispatch(setConsultants({}));
				dispatch(setLoadingConsultants(false));
				return;
			}

			const fetchedConsultants = extractDocDataAndIdsAsObjectFromCollectionSnap(
				consultantsCollectionSnap,
			);

			dispatch(setConsultants(fetchedConsultants));
		} catch (error) {
      reportProblem(error);
			dispatch(setConsultants({}));
		}

		dispatch(setLoadingConsultants(false));
  };
};

export const fetchAppointments = (userType, uid) => {
  return async dispatch => {
		dispatch(setLoadingAppointments(true));

		try {
			const appointmentsCollectionSnap = await fetchUserAppointments(userType, uid);

			if (!appointmentsCollectionSnap || appointmentsCollectionSnap.empty) {
				dispatch(setAppointments({}));
				dispatch(setLoadingAppointments(false));
				return;
			}

			const fetchedAppointments = extractDocDataAndIdsAsObjectFromCollectionSnap(
				appointmentsCollectionSnap,
			);

			dispatch(setAppointments(fetchedAppointments));
		} catch (error) {
      reportProblem(error);
			dispatch(setAppointments({}));
		}

		dispatch(setLoadingAppointments(false));
  };
};