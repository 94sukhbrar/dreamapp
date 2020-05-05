import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Keyboard,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../Redux/Actions';
import Colors from '../Constants/Colors';
import Header from '../Components/Header';
import IconInputField from '../Components/IconInputField';
import UIText from '../Constants/UIText';
import {
  convertTimeToText,
  convertUTCHourToLocal,
  convertLocalDateToUTC,
  translateDigitsToArabicIfLanguageIsArabic,
} from '../Utilities/DateAndTimeTools';
import TabBarScreenStyles from '../SharedStyles/TabBarScreenStyles';
import PrimaryBtn from '../Components/PrimaryBtn';
import useMessageDisplayer from '../Hooks/useMessageDisplayer';
import { updateUserData } from '../Networking/Firestore';
import DateAndTimePicker from '../Components/DateAndTimePicker';
import { IONICONS, FONT_AWESOME } from '../Constants/IconFamilies';
import { filterOutNonNumberCharacters } from '../Utilities/Tools';
import Layout from '../Constants/Layout';
import { PLATFORM_MONEY_PERCENTAGE } from '../Constants/ClientPreferences';

const isIos = Platform.OS === 'ios';

const maximumNumberOfCharactersInBio = 150;

const ConsultantPreferencesScreen = ({ navigation }) => {

  const {
    language,
    uid,
    photoUrl,
    loggedIn,
    pricePerCall,
    timeAvailable,
    numberOfWeeksAppointmentMustBeWithin,
    timeWindow,
    bio,
    isConnectedToInternet,
  } = useSelector(state => ({
    language: state.language,
    uid: state.uid,
    photoUrl: state.photoUrl,
    loggedIn: state.loggedIn,
    pricePerCall: state.pricePerCall,
    timeAvailable: state.timeAvailable,
    numberOfWeeksAppointmentMustBeWithin: state.numberOfWeeksAppointmentMustBeWithin,
    timeWindow: state.timeWindow,
    bio: state.bio,
    isConnectedToInternet: state.isConnectedToInternet,
  }), shallowEqual);

  const dispatch = useDispatch();

  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [unAppliedCallPrice, setUnAppliedCallPrice] = useState(pricePerCall);
  const [unAppliedTimeAvailableFrom, setUnAppliedTimeAvailableFrom] = useState(timeAvailable.from);
  const [unAppliedTimeAvailableTo, setUnAppliedTimeAvailableTo] = useState(timeAvailable.to);
  const [
    unAppliedNumberOfWeeksAppointmentMustBeWithin,
    setUnAppliedNumberOfWeeksAppointmentMustBeWithin
  ] = useState(numberOfWeeksAppointmentMustBeWithin);
  const [unAppliedTimeWindow, setUnAppliedTimeWindow] = useState(timeWindow);
  const [unAppliedBio, setUnAppliedBio] = useState(bio);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dateTimePickerLabel, setDateTimePickerLabel] = useState('');
  const [timeFieldBeingSelected, setTimeFieldBeingSelected] = useState('');
  const [YTranslation] = useState(new Animated.Value(0));

  const [messageDisplayer, displayMessage] = useMessageDisplayer();

  useEffect(() => {
    Keyboard.addListener('keyboardWillHide', onKeyboardHidden);
  }, []);

  const onKeyboardHidden = () => animate(YTranslation, 0, 350).start();

  const onScroll = event => setShowHeaderBorder(event.nativeEvent.contentOffset.y > 1);

  const onDateTimeChange = (event, date) => {
    if (!isIos) {
      if (event.type === 'set') onSelectTime(date);
      else if (event.type === 'dismissed') setShowPicker(false);
    }
    else if (date)
      setSelectedDate(date);
  };

  const onPressApplyChanges = () => {
    Keyboard.dismiss();

    if (!isConnectedToInternet) {
      displayMessage(UIText[language].checkInternetConnectionAndTry());
      return;
    }

    const [inputsAreValid, message] = validateInputs();

    if (!inputsAreValid) {
      displayMessage(message);
      return;
    }

    const updatedUserData = {
      bio: unAppliedBio,
      pricePerCall: unAppliedCallPrice,
      timeAvailable: {
        from: unAppliedTimeAvailableFrom,
        to: unAppliedTimeAvailableTo,
      },
      numberOfWeeksAppointmentMustBeWithin: unAppliedNumberOfWeeksAppointmentMustBeWithin,
      timeWindow: unAppliedTimeWindow,
    }

    updateUserData(uid, updatedUserData);
    dispatch(setUserData(updatedUserData));
    displayMessage(UIText[language].changesApplied);
  };

  const validateInputs = () => {
    if (typeof unAppliedCallPrice !== 'number')
      return [false, UIText[language].callPriceMustBeNumber]

    if (unAppliedCallPrice < 0.5)
      return [false, UIText[language].minimumPricePerCallIsHalfDollar]

    if (typeof unAppliedNumberOfWeeksAppointmentMustBeWithin !== 'number')
      return [false, UIText[language].numberOfWeeksAppointmentMustBeWithinMustBeNumber]

    if (typeof unAppliedTimeWindow !== 'number')
      return [false, UIText[language].timeWindowMustBeNumber]

    return [true, null];
  };

  const onChangeCallPrice = text => {
    let callPrice = filterOutNonNumberCharacters(text, true);
    setUnAppliedCallPrice(callPrice);
  };

  const onPressSelectAvailableFrom = () => {
    setShowPicker(true);
    setTimeFieldBeingSelected('from');
    setDateTimePickerLabel(UIText[language].available + ' ' + UIText[language].from)
  };

  const onPressSelectAvailableTo = () => {
    setShowPicker(true);
    setTimeFieldBeingSelected('to');
    setDateTimePickerLabel(UIText[language].available + ' ' + UIText[language].to)
  };

  const onSelectTime = date => {
    setShowPicker(false);

    const pickedData = isIos ? selectedDate : date;

    const hour = convertLocalDateToUTC(pickedData).getHours();

    if (timeFieldBeingSelected == 'from')
      setUnAppliedTimeAvailableFrom(hour);

    else if (timeFieldBeingSelected == 'to')
      setUnAppliedTimeAvailableTo(hour);
  };

  const onChangeNumberOfWeeksAppointmentMustBeWithin = text => {
    let numberOfWeeks = filterOutNonNumberCharacters(text);
    const maximumValue = 12;
    const minimumValue = 1;

    if (numberOfWeeks) {
      numberOfWeeks = Math.min(numberOfWeeks, maximumValue);
      numberOfWeeks = Math.max(numberOfWeeks, minimumValue);
    }
    setUnAppliedNumberOfWeeksAppointmentMustBeWithin(numberOfWeeks);
  };

  const onChangeTimeWindow = text => {
    let numberOfMinutes = filterOutNonNumberCharacters(text);
    const maximumValue = 60 * 3;
    const minimumValue = 0;

    if (numberOfMinutes) {
      numberOfMinutes = Math.min(numberOfMinutes, maximumValue);
      numberOfMinutes = Math.max(numberOfMinutes, minimumValue);
    }
    setUnAppliedTimeWindow(numberOfMinutes);
  };

  const onChangeBio = text => {
    if (text.length > maximumNumberOfCharactersInBio) {
      text = text.slice(0, maximumNumberOfCharactersInBio);
    }

    setUnAppliedBio(text);
  }

  const avoidKeyboard = bottomOffset => {
    if (!isIos) return;

    const estimatedKeyboardHeight = 0.55 * Layout.screenHeight;
    const animationDuration = 350;

    if (bottomOffset && estimatedKeyboardHeight > bottomOffset) {
      const translation = estimatedKeyboardHeight - bottomOffset + 40;
      animate(YTranslation, -translation, animationDuration).start();
    } else if (!bottomOffset) {
      animate(YTranslation, 0, animationDuration).start();
    }
  };

  const animate = (drivenValue, targetValue, duration) => {
		return Animated.timing(drivenValue, {
			toValue: targetValue,
			duration,
			useNativeDriver: true,
		});
	};

  const numberOfRemainingBioCharacters = translateDigitsToArabicIfLanguageIsArabic(
    maximumNumberOfCharactersInBio - unAppliedBio.length,
    language,
  );

  const platformPercentageMessage = UIText[language].platformPercentage(PLATFORM_MONEY_PERCENTAGE * 100);

  const noChangesMade = unAppliedBio == bio &&
    unAppliedCallPrice == pricePerCall &&
    unAppliedTimeAvailableFrom == timeAvailable.from &&
    unAppliedTimeAvailableTo == timeAvailable.to &&
    unAppliedNumberOfWeeksAppointmentMustBeWithin == numberOfWeeksAppointmentMustBeWithin &&
    unAppliedTimeWindow == timeWindow;

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle='default' backgroundColor='rgba(0, 0, 0, 0.1)' />

      <Header
        navigation={navigation}
        photoUrl={photoUrl}
        loggedIn={loggedIn}
        language={language}
        borderShown={showHeaderBorder}
      />

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps='handled'
        onScroll={onScroll}
        scrollEventThrottle={25}>
        <Animated.View
          style={[
            {
              width: '100%',
              alignItems: 'center',
              transform: [{translateY: YTranslation}],
            },
          ]}>
          <IconInputField
            title={UIText[language].bio}
            note={`(${numberOfRemainingBioCharacters})`}
            textColor={unAppliedBio == bio ? Colors.placeHolderColor : Colors.tintColor}
            value={unAppliedBio}
            onChangeText={onChangeBio}
            style={{height: 80}}
            textInputWidth='100%'
            onFocus={avoidKeyboard}
            onBlur={avoidKeyboard}
            multiline
          />

          <IconInputField
            title={UIText[language].pricePerCall}
            iconName='dollar'
            iconFamily={FONT_AWESOME}
            textColor={unAppliedCallPrice == pricePerCall ? Colors.placeHolderColor : Colors.tintColor}
            value={unAppliedCallPrice.toString()}
            onChangeText={onChangeCallPrice}
          />

          <Text style={styles.fieldTitle}>{UIText[language].available}</Text>

          <View style={styles.availableTimeFieldsContainer}>
            <View style={{flex: 1}}>
              <IconInputField
                title={UIText[language].from}
                textColor={
                  unAppliedTimeAvailableFrom == timeAvailable.from 
                    ? Colors.placeHolderColor 
                    : Colors.tintColor
                }
                placeholder={convertTimeToText(
                  {localHour: convertUTCHourToLocal(unAppliedTimeAvailableFrom)},
                  language,
                )}
                onPress={onPressSelectAvailableFrom}
                textInputWidth={'100%'}
              />
            </View>

            <View style={{flex: 1}}>
              <IconInputField
                title={UIText[language].to}
                textColor={
                  unAppliedTimeAvailableTo == timeAvailable.to
                    ? Colors.placeHolderColor
                    : Colors.tintColor
                }
                placeholder={convertTimeToText(
                  {localHour: convertUTCHourToLocal(unAppliedTimeAvailableTo)},
                  language,
                )}
                onPress={onPressSelectAvailableTo}
                textInputWidth={'100%'}
              />
            </View>
          </View>

          <IconInputField
            title={UIText[language].numberOfWeeksAppointmentMustBeWithin}
            iconName='md-calendar'
            iconFamily={IONICONS}
            textColor={
              unAppliedNumberOfWeeksAppointmentMustBeWithin == numberOfWeeksAppointmentMustBeWithin
                ? Colors.placeHolderColor
                : Colors.tintColor
            }
            value={unAppliedNumberOfWeeksAppointmentMustBeWithin.toString()}
            onChangeText={onChangeNumberOfWeeksAppointmentMustBeWithin}
            onFocus={avoidKeyboard}
            onBlur={avoidKeyboard}
          />

          <IconInputField
            title={UIText[language].timeWindow}
            iconName='md-time'
            iconFamily={IONICONS}
            textColor={unAppliedTimeWindow == timeWindow ? Colors.placeHolderColor : Colors.tintColor}
            value={unAppliedTimeWindow.toString()}
            onChangeText={onChangeTimeWindow}
            onFocus={avoidKeyboard}
            onBlur={avoidKeyboard}
          />
        </Animated.View>
      </ScrollView>

      <View style={TabBarScreenStyles.bottomBtnContainer}>
        <PrimaryBtn
          label={UIText[language].applyChanges}
          onPress={onPressApplyChanges}
          disabled={noChangesMade}
        />
      </View>

      {showPicker && (
        <DateAndTimePicker
          language={language}
          visible={showPicker}
          onPressSelect={onSelectTime}
          dismiss={() => setShowPicker(false)}
          pickerMode={'time'}
          labelColor={Colors.tintColor}
          label={dateTimePickerLabel}
          value={selectedDate}
          onChange={onDateTimeChange}
        />
      )}

      { messageDisplayer }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  fieldTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: Colors.grayTextColor,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
  },
  availableTimeFieldsContainer: {
    minWidth: '90%',
    flexDirection: 'row',
  },
});

ConsultantPreferencesScreen.propTypes = {
  prop: PropTypes.object,
}

export default ConsultantPreferencesScreen;