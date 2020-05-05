import { 
  convertPercentageToFraction,
  calculateImageWidthBasedOnRatio,
  isStringPercentage,
  computePercentageRemainder,
  convertPercentageToNumber,
  isTypeConvertible,
  convertReduxTypeToPropertyName,
  removeFirstSubstringOccurrence,
  removeAllSubstringOccurrences,
  capitalizeFirstLetter,
  generateId,
  filterOutAllNonAcceptedAppointments,
} from '../../src/Utilities/Tools';
import { ACCEPTED, DECLINED, REQUESTED } from '../../src/Constants/AppointmentStatusTypes';


describe('isStringPercentage', () => {
  it('returns true for an integer percentage', () => {
    expect(isStringPercentage('80%')).toBe(true);
  });
  
  it('returns true for an float percentage', () => {
    expect(isStringPercentage('80.5%')).toBe(true);
  });
  
  it('returns false for a number', () => {
    expect(isStringPercentage(80)).toBe(false);
  });
});



describe('convertPercentageToFraction', () => {
  it('returns the height percentage as a float fraction', () => {
    expect(convertPercentageToFraction('80%')).toBe(0.8);
    expect(convertPercentageToFraction('80.5%')).toBe(0.8);
    expect(convertPercentageToFraction('40%')).toBe(0.4);
  });

  it('returns a number', () => {
    expect(typeof convertPercentageToFraction('0.81%')).toBe('number');
  });
});

describe('calculateImageWidthBasedOnRatio', () => {
  it('returns the width that matches the ratio', () => {
    expect(calculateImageWidthBasedOnRatio(400, 975 / 650) / 400).toBe(975 / 650);
  });

  it('returns a number', () => {
    expect(typeof calculateImageWidthBasedOnRatio(400, 975 / 650)).toBe('number');
  });
});

describe('convertPercentageToNumber', () => {
  it('returns the percentage for an integer', () => {
    expect(convertPercentageToNumber('85%')).toBe(85);
  });

  it('returns the percentage for a float', () => {
    expect(convertPercentageToNumber('85.5%')).toBe(85.5);
  });

  it('returns the percentage as a number', () => {
    expect(typeof convertPercentageToNumber('85%')).toBe('number');
  });
});

describe('computePercentageRemainder', () => {
  it('returns the percentage remainder of a number', () => {
    expect(computePercentageRemainder(85)).toBe(15);
  });

  it('returns the percentage remainder of a string', () => {
    expect(computePercentageRemainder('85%')).toBe(15);
  });

  it('returns a number', () => {
    expect(typeof computePercentageRemainder('85%')).toBe('number');
  });

  it('returns a zero', () => {
    expect(typeof computePercentageRemainder(115)).toBe('number');
  });
});

describe('isTypeConvertible', () => {
  it('returns true', () => {
    expect(isTypeConvertible('SET_LANGUAGE')).toBe(true);
    expect(isTypeConvertible('SET_THEME')).toBe(true);
    expect(isTypeConvertible('SET_NUMBER_OF_USERS')).toBe(true);
  });

  it('returns false', () => {
    expect(isTypeConvertible('LANGUAGE')).toBe(false);
    expect(isTypeConvertible('SET_NUMBER_ OF_USERS')).toBe(false);
    expect(isTypeConvertible('SET_number')).toBe(false);
  });
});

describe('removeFirstSubstringOccurrence', () => {
  it('returns the string stripped from the substring', () => {
    expect(removeFirstSubstringOccurrence('SET_LANGUAGE', 'SET_')).toBe('LANGUAGE');
    expect(removeFirstSubstringOccurrence('the quick brown fox jumped over the lazy dog', 'the'))
    .toBe(' quick brown fox jumped over the lazy dog');
  });

  it('returns the string as is', () => {
    expect(removeFirstSubstringOccurrence('LANGUAGE', 'SET_')).toBe('LANGUAGE');
  });
});

describe('removeAllSubstringOccurrences', () => {
  it('returns the string stripped from the substring', () => {
    expect(removeAllSubstringOccurrences('SET_LANGUAGE', 'SET_')).toBe('LANGUAGE');
    expect(removeAllSubstringOccurrences('the quick brown fox jumped over the lazy dog', 'the'))
    .toBe(' quick brown fox jumped over  lazy dog');
  });

  it('returns the string as is', () => {
    expect(removeAllSubstringOccurrences('LANGUAGE', 'SET_')).toBe('LANGUAGE');
  });
});

describe('convertReduxTypeToPropertyName', () => {
  it('returns property name', () => {
    expect(convertReduxTypeToPropertyName('SET_LANGUAGE')).toBe('language');
  })

  it('returns property name for a camel case name', () => {
    expect(convertReduxTypeToPropertyName('SET_NUMBER_OF_USERS')).toBe('numberOfUsers');
  })

  it('throws an error', () => {
    expect.assertions(3);

    const errorMessage = 'unsupported type format was passed to convertReduxTypeToPropertyName';

    try {
      convertReduxTypeToPropertyName('LANGUAGE');
    } catch (error) {
      expect(error.message).toBe(errorMessage + ', LANGUAGE')
    }

    try {
      convertReduxTypeToPropertyName('SET_NUMBER_');
    } catch (error) {
      expect(error.message).toBe(errorMessage + ', SET_NUMBER_')
    }

    try {
      convertReduxTypeToPropertyName('setNumberOfUsers');
    } catch (error) {
      expect(error.message).toBe(errorMessage + ', setNumberOfUsers')
    }
  })
});

describe('capitalizeFirstLetter', () => {
  it('returns the string with the first letter upper cased', () => {
    expect(capitalizeFirstLetter('test')).toBe('Test');
  });
});

describe('filterOutAllNonAcceptedAppointments', () => {
  it('should delete all the appointments whose status != ACCEPTED', () => {
    const appointments = {
      'test1': {status: ACCEPTED},
      'test2': {status: ACCEPTED},
      'test3': {status: DECLINED},
      'test4': {status: REQUESTED},
      'test5': {status: ACCEPTED},
    };

    filterOutAllNonAcceptedAppointments(appointments);

    expect(Object.keys(appointments).length).toBe(3);
    expect(Object.keys(appointments)).toStrictEqual(['test1', 'test2', 'test5']);
    expect(Object.values(appointments)).toStrictEqual([
      {status: ACCEPTED},
      {status: ACCEPTED},
      {status: ACCEPTED},
    ]);
  });
});

describe('generateId', () => {
  it('generates an appointment ID that includes the date and time concatenated by 5 random characters ', () => {
    const firstAppointmentId = generateId();
    const secondAppointmentId = generateId();
    
    expect(firstAppointmentId.length).toBe(18);
    expect(firstAppointmentId == secondAppointmentId).toBe(false);
  });
});