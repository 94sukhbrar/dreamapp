import * as Sentry from '@sentry/react-native';

export const reportProblem = message => {
  __DEV__  ? console.warn(message) : Sentry.captureException(message);
};