import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


/**
 * @description Builds a firestore ref.
 * @param  {...any} collectionAndDocNames
 * @returns A firestore ref to the passed collection and doc names.
 */
export const buildFirestoreRef = (...collectionAndDocNames) => {
  let firestoreRef = firestore();
  let pathIsInvalid = false;

  collectionAndDocNames.forEach((docOrCollection, index) => {
    if (!docOrCollection)
      pathIsInvalid = true;

    if (index % 2 == 0)
      firestoreRef = firestoreRef.collection(docOrCollection);
    else 
      firestoreRef = firestoreRef.doc(docOrCollection);
  });
  
  return pathIsInvalid ? null : firestoreRef;
}

/**
 * @description Builds a firestore user ref.
 * @param {string} uid The user Id of the user.
 * @returns A firestore ref to the user with the specified uid.
 */
export const buildFirestoreUserRef = uid => {
  let firestoreUserRef = buildFirestoreRef('users', uid);
  
  return firestoreUserRef;
}

export const buildFirestoreUserPrivateDataRef = uid => {
  let firestoreUserRef = buildFirestoreRef('users', uid, 'privateData', 'data');
  
  return firestoreUserRef;
}

/**
 * @description Builds a firestore appointment ref.
 * @param {string} appointmentId The ID of the appointment.
 * @returns A firestore ref to the appointment with the specified ID.
 */
export const buildFirestoreAppointmentRef = appointmentId => {
  let firestoreAppointmentRef = buildFirestoreRef('appointments', appointmentId);
  
  return firestoreAppointmentRef;
}

/**
 * @description Builds a firestore rating ref.
 * @param {string} consultantUid The ID of the consultant.
 * @returns A firestore ref to the rating doc of the consultant with the specified Id.
 */
export const buildFirestoreRatingRef = consultantUid => {
  let firestoreRatingRef = buildFirestoreRef('ratings', consultantUid);
  
  return firestoreRatingRef;
}

/**
 * @description Builds a storage ref.
 * @param  {...any} pathNames
 * @returns A storage ref to the passed path.
 */
export const buildStorageRef = (...pathNames) => {
  const path = pathNames.join('/');
  const storageRef = storage().ref(path);
  return storageRef;
}