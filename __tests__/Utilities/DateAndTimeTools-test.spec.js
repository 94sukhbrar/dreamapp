import {
  convert24HrFormatTo12Hr,
  translateDigitsToArabicIfLanguageIsArabic,
  translateTimePeriodToArabic,
  translate12HrFormatHourToArabic,
  addDaysToDate,
  areTwoHoursInSameDay,
  hourIsBetweenTwoHours,
  convertDateToText,
  convertUTCHourToLocal,
  convertLocalHourToUTC,
  cantSelectAnAppointmentToday,
  convertLocalDateToUTC,
  convertUTCDateToLocal,
} from '../../src/Utilities/DateAndTimeTools';

describe('convert24HrFormatTo12Hr', () => {
  it('returns the hour converted to 12 hour format', () => {
    expect(convert24HrFormatTo12Hr(0)).toBe('12 am');
    expect(convert24HrFormatTo12Hr(1)).toBe('1 am');
    expect(convert24HrFormatTo12Hr(2)).toBe('2 am');
    expect(convert24HrFormatTo12Hr(11)).toBe('11 am');
    expect(convert24HrFormatTo12Hr(12)).toBe('12 pm');
    expect(convert24HrFormatTo12Hr(13)).toBe('1 pm');
    expect(convert24HrFormatTo12Hr(14)).toBe('2 pm');
    expect(convert24HrFormatTo12Hr(22)).toBe('10 pm');
    expect(convert24HrFormatTo12Hr(23)).toBe('11 pm');
  });
});

describe('translateDigitsToArabic', () => {
  it('returns the hour a string with all digits translated to arabic', () => {
    expect(translateDigitsToArabicIfLanguageIsArabic(0)).toBe('٠');
    expect(translateDigitsToArabicIfLanguageIsArabic(1)).toBe('١');
    expect(translateDigitsToArabicIfLanguageIsArabic(101)).toBe('١٠١');
    expect(translateDigitsToArabicIfLanguageIsArabic(1101)).toBe('١١٠١');
    expect(translateDigitsToArabicIfLanguageIsArabic('1101')).toBe('١١٠١');
    expect(translateDigitsToArabicIfLanguageIsArabic('test 1101 test')).toBe('test ١١٠١ test');
    expect(translateDigitsToArabicIfLanguageIsArabic('10 pm')).toBe('١٠ pm');
  });
});

describe('translateTimePeriodToArabic', () => {
  it('returns the hour a string with all time periods translated to arabic', () => {
    expect(translateTimePeriodToArabic('am')).toBe('ص');
    expect(translateTimePeriodToArabic('pm')).toBe('م');
    expect(translateTimePeriodToArabic('10 pm')).toBe('10 م');
    expect(translateTimePeriodToArabic('8-am')).toBe('8-ص');
  });
});

describe('translate12HrFormatHourToArabic', () => {
  it('returns the hour a string with all digits and the time period translated to arabic', () => {
    expect(translate12HrFormatHourToArabic('10 am')).toBe('١٠ ص');
    expect(translate12HrFormatHourToArabic('7 pm')).toBe('٧ م');
    expect(translate12HrFormatHourToArabic('12 pm')).toBe('١٢ م');
    expect(translate12HrFormatHourToArabic('9 am')).toBe('٩ ص');
  });
});

describe('addDaysToDate', () => {
  it('returns the date of the following day', () => {
    const currentDate = new Date();
    currentDate.setDate(10);
    addDaysToDate(currentDate, 1);
    expect(currentDate.getDate()).toBe(11);
  });

  it('returns the date of the first day in the following month', () => {
    const currentDate = new Date();
    currentDate.setMonth(6);
    currentDate.setDate(31);
    addDaysToDate(currentDate, 1);
    expect(currentDate.getDate()).toBe(1);
  });

  it('returns the date after 12 days', () => {
    const currentDate = new Date();
    currentDate.setDate(10);
    addDaysToDate(currentDate, 12);
    expect(currentDate.getDate()).toBe(22);
  });
});


