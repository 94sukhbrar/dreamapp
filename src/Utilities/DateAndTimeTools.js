import UIText from '../Constants/UIText';
import { MAXIMUM_NUMBER_OF_MINUTES_PER_CALL } from '../Constants/ClientPreferences';
import { twoDigits, tryStringify } from './Tools';

export const getReadableDateTime = () => {
  const currentUTCDate = getCurrentUTCDate();
  
	const year = twoDigits(currentUTCDate.getFullYear()).slice(2);
	const month = twoDigits(currentUTCDate.getMonth() + 1);
	const day = twoDigits(currentUTCDate.getDate());
	const hour = twoDigits(currentUTCDate.getHours());
	const minute = twoDigits(currentUTCDate.getMinutes());
	const second = twoDigits(currentUTCDate.getSeconds());

	return { year, month, day, hour, minute, second };
};

export const getCurrentUTCDate = () => {
  const UTCDate = convertLocalDateToUTC(new Date());
  return UTCDate;
};

export const convertLocalDateToUTC = localDate => {
  const UTCDate = new Date(localDate);
  UTCDate.setMinutes(UTCDate.getMinutes() + UTCDate.getTimezoneOffset());
  return UTCDate;
};

export const convertUTCDateToLocal = UTCDate => {
  const localDate = new Date(UTCDate);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate;
};

export const convertUTCHourToLocal = hour => {
  const UTCDate = new Date();
  UTCDate.setHours(hour);
  UTCDate.setMinutes(0);
  const localDate = convertUTCDateToLocal(UTCDate);
  return localDate.getHours();
};

export const convertUTCHourAndMinuteToLocal = (hour, minute) => {
  const UTCDate = new Date();
  UTCDate.setHours(hour);
  UTCDate.setMinutes(minute);
  const localDate = convertUTCDateToLocal(UTCDate);
  return {localHour: localDate.getHours(), localMinute: localDate.getMinutes()};
};

export const convertLocalHourToUTC = hour => {
  const localDate = new Date();
  localDate.setHours(hour);
  localDate.setMinutes(0);
  const UTCDate = convertLocalDateToUTC(localDate);
  return UTCDate.getHours();
};

export const cantSelectAnAppointmentToday = ({
  currentUTCDate,
  consultantMaximumUTCHour,
  timeWindow,
}) => {
  const currentUTCHour = currentUTCDate.getHours();
  const currentUTCMinute = currentUTCDate.getMinutes();
  const currentUTCHourInMinutes = currentUTCHour * 60 + currentUTCMinute;
  const consultantMaximumUTCHourInMinutes = consultantMaximumUTCHour * 60;

  return !(
    consultantMaximumUTCHourInMinutes - currentUTCHourInMinutes >
    timeWindow
  );
};

export const isSelectedDateBeforeMinimumDate = (selectedDate, minimumDate) => {
  const sameMonth = selectedDate.getMonth() == minimumDate.getMonth();
  const sameYear = selectedDate.getFullYear() == minimumDate.getFullYear();

  return sameMonth && sameYear && selectedDate.getDate() < minimumDate.getDate();
};

export const convert24HrFormatTo12Hr = (hour, minute = '') => {
  if (minute == 0) minute = '';
  const timePeriod = hour < 12 ? 'am' : 'pm';
  hour = hour == 0 || hour == 12 ? 12 : hour % 12;
  return `${hour}${minute ? ':' : ''}${minute} ${timePeriod}`;
};

export const getAppointmentDate = appointmentObject => {
  try {
    const { date: UTCDate, month: UTCMonth, year: UTCYear } = appointmentObject.date;
    const { hour: UTCHour, minute: UTCMinute } = appointmentObject.time;
  
    const appointmentUTCDate = new Date();
    appointmentUTCDate.setMinutes(UTCMinute);
    appointmentUTCDate.setHours(UTCHour);
    appointmentUTCDate.setDate(UTCDate);
    appointmentUTCDate.setMonth(UTCMonth);
    appointmentUTCDate.setFullYear(UTCYear);
  
    const appointmentLocalDate = convertUTCDateToLocal(appointmentUTCDate);
  
    const localDate = appointmentLocalDate.getDate();
    const localMonth = appointmentLocalDate.getMonth();
    const localYear = appointmentLocalDate.getFullYear();
  
    return {
      UTCDate,
      UTCMonth,
      UTCYear,
      localDate,
      localMonth,
      localYear,
    };
  } catch (error) {console.warn(error)}
};

