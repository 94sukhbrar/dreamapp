import { buildFirestoreRef, buildFirestoreUserRef, buildFirestoreAppointmentRef, buildFirestoreUserPrivateDataRef, buildFirestoreRatingRef } from './RefBuilders';
import { CONSULTANT, USER } from '../Constants/UserTypes';
import { defaultUserData, defaultConsultantData } from '../Redux/InitialState';
import { generateId } from '../Utilities/Tools';

/**
 * @param {String} uid The user ID.
 * @param {Object} userData The data to be uploaded.
 * @async
 */
export const uploadUserData = async(uid, userData) => {
  const userRef = buildFirestoreUserRef(uid);
  return userRef.set(userData);
};

/**
 * @param {String} uid The user ID.
 * @param {Object} updatedData The data to be updated.
 * @async
 */
export const updateUserData = async(uid, updatedData) => {
  const userRef = buildFirestoreUserRef(uid);
  return userRef.update(updatedData);
};

export const updateUserPrivateData = (uid, updatedData) => {
  const userPrivateDataRef = buildFirestoreUserPrivateDataRef(uid);
  return userPrivateDataRef.set(updatedData, {merge: true});
};

export const getUserPrivateData = uid => {
  const userPrivateDataRef = buildFirestoreUserPrivateDataRef(uid);
  return userPrivateDataRef.get();
};

/**
 * @param {String} uid The ID of the user.
 * @async
 */
export const fetchUserData = uid => {
  const userRef = buildFirestoreUserRef(uid);
  return userRef.get();
};

export const deleteUserDoc = uid => {
  const userRef = buildFirestoreUserRef(uid);
  return userRef.delete();
};

/**
 * @param {String} appointmentId The ID of the appointment.
 * @param {Object} appointment The appointment object.
 * @async
 */
export const uploadAppointment = (appointmentId, appointment) => {
  const appointmentRef = buildFirestoreAppointmentRef(appointmentId);
  return appointmentRef.set(appointment);
};

/**
 * @param {String} appointmentId The ID of the appointment.
 * @param {Object} appointmentStatus The updated status of the appointment.
 * @async
 */
export const updateAppointmentStatus = async (appointmentId, appointmentStatus) => {
  const appointmentRef = buildFirestoreAppointmentRef(appointmentId);
  return appointmentRef.update({status: appointmentStatus});
};

/**
 * @description remove the appointment with the specified ID.
 * @param {String} appointmentId The ID of the appointment.
 * @async
 */
export const deleteAppointment = async appointmentId => {
  const appointmentRef = buildFirestoreAppointmentRef(appointmentId);
  return appointmentRef.delete();
};

/**
 * @description Fetch all consultants whose account has been activated.
 */
export const fetchActiveConsultants = () => {
  const usersRef = buildFirestoreRef('users');
  return usersRef.where('userType', '==', CONSULTANT).where('accountActivated', '==', true).get();
};

/**
 * @description Fetch all appointments that include the specified uid 
 * @param {string} userType Type of the user USER | CONSULTANT
 * @param {string} uid The user ID
 */
export const fetchUserAppointments = (userType, uid) => {
  userType = userType.toLowerCase();
  const appointmentsRef = buildFirestoreRef('appointments');
  return appointmentsRef.where(`parties.${userType}.uid`, '==', uid).get();
};


export const updateConsultantRating = (consultantUid, uid, rating) => {
  const ratingRef = buildFirestoreRatingRef(consultantUid);
  return ratingRef.set({[uid]: rating}, {merge: true});
};

export const getUserDocKeys = () => {
  const nonIncludedKeys = ['uid', 'deviceToken', 'deviceOS', 'stripeCustomerId', 'isAdmin'];
  return Object.keys(defaultUserData).filter(key => !nonIncludedKeys.includes(key));
};

export const getConsultantDocKeys = () => ([
    ...getUserDocKeys(),
    ...Object.keys(defaultConsultantData),
]);

export const getToBeUploadedUserData = (userData, userType) => {
	let toBeUploadedUserData = {};
	const allowedKeys = userType === USER ? getUserDocKeys() : getConsultantDocKeys();

  for (const key in userData) {
    if (allowedKeys.includes(key))
			toBeUploadedUserData[key] = userData[key];
  }

  return toBeUploadedUserData;
};

export const checkAdministration = email => {
  email = email.toLowerCase();

  const adminsRef = buildFirestoreRef('admins');
  return adminsRef.where('email', '==', email).get();
};

export const fetchUnReviewedConsultants = () => {
  const usersRef = buildFirestoreRef('users');
  return usersRef.where('userType', '==', CONSULTANT).where('accountReviewed', '==', false).get();
};


export const addNewAdminEmail = async email => {
  const adminsRef = buildFirestoreRef('admins', generateId());
  return adminsRef.set({email});
};