describe('twoHoursAreInSameDay', () => {
  it('return true as the two hours are in the same day', () => {
    // edge
    expect(areTwoHoursInSameDay(0, 23)).toBe(true);
    // mid
    expect(areTwoHoursInSameDay(6, 18)).toBe(true);

    // real life
    expect(areTwoHoursInSameDay(9, 22)).toBe(true);
    expect(areTwoHoursInSameDay(7, 20)).toBe(true);
    expect(areTwoHoursInSameDay(0, 14)).toBe(true);
    expect(areTwoHoursInSameDay(0, 2)).toBe(true);
  });
  it('return false as the two hours are in different days', () => {
    // edge
    expect(areTwoHoursInSameDay(0, 0)).toBe(false);
    expect(areTwoHoursInSameDay(1, 0)).toBe(false);
    expect(areTwoHoursInSameDay(18, 18)).toBe(false);
    expect(areTwoHoursInSameDay(4, 4)).toBe(false);
    // mid
    expect(areTwoHoursInSameDay(18, 6)).toBe(false);

    // real life
    expect(areTwoHoursInSameDay(20, 10)).toBe(false);
    expect(areTwoHoursInSameDay(7, 0)).toBe(false);
    expect(areTwoHoursInSameDay(10, 2)).toBe(false);
    expect(areTwoHoursInSameDay(11, 1)).toBe(false);
  });
});

describe('hourIsBetweenTwoHours', () => {
  it('returns true as the hour is in between the two hours', () => {
    expect(hourIsBetweenTwoHours({hour: 14,twoHours: [10, 21]})).toBe(true);
    expect(hourIsBetweenTwoHours({hour: 14,twoHours: [10, 2]})).toBe(true);
    expect(hourIsBetweenTwoHours({hour: 14,twoHours: [10, 0]})).toBe(true);
    expect(hourIsBetweenTwoHours({hour: 14,twoHours: [14, 0]})).toBe(true);
    expect(hourIsBetweenTwoHours({hour: 14,twoHours: [0, 0]})).toBe(true);
    expect(hourIsBetweenTwoHours({hour: 14,twoHours: [12, 2]})).toBe(true);
    expect(hourIsBetweenTwoHours({hour: 2, twoHours:[18, 6]})).toBe(true);
    expect(hourIsBetweenTwoHours({hour: 20,twoHours: [18, 6]})).toBe(true);
    expect(hourIsBetweenTwoHours({hour: 21,twoHours: [7, 0]})).toBe(true);
  });

  it('returns false as the hour is not in between the two hours', () => {
    expect(hourIsBetweenTwoHours({hour: 21,twoHours: [7, 20]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 6, twoHours:[7, 20]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 11,twoHours: [12, 20]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 9, twoHours:[12, 20]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 20, twoHours:[12, 20]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 7, twoHours:[18, 6]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 17,twoHours: [18, 6]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 2, twoHours:[7, 20]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 4, twoHours:[7, 0]})).toBe(false);
    expect(hourIsBetweenTwoHours({hour: 0, twoHours:[7, 0]})).toBe(false);
  });
});

describe('convertDateToText', () => {
  it('return the date as readable text', () => {
    expect(convertDateToText({year: 2020, month: 1, date: 12}, 'en')).toBe('12 Feb 2020')
    expect(convertDateToText({year: 2020, month: 1, date: 12}, 'ar')).toBe('١٢ فبراير ٢٠٢٠')
  });
});

describe('convertLocalDateToUTC', () => {
  it('returns the date in UTC', () => {
    const localDate = new Date();
    expect(convertLocalDateToUTC(localDate).getHours()).toBe(localDate.getUTCHours());
    expect(convertLocalDateToUTC(localDate).getMinutes()).toBe(localDate.getUTCMinutes());
  });
});