export const addDaysToDate = (date, days) => {
  date.setDate(date.getDate() + days);
};

export const addWeeksToDate = (date, weeks) => {
  date.setDate(date.getDate() + weeks * 7);
};

export const convertDateToText = ({ year, month, date }, language) => {

  const dateText = translateDigitsToArabicIfLanguageIsArabic(
    `${date} ${UIText[language].months[month]} ${year}`,
    language
  );
  
  return dateText;
};

export const isTimeStampOlderThanEightMinutes = timestamp => {
  const now = Date.now();
  const differenceBetweenNowAndMessageTimeStampInMinutes = (now - timestamp) / (1000 * 60);

  return differenceBetweenNowAndMessageTimeStampInMinutes > 8;
};

export const areTwoHoursInSameDay = (firstHour, secondHour) => secondHour > firstHour;


export const hourIsBetweenTwoHours = ({hour, twoHours}) => {
  const [ firstHour, secondHour ] = twoHours;

  const twoHoursAreInSameDay = areTwoHoursInSameDay(firstHour, secondHour);

  let hourIsEqualToSecondHour = hour == secondHour;

  if (twoHoursAreInSameDay)
    return hour >= firstHour && hour <= secondHour && !hourIsEqualToSecondHour;
  
  return hour >= firstHour && hour < 24 || hour >= 0 && hour < secondHour && !hourIsEqualToSecondHour;
};

export const convertTimeToText = ({ localHour, localMinute }, language) => {

  const hourIn12HrFormat = convert24HrFormatTo12Hr(localHour);

  const [ hour, timePeriod ] = hourIn12HrFormat.split(' ');

  let timeText = localMinute
    ? `${hour}:${twoDigits(localMinute)} ${timePeriod}`
    : `${hour} ${timePeriod}`;

  if (language == 'ar')
    timeText = translate12HrFormatHourToArabic(timeText);
  
  return timeText;
};

export const getAppointmentTime = appointmentObject => {
  const { hour: UTCHour, minute: UTCMinute } = appointmentObject.time;
  const { localHour, localMinute } = convertUTCHourAndMinuteToLocal(UTCHour, UTCMinute);

  return {
    UTCHour,
    UTCMinute,
    localHour,
    localMinute,
  };
};

export const translateDigitsToArabicIfLanguageIsArabic = (
  toBeTranslated,
  language = 'ar',
  changeDecimal = false,
) => {
  if (language != 'ar') return toBeTranslated;

  if (typeof toBeTranslated == 'number')
    toBeTranslated = toBeTranslated.toString();

  if (typeof toBeTranslated != 'string') return;

  let translatedText = toBeTranslated.replace(
    /\d/g,
    digit => UIText.englishToArabicDigitsMap[digit],
  );

  if (changeDecimal) translatedText = translatedText.replace('.', ',');
  return translatedText;
};

export const translateTimePeriodToArabic = toBeTranslated => {
  if (typeof toBeTranslated != 'string') return;

  const translatedText = toBeTranslated.replace(
    /\bpm\b|\bam\b/g,
    timePeriod => UIText.englishToArabicTimePeriodsMap[timePeriod],
  );
  return translatedText;
};

export const translate12HrFormatHourToArabic = toBeTranslated => {
  if (typeof toBeTranslated != 'string') return;

  const translatedText = translateTimePeriodToArabic(
    translateDigitsToArabicIfLanguageIsArabic(toBeTranslated),
  );
  return translatedText;
};

export const isAppointmentInThePast = (appointment, byNumberOfHours = 0) => {
  const {
    date: appointmentDate,
    month: appointmentMonth,
    year: appointmentYear,
  } = appointment.date;
  const {hour: appointmentHour, minute: appointmentMinute} = appointment.time;

  const currentUTCDate = getCurrentUTCDate();

  const dayHasPassed =
    currentUTCDate.getFullYear() > appointmentYear ||
    currentUTCDate.getMonth() > appointmentMonth ||
    currentUTCDate.getDate() > appointmentDate;

  const hourHasPassed =
    currentUTCDate.getHours() > appointmentHour ||
    (currentUTCDate.getHours() === appointmentHour &&
      currentUTCDate.getMinutes() - appointmentMinute > 10);

  const appointmentIsInThePast = dayHasPassed || hourHasPassed;

  if (appointmentIsInThePast && byNumberOfHours) {
    return !dayHasPassed && currentUTCDate.getHours() - appointmentHour > byNumberOfHours;
  }

  return appointmentIsInThePast;
};

