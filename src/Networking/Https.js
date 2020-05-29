import axios from 'axios';
import {getUserIdToken} from './Authentication';
import {
  createAndSaveStripeCustomerFuncUrl, 
  sendChannelInvitationFuncUrl,
  completePaymentsWithStripeFuncUrl,
} from '../Constants/CloudFunctionsUrls';

export const makeCloudFunctionPostRequest = async (url, data) => {
  const userIdToken = await getUserIdToken();
  return axios({
    method: 'POST',
    url,
    headers: {Authorization: `Bearer ${userIdToken}`},
    data,
  });
};

export const createAndSaveStripeCustomer = async (stripeTokenId, userEmail) => {
  const data = {tokenId: stripeTokenId, email: userEmail};

  return makeCloudFunctionPostRequest(createAndSaveStripeCustomerFuncUrl, data);
};

export const sendChannelInvitation = async (
  peerUid,
  appointmentId,
  name,
  photoUrl,
) => {
  const timestamp = Date.now().toString();
  const data = {
    peerUid,
    appointmentId,
    name,
    photoUrl,
    timestamp,
  };

  return makeCloudFunctionPostRequest(sendChannelInvitationFuncUrl, data);
};

/**
 * Charge the consultation price (specified in the appointment firestore doc) from the user
 * and transferer the money to the stripe account
 * and increment the consultant's paymentDue
 * by the (consultation price - platform's percentage).
 * @param {string} userId The uid of the user to be charged.
 * @param {string} appointmentId The ID of the appointment that's to be accepted.
 * @param {string} consultantId The ID of the consultant to whom the money belongs.
 */
export const chargeConsultationPrice = (appointmentId, userId, consultantId) => {
  const data = { appointmentId, userId, consultantId };

  return makeCloudFunctionPostRequest(completePaymentsWithStripeFuncUrl, data);
};