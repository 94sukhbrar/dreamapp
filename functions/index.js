const functions = require('firebase-functions');
const admin = require('firebase-admin');
const tools = require('./utilities/tools');
const {PLATFORM_MONEY_PERCENTAGE} = require('./constants/clientPreferences');
const customHttpCodes = require('./constants/customHttpStatusCodes');

admin.initializeApp(functions.config().firebase);

exports.completePaymentsWithStripe = functions.https.onRequest(
  async (request, response) => {
    const uid = await tools.isInvokerAuthenticated(request);

    if (!uid) {
      response.status(401).send('Unauthorized! Missing Id token!');
      return;
    }

    const {userId, appointmentId, consultantId} = request.body;

    const [customerId, priceInDollars] = await Promise.all([
      tools.getStripeCustomerId(userId),
      tools.getAppointmentPrice(appointmentId),
    ]);

    if (!customerId || !priceInDollars) {
      const errorMessage = !customerId
        ? 'No stripe customerId corresponding to the given userId was found'
        : 'No appointment corresponding to the given appointmentId was found';
      response.status(404).send(errorMessage);
      return;
    }

    const priceInCents = priceInDollars * 100;

    let charge;

    try {
      charge = await tools.getCharge(priceInCents, customerId, appointmentId);
    } catch (error) {
      console.log(error);
      if (error.code === 'card_declined')
        response.status(470).send(customHttpCodes[470]);
      else response.status(570).send(customHttpCodes[570]);
      return;
    }

    const amountInDollars = charge.amount / 100;
    const platformFee = amountInDollars * PLATFORM_MONEY_PERCENTAGE;
    const consultantPercentage = tools.round(amountInDollars - platformFee, 1);

    try {
      tools.incrementConsultantPaymentDue(consultantId, consultantPercentage);
    } catch (error) {
      console.log(error);
      response.status(471).send(customHttpCodes[471]);
      return;
    }

    try {
      admin
        .firestore()
        .collection('charges')
        .doc(appointmentId)
        .set(charge);
    } catch (error) {
      console.log(error);
    }

    response.status(200).send(JSON.stringify(charge));
  },
);

exports.createAndSaveStripeCustomer = functions.https.onRequest(
  async (request, response) => {
    const uid = await tools.isInvokerAuthenticated(request);

    if (!uid) {
      response.status(401).send('Unauthorized! Missing Id token!');
      return;
    }

    const {tokenId, email} = request.body;

    const customer = await tools.createStripeCustomer(tokenId, email);

    if (!customer) {
      response.status(500).send('Error while creating customer Id');
      return;
    }

    await tools.saveStripeCustomerId(uid, customer.id);

    response.status(200).send(customer.id);
  },
);

exports.handleAppointmentRequestNotification = functions.firestore
  .document('/appointments/{appointmentId}')
  .onWrite(change => {
    const noPreviousDocument = !change.before.exists;

    const {status: newStatus, parties} = change.after.data();
    const oldStatus = noPreviousDocument ? null : change.before.data().status;

    const {uid: consultantUid, name: consultantName} = parties.consultant;
    const {uid: userUid, name: userName} = parties.user;

    if (newStatus === oldStatus) return; // Nothing to notify the user about.

    switch (newStatus) {
      case 'REQUESTED':
        tools.notifyUser(
          consultantUid,
          `You have a new appointment request from ${userName}`,
        );
        break;
      case 'ACCEPTED':
        tools.notifyUser(
          userUid,
          `Your appointment with ${consultantName} has been accepted`,
        );
        break;
      case 'DECLINED':
        tools.notifyUser(
          userUid,
          `Your appointment with ${consultantName} has been rejected`,
        );
        break;
    }
  });

exports.handleConsultantRating = functions.firestore
  .document('/ratings/{consultantUid}')
  .onWrite((change, context) => {
    const {consultantUid} = context.params;
    const ratings = Object.values(change.after.data());

    const ratingsSum = ratings.reduce(
      (accumulator, rating) => accumulator + rating,
    );
    const numberOfRates = ratings.length;
    const newRating = ratingsSum / numberOfRates;

    tools.updateConsultantRating(consultantUid, newRating, numberOfRates);
  });

exports.startCall = functions.https.onRequest(async (request, response) => {
  const uid = await tools.isInvokerAuthenticated(request);

  if (!uid) {
    response.status(401).send('Unauthorized! Missing Id token!');
    return;
  }

  const {calleeUid, channelId, name, photoUrl} = request.body;

  try {
    tools.sendMessage(calleeUid, {
      name,
      channelId,
      photoUrl,
      callStatus: 'INCOMING',
      messageType: 'INCOMING_CALL',
    });
  } catch (error) {
    response.status(200).send(`Problem initiating call. ${error}`);
  }
  response.status(200).send('Call started successfully');
});

exports.sendChannelInvitation = functions.https.onRequest(
  async (request, response) => {
    const uid = await tools.isInvokerAuthenticated(request);

    if (!uid) {
      response.status(401).send('Unauthorized! Missing Id token!');
      return;
    }

    const {peerUid, appointmentId, name, photoUrl, timestamp} = request.body;

    try {
      tools.sendMessage(peerUid, {
        appointmentId,
        uid,
        name,
        photoUrl,
        messageType: 'CHANNEL_INVITATION',
        timestamp,
        callStatus: 'INCOMING',
      });
    } catch (error) {
      response
        .status(404)
        .send(`No device corresponds to the token.\n${error}`);
    }
    response.status(200).send('Invitation sent successfully');
  },
);

exports.grantAdminstration = functions.https.onCall(async (data, context) => {
  if (!context.auth.uid || context.auth.token.admin !== true)
    return {error: 'Request not authorized'};

  const {email} = data;

  let user;

  try {
    user = await admin.auth().getUserByEmail(email);
  } catch (error) {
    return {error: 'No user corresponding to the specified email'};
  }

  if (user.customClaims && user.customClaims.admin === true)
    return {result: `${email} is already an admin`};

  try {
    await admin.auth().setCustomUserClaims(user.uid, {admin: true});
    return {result: `Request fulfilled. ${email} is now an admin`};
  } catch (error) {
    return {error: `Error while granting ${email} administration`};
  }
});

exports.notifyUserConsultantUponAccountReview = functions.https.onCall(
  async (data, context) => {
    if (!context.auth.uid || context.auth.token.admin !== true)
      return {error: 'Request not authorized'};

    const {uid, accountActivated} = data;

    tools.notifyUser(
      uid,
      `Your Dream consultant account has been ${
        accountActivated ? 'activated' : 'rejected'
      }`,
    );
  },
);