describe('convertUTCDateToLocal', () => {
  it('returns the date in local time', () => {
    const localDate = new Date();
    const UTCDate = convertLocalDateToUTC(localDate);
    expect(convertUTCDateToLocal(UTCDate).getHours()).toBe(localDate.getHours());
    expect(convertUTCDateToLocal(UTCDate).getMinutes()).toBe(localDate.getMinutes());
  });
});

describe('convertUTCHourToLocal. This test will only pass in Egypt and in (UTC+2)', () => {
  it('returns the hour in local time', () => {
    expect(convertUTCHourToLocal(8)).toBe(10);
    expect(convertUTCHourToLocal(9)).toBe(11);
    expect(convertUTCHourToLocal(10)).toBe(12);
    expect(convertUTCHourToLocal(11)).toBe(13);
    expect(convertUTCHourToLocal(22)).toBe(0);
    expect(convertUTCHourToLocal(23)).toBe(1);
    expect(convertUTCHourToLocal(0)).toBe(2);
    expect(convertUTCHourToLocal(1)).toBe(3);
    expect(convertUTCHourToLocal(3)).toBe(5);
  });
});

describe('convertLocalHourToUtc. This test will only pass in Egypt and in (UTC+2)', () => {
  it('returns the hour in UTC', () => {
    expect(convertLocalHourToUTC(8)).toBe(6);
    expect(convertLocalHourToUTC(9)).toBe(7);
    expect(convertLocalHourToUTC(10)).toBe(8);
    expect(convertLocalHourToUTC(11)).toBe(9);
    expect(convertLocalHourToUTC(22)).toBe(20);
    expect(convertLocalHourToUTC(23)).toBe(21);
    expect(convertLocalHourToUTC(0)).toBe(22);
    expect(convertLocalHourToUTC(1)).toBe(23);
    expect(convertLocalHourToUTC(2)).toBe(0);
    expect(convertLocalHourToUTC(3)).toBe(1);
  });
});

describe('cantSelectAnAppointmentToday', () => {
  const currentUTCDate = convertLocalDateToUTC(new Date());

  it(`returns false as the difference is more than the time window`, () => {
    currentUTCDate.setHours(10);
    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 21, timeWindow: 60})).toBe(false);
  });

  it('returns true as last available hour has passed', () => {
    currentUTCDate.setHours(22);
    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 19, timeWindow: 15})).toBe(true);
  });
  
  it(`returns false as last available hour hasn't passed and difference is bigger than time window`, () => {
    currentUTCDate.setHours(18);
    currentUTCDate.setMinutes(20);

    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 19, timeWindow: 15})).toBe(false);
  });

  it(`returns true as last available hour hasn't passed but difference is less than time window`, () => {
    currentUTCDate.setHours(18);
    currentUTCDate.setMinutes(46);

    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 19, timeWindow: 15})).toBe(true);
  });

  it(`returns true as last available hour hasn't passed but difference is less a than a time window greater than 60`, () => {
    currentUTCDate.setHours(18);
    currentUTCDate.setMinutes(46);

    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 19, timeWindow: 90})).toBe(true);
  });
  
  it(`returns true as last available hour hasn't passed but difference is equal to a time window greater than 60`, () => {
    currentUTCDate.setHours(17);
    currentUTCDate.setMinutes(30);

    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 19, timeWindow: 90})).toBe(true);
  });

  it(`returns true as last available hour hasn't passed but difference is equal to time window`, () => {
    currentUTCDate.setHours(18);
    currentUTCDate.setMinutes(40);

    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 19, timeWindow: 20})).toBe(true);
  });

  it(`returns true as last available hour is now`, () => {
    currentUTCDate.setHours(19);
    currentUTCDate.setMinutes(0);

    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 19, timeWindow: 20})).toBe(true);
  });

  it(`returns true as last available hour has passed`, () => {
    currentUTCDate.setHours(20);

    expect(cantSelectAnAppointmentToday({currentUTCDate, consultantMaximumUTCHour: 19, timeWindow: 20})).toBe(true);
  });
});