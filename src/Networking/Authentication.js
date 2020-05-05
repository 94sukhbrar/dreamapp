import auth from '@react-native-firebase/auth';

export const createUser = (email, password) => auth().createUserWithEmailAndPassword(email, password);

export const loginUserIn = (email, password) => auth().signInWithEmailAndPassword(email, password);

export const logUserOut = async() => auth().signOut();

export const sendResetPasswordEmail = email => auth().sendPasswordResetEmail(email);

export const getUserIdToken = () => {
  return new Promise((resolve, reject) => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        const idToken = await user.getIdToken();
        resolve(idToken);
      }
      else reject('User is not logged in');
    });
  });
}

export const updateUserEmail = newEmail => {
  auth().onAuthStateChanged(async user => {
    if (user) user.updateEmail(newEmail);
    else throw new Error('User is not signed in');
  });
}