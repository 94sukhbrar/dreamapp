import { convertLocalHourToUTC } from "../Utilities/DateAndTimeTools";

const defaultAppConfig = {
  language: 'en',
  deviceLanguage: 'en',
  languageIsSetManually: false,
  theme: 'light',
  loggedIn: false,
  keepLoggedIn: true,
  isConnectedToInternet: false,
};

export const defaultUserData = {
  uid: '',
  name: '',
  email: '',
  userType: '',
  photoUrl: '',
  deviceToken: '',
  deviceOS: '',
	stripeCustomerId: '',
  upcomingAppointmentDates: [],
  isAdmin: false,
};

export const defaultConsultantData = {
  pricePerCall: 10,
  timeAvailable: {from: convertLocalHourToUTC(8), to: convertLocalHourToUTC(20)},
  numberOfWeeksAppointmentMustBeWithin: 2,
  timeWindow: 20,
  rating: 0,
  numberOfRates: 0,
  accountActivated: false,
  accountReviewed: false,
  bio: '',
  paymentDue: '',
};

// All keys put here will be blacklisted in the persistor config (ie. won't persist)
export const currentSessionState = {
  showCallScreen: false,
  currentCallData: null,
  loadingConsultants: false,
  consultants: {},
  loadingAppointments: false,
  appointments: {},
};

const initialState = {
  ...defaultAppConfig,
  ...defaultUserData,
  ...defaultConsultantData,
  ...currentSessionState,
};

export default initialState;