export const minifyAppointmentDate = appointment => {
  const { date, month, year } = appointment.date;
  const { hour, minute } = appointment.time;
  
  const minifiedDate = minifyDate(
    year,
    month,
    date,
    hour,
    minute,
  );
    
  return minifiedDate;
};

export const minifyDate = (
  year,
  month,
  date,
  hour,
  minute,
) => {

  const minifiedDate =
    year +
    twoDigits(month) +
    twoDigits(date) +
    twoDigits(hour) +
    twoDigits(minute);

  return minifiedDate;
};

const minifyLocalPickedDate = localPickedDate => {
  const UTCPickedDate = convertLocalDateToUTC(localPickedDate);

  const year = UTCPickedDate.getFullYear();
  const month = UTCPickedDate.getMonth();
  const date = UTCPickedDate.getDate();
  const hour = UTCPickedDate.getHours();
  const minute = UTCPickedDate.getMinutes();
  const minifiedPickedDate = minifyDate(year, month, date, hour, minute);
  return minifiedPickedDate;
};

export const unminifyAppointmentDate = minifiedAppointmentDate => {
	minifiedAppointmentDate = tryStringify(minifiedAppointmentDate)

  const year = minifiedAppointmentDate.slice(0 ,4);
  minifiedAppointmentDate = minifiedAppointmentDate.slice(4);
  const month = minifiedAppointmentDate.slice(0 ,2);
  minifiedAppointmentDate = minifiedAppointmentDate.slice(2);
  const date = minifiedAppointmentDate.slice(0 ,2);
  minifiedAppointmentDate = minifiedAppointmentDate.slice(2);
  const hour = minifiedAppointmentDate.slice(0 ,2);
  minifiedAppointmentDate = minifiedAppointmentDate.slice(2);
  const minute = minifiedAppointmentDate.slice(0 ,2);

  return {
    year,
    month,
    date,
    hour,
    minute,
  };
};

const ispickedDateWithinMaximumCallTimeOfAnotherAppointmentDate = (
  consultantUpcomingAppointmentDates,
  minifiedPickedDate,
  ) => {
	if (typeof minifiedPickedDate !== 'string')
		minifiedPickedDate = minifiedPickedDate.toString();

	let pickedDateIsWithinMaximumCallTimeOfAnotherAppointmentDate = false;

  const {date: pickedDate, hour: pickedHour, minute: pickedMinute} = unminifyAppointmentDate(minifiedPickedDate);

  consultantUpcomingAppointmentDates.forEach(date => {
    const {date: takenDate, hour: takenHour, minute: takenMinute} = unminifyAppointmentDate(date);
    const differenceInMinutes = calculateDifferenceBetweenTwoHours(
      {hour: pickedHour, minute: pickedMinute},
      {hour: takenHour, minute: takenMinute},
    );
    if (
      pickedDate == takenDate &&
      differenceInMinutes <
      MAXIMUM_NUMBER_OF_MINUTES_PER_CALL
    )
      pickedDateIsWithinMaximumCallTimeOfAnotherAppointmentDate = true;
  });
  return pickedDateIsWithinMaximumCallTimeOfAnotherAppointmentDate;
};

export const isSelectedDateAndTimeAlreadyTaken = (
  localPickedDate,
  consultantUpcomingAppointmentDates,
) => {
  const minifiedPickedDate = minifyLocalPickedDate(localPickedDate);

  const pickedDateAlreadyTaken = consultantUpcomingAppointmentDates.includes(minifiedPickedDate);
  
  let pickedDateIsWithinMaximumCallTimeOfAnotherAppointmentDate = false;

  pickedDateIsWithinMaximumCallTimeOfAnotherAppointmentDate = ispickedDateWithinMaximumCallTimeOfAnotherAppointmentDate(
    consultantUpcomingAppointmentDates,
    minifiedPickedDate,
    pickedDateIsWithinMaximumCallTimeOfAnotherAppointmentDate,
  );

  return pickedDateAlreadyTaken || pickedDateIsWithinMaximumCallTimeOfAnotherAppointmentDate;
};

