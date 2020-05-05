const stripeSecretKey = 'sk_live_y2AR0Dy5rdh71bAjZrdHp8Dd00gIkwT83J';
// const stripeSecretKey = 'sk_test_KpMnxFvxDCAgTt3Guk8mWPk100KuOUcLGq';
const stripe = require('stripe')(stripeSecretKey);
const admin = require('firebase-admin');

exports.isInvokerAuthenticated = async request => {
  const userIdToken = extractUserIdToken(request);

  if (!userIdToken) return null;

  try {
    const {uid} = await admin.auth().verifyIdToken(userIdToken);
    return uid;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

const extractUserIdToken = request => {
  const {authorization} = request.headers;

  if (!authorization || !authorization.includes('Bearer')) return null;

  const userIdToken = authorization.split(' ')[1];
  return userIdToken;
};

exports.createStripeCustomer = async (tokenId, email) => {
  const customer = await stripe.customers.create({
    source: tokenId,
    email,
  });

  return customer;
};

exports.getCharge = (amount, customerId, idempotencyKey) => {
  return stripe.charges.create(
    {
      amount: Math.round(amount),
      currency: 'usd',
      customer: customerId,
    },
    {idempotencyKey},
  );
};

exports.getAppointmentPrice = async appointmentId => {
  try {
    const appointmentDoc = await admin
      .firestore()
      .collection('appointments')
      .doc(appointmentId)
      .get();

    if (appointmentDoc.exists) {
      return appointmentDoc.data().price;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.saveStripeCustomerId = async (uid, stripeCustomerId) => {
  return admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('privateData')
    .doc('data')
    .set({stripeCustomerId}, {merge: true});
};

exports.getStripeCustomerId = async uid => {
  const userPrivateDataDoc = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('privateData')
    .doc('data')
    .get();

  if (!userPrivateDataDoc.exists) return null;

  const {stripeCustomerId} = userPrivateDataDoc.data();

  if (!stripeCustomerId) return null;

  return stripeCustomerId;
};

const getUserToken = async uid => {
  const userPrivateDataDoc = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('privateData')
    .doc('data')
    .get();

  if (!userPrivateDataDoc.exists)
    throw new Error("The user hasn't registered for push notifications.");

  const {deviceToken, deviceOS, language} = userPrivateDataDoc.data();

  if (!deviceToken || !deviceOS)
    throw new Error("The user hasn't registered for push notifications.");

  return {deviceToken, deviceOS, language};
};

exports.notifyUser = async (uid, notificationBody) => {
  let {deviceToken, deviceOS, language} = await getUserToken(uid);
  language = language || 'en';

  if (deviceOS === 'IOS') {
    //TODO send a post request to APNS.
  } else if (deviceOS === 'ANDROID') {
    admin.messaging().send({
      token: deviceToken,
      notification: {
        title: 'Dream',
        body: notificationBody,
      },
      android: {
        notification: {
          sound: 'default',
          vibrateTimingsMillis: [0, 90, 100, 90],
          priority: 'max',
        },
      },
    });
  }
};

exports.sendMessage = async (uid, data) => {
  let {deviceToken, deviceOS, language} = await getUserToken(uid);
  language = language || 'en';

  if (deviceOS === 'IOS') {
    //TODO send a post request to APNS.
  } else if (deviceOS === 'ANDROID') {
    admin.messaging().send({
      token: deviceToken,
      data: {...data, language},
      android: {
        priority: 'high',
      },
    });
  }
};

exports.updateConsultantRating = async (uid, rating, numberOfRates) => {
  return admin
    .firestore()
    .collection('users')
    .doc(uid)
    .update({rating, numberOfRates});
};

exports.incrementConsultantPaymentDue = (uid, amount) => {
  return admin
    .firestore()
    .collection('users')
    .doc(uid)
    .update({paymentDue: admin.firestore.FieldValue.increment(amount)});
};

exports.round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};
