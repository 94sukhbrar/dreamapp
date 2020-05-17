
import {AppRegistry} from 'react-native';
import ReduxProvider from './src/ReduxProvider';
import {name as appName} from './app.json';
import firebase from '@react-native-firebase/app';
import firebaseConfig from './src/Configs/FirebaseConfig';
import messaging from '@react-native-firebase/messaging';
import stripe from 'tipsi-stripe';
import stripeConfig from './src/Configs/StripeConfig';
import { handleFcmMessage } from './src/Utilities/NotificationsAndMessagesHandlers';
import { BACKGROUND } from './src/Constants/AppStates';
import * as Sentry from '@sentry/react-native';
import SentryConfig from './src/Configs/SentryConfig';

!firebase.apps.length && firebase.initializeApp(firebaseConfig);

stripe.setOptions(stripeConfig);

Sentry.init(SentryConfig);

messaging().setBackgroundMessageHandler(async message => {
  handleFcmMessage(message, BACKGROUND);
});

AppRegistry.registerComponent(appName, () => ReduxProvider);