export const getNearestAvailableTime = (
  localPickedDate,
  consultantUpcomingAppointmentDates,
  consultantMinimumUTCHour,
	consultantMaximumUTCHour,
	language,
) => {
  const minifiedPickedDate = minifyLocalPickedDate(localPickedDate);
	
	const suggestedTimeFromBottom = getSuggestedTime(
    minifiedPickedDate,
		consultantUpcomingAppointmentDates,
		consultantMinimumUTCHour,
		consultantMaximumUTCHour,
    'BOTTOM',
	);

	const suggestedTimeFromTop = getSuggestedTime(
    minifiedPickedDate,
		consultantUpcomingAppointmentDates,
		consultantMinimumUTCHour,
		consultantMaximumUTCHour,
    'TOP',
	);

	let bottomTime;

	if (suggestedTimeFromBottom) {
		bottomTime = getLocalizedTimeFromMinifiedDate(suggestedTimeFromBottom, language);
	}

	let topTime;

	if (suggestedTimeFromTop) {
		topTime = getLocalizedTimeFromMinifiedDate(suggestedTimeFromTop, language);
	}

	
	return [bottomTime, topTime];
};

const getSuggestedTime = (
	minifiedPickedDate,
	consultantUpcomingAppointmentDates,
  consultantMinimumUTCHour,
  consultantMaximumUTCHour,
  direction,
) => {
  let suggestedTime = minifiedPickedDate;

  const step =
    MAXIMUM_NUMBER_OF_MINUTES_PER_CALL * (direction === 'TOP' ? 1 : -1);

  while (
    suggestedTimeIsInConsultantAvailbaleTimeRange(
      suggestedTime,
      consultantMinimumUTCHour,
      consultantMaximumUTCHour,
    )
  ) {
    suggestedTime = addMinutesToMinifiedDate(suggestedTime, step); // Add or subtract maximum call minutes depending on direction.
    if (
      !ispickedDateWithinMaximumCallTimeOfAnotherAppointmentDate(
        consultantUpcomingAppointmentDates,
        suggestedTime,
      ) &&
      suggestedTimeIsInConsultantAvailbaleTimeRange(
        suggestedTime,
        consultantMinimumUTCHour,
        consultantMaximumUTCHour,
      )
    )
      return suggestedTime;
  }
	
	return null;
};

const extractHourFromMinifiedDate = minifiedDate => {
	if (typeof minifiedDate !== 'string')
		minifiedDate = minifiedDate.toString();
	
	const { hour } = unminifyAppointmentDate(minifiedDate);

	return hour;
};

const getLocalizedTimeFromMinifiedDate = (suggestedTimeFromBottom, language) => {
	let time;

	let { hour, minute } = unminifyAppointmentDate(suggestedTimeFromBottom);
  if (minute === 60) 
    minute = 0

	const UTCDate = new Date();
	UTCDate.setHours(hour);
	UTCDate.setMinutes(minute);
	const localDate = convertUTCDateToLocal(UTCDate);

	const localHour = localDate.getHours();
	const localMinute = localDate.getMinutes();

	time = convert24HrFormatTo12Hr(localHour, localMinute);

	if (language === 'ar') {
		time = translate12HrFormatHourToArabic(time);
	}
	return time;
};

function suggestedTimeIsInConsultantAvailbaleTimeRange(suggestedTime, consultantMinimumUTCHour, consultantMaximumUTCHour) {
	return extractHourFromMinifiedDate(suggestedTime) > consultantMinimumUTCHour &&
		extractHourFromMinifiedDate(suggestedTime) < consultantMaximumUTCHour;
}

const addMinutesToMinifiedDate = (minifiedDate, addedMinutes) => {
  let {date, hour, minute} = unminifyAppointmentDate(minifiedDate);

  date = parseInt(date);
  hour = parseInt(hour);
  minute = parseInt(minute);

  if (minute + addedMinutes < 60 ) {
    minute += addedMinutes;
  } else if (hour != 23) {
    hour += 1;
    minute = (minute + addedMinutes) % 60;
  } else {
    date += 1;
    hour = 0;
    minute = (minute + addedMinutes) % 60;
  }

  const modifiedPart = twoDigits(date) + twoDigits(hour) + twoDigits(minute);
  const modifiedPartLengthStartIndex = minifiedDate.length - modifiedPart.length;
  updateMinifiedDate = minifiedDate.slice(0, modifiedPartLengthStartIndex) + modifiedPart;
  return updateMinifiedDate;
}

const calculateDifferenceBetweenTwoHours = (firstHour, secondHour) => {
  return Math.abs(
    (firstHour.hour * 60 + firstHour.minute) -
    (secondHour.hour * 60 + secondHour.minute)
  );
}
