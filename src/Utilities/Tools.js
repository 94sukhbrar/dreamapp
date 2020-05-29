import {Platform, NativeModules} from 'react-native';
import { ACCEPTED } from '../Constants/AppointmentStatusTypes';
import { getReadableDateTime, isAppointmentInThePast, minifyAppointmentDate } from './DateAndTimeTools';
import { USER } from '../Constants/UserTypes';
import { reportProblem } from '../Utilities/ErrorHandlers';

export const isStringPercentage = percentage => typeof percentage == 'string' && percentage.includes('%');

export const convertPercentageToNumber = percentage => {
  const sliceStartingIndex = 0;
  const sliceEndingIndex = percentage.length - 1;
  const percentageNumber = percentage.slice(sliceStartingIndex, sliceEndingIndex);
  return parseFloat(percentageNumber);
}

export const convertPercentageToFraction = percentage => {
  const percentageNumber = convertPercentageToNumber(percentage);
  const percentageFraction = '0.' + percentageNumber;
  return parseFloat(percentageFraction);
}


export const calculateImageWidthBasedOnRatio = (height, imageAspectRatio) => {
  const width = imageAspectRatio * height;
  return width;
}

export const computePercentageRemainder = percentage => {
  let percentageFraction;

  if (isStringPercentage(percentage))
    percentageFraction = convertPercentageToNumber(percentage);

  else if (typeof percentage == 'number' && percentage >= 0 && percentage <= 100)
    percentageFraction = percentage;

  else {
    const errorMessage = 
      `wrong percentage value. expected a string including % or number between 0 and 100. received: ${percentage}`;
    reportProblem(errorMessage);
    return 0;
  }
  
  return 100 - percentageFraction;
}

export const escapeSpecialRegexCharacters = string => string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

export const isTypeConvertible = type  =>
  /^SET_[A-Z\_]+$/.test(type) && type.charAt(type.length - 1) != '_';


export const removeFirstSubstringOccurrence = (string, substring) => {
  if (!string.includes(substring)) return string;

  const substringStartingIndex = string.indexOf(substring);
  const substringEndingIndex = substringStartingIndex + substring.length;

  const firstPart = string.slice(0, substringStartingIndex);
  const secondPart = string.slice(substringEndingIndex);

  return firstPart + secondPart;
}

export const removeAllSubstringOccurrences = (string, substring) => {
  const toBeReplacedRegex = new RegExp(escapeSpecialRegexCharacters(substring), 'g');
  return string.replace(toBeReplacedRegex, '');
}

export const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

export const convertReduxTypeToPropertyName = type => {
  const typeIsConvertible = isTypeConvertible(type);

  if (!typeIsConvertible)
    throw new Error(`unsupported type format was passed to convertReduxTypeToPropertyName, ${type}`);
  
  const rawPropertyName = removeFirstSubstringOccurrence(type, 'SET_');
  const words = rawPropertyName.split('_');

  const propertyName = words
    .map((word, index) => {
      let formattedWord = word.toLowerCase();

      if (index != 0)
        formattedWord = capitalizeFirstLetter(formattedWord);
      
      return formattedWord;
    })
    .join('');

  return propertyName;
}

export const convertPhotoToBlob = async photoUri => {
  const response = await fetch(photoUri);
  const blob = await response.blob();
  return blob;
};

export const logData = state => {
  if (!__DEV__) return;

  console.log(`App State`);
  console.log(`---------------`);

  for (key in state)
    console.log(`${key}: ${state[key]}`);

  console.log(`---------------\n`);
};

export const generateRandomSequenceOfCharacters = length => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) 
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
};

export const twoDigits = number => number.toString().length === 1 ? '0' + number : number.toString();

export const generateId = () => {
  const { year, month, day, hour, minute, second } = getReadableDateTime();
  const randomSequenceOfCharacters = generateRandomSequenceOfCharacters(5);

  const id = year + month + day + hour + minute + second + '-' + randomSequenceOfCharacters;

  return id;
};

export const extractDocDataAndIdsAsArraysFromCollectionSnap = collectionSnap => {
    const docsData = [];
    const ids = [];

    collectionSnap.forEach(doc => {
      docsData.push(doc.data());
      ids.push(doc.id);
    });
    
    return [docsData, ids];
};

export const extractDocDataAndIdsAsObjectFromCollectionSnap = collectionSnap => {
    const docs = {};

    collectionSnap.forEach(doc => {
      docs[doc.id] = doc.data();
    });

    return docs;
};

export const calculateBottomOffsetFromLayout = (layout, screenHeight) => {
  const { y, height } = layout;
  const bottomOffset = screenHeight - (y + height);

  return bottomOffset;
};

export const isDeviceLanguageArabic = () => {
  let deviceLanguage;

  if (Platform.OS == 'ios') {
    deviceLanguage = NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
  }
  else if (Platform.OS == 'android')
    deviceLanguage = NativeModules.I18nManager.localeIdentifier

  return deviceLanguage.includes('ar');
};

export const tryParse = value => {
  try {
    return JSON.parse(value);
  } catch(err) {
    return value;
  }
}

export const tryStringify = value => 
  typeof value != 'string' ?  JSON.stringify(value) : value;

export const filterOutAllNonAcceptedAppointments = appointment => {
  for (const appointmentId in appointment) {
    if (appointment[appointmentId].status !== ACCEPTED)
      delete appointment[appointmentId];
  }
};

export const areArraysEqual = (firstArray, secondArray) => {
  if (firstArray.length != secondArray.length) return false;

  let arraysAreEqual = true;

  for (let index = 0; index < firstArray.length; index++) {
    if (firstArray[index] !== secondArray[index]) {
      arraysAreEqual = false;
      break;
    }
  }

  return arraysAreEqual;
}

export const getUpcomingAppointmentDates = (appointments, userType) => {
  let upcomingAppointmentDates = [];

  for (const appointmentId in appointments) {
    const appointment = appointments[appointmentId];
    if (
      (appointment.status === ACCEPTED || userType === USER) &&
      !isAppointmentInThePast(appointment)
    ) {
      upcomingAppointmentDates.push(minifyAppointmentDate(appointment));
    }
  }

  return upcomingAppointmentDates;
};

export const filterOutNonNumberCharacters = (text='', allowDecimals=false) => {
  const filteredText = text
    .split('')
    .filter(character => !isNaN(character) || (allowDecimals && character === '.'))
    .join('');

  // The function must only return numbers that are parsed with parseFloat()
  // but when a user enters a fraction the text won't represent a number until a digit is
  // entered after the decimal character so only at this
  // situation (or at the absence of a value to begin with) is the function allowed to return a string.
  const filteredTextStartsOrEndsWithPeriod =
    filteredText === '.' || filteredText[filteredText.length - 1] === '.';

  if (allowDecimals && filteredTextStartsOrEndsWithPeriod) return filteredText;

  return filteredText ? parseFloat(filteredText) : '';
};

export const round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const roundHalf = num => Math.round(num*2)/2;