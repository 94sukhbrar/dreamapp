/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import {
  setUserData,
  setLanguage,
  setLanguageIsSetManually,
} from '../Redux/Actions';
import Colors from '../Constants/Colors';
import NavigationHeader from '../Components/NavigationHeader';
import UIText from '../Constants/UIText';
import FullWidthButton from '../Components/FullWidthButton';
import initialState from '../Redux/InitialState';
import { deleteUserDoc } from '../Networking/Firestore';
import useLogout from '../Hooks/useLogout';
import DismissibleModal from '../Components/DismissibleModal';
import CustomIcon from '../Components/CustomIcon';
import { IONICONS } from '../Constants/IconFamilies';

const isIos = Platform.OS === 'ios';

const SettingsScreen = ({ navigation }) => {
  const { language, deviceLanguage, uid, loggedIn } = useSelector(
    state => ({
      language: state.language,
      deviceLanguage: state.deviceLanguage,
      uid: state.uid,
      loggedIn: state.loggedIn,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const logout = useLogout();

  const onPressLogout = async () => {
    setShowLogoutPopup(false);
    logout();
    navigation.goBack();
  };

  const deleteUserAndLogout = () => {
    if (!__DEV__) {
      return;
    }
    deleteUserDoc(uid);
    dispatch(setUserData(initialState));
    onPressLogout();
  };

  const onSelectLanguage = languageArg => {
    if (languageArg !== deviceLanguage) {
      dispatch(setLanguageIsSetManually(true));
    } else {
      dispatch(setLanguageIsSetManually(false));
    }

    dispatch(setLanguage(languageArg));
  };

  const navigateToHelp = () => {
    navigation.navigate('Help');
  };

  const navigationToLoginIn = () => {
    navigation.navigate("Auth");
  };

  const navigateToProfile = () => navigation.navigate('Profile');

  return (
    <View style={styles.container}>
     <StatusBar translucent barStyle="light-content" backgroundColor="#425c5a" />

      {/* <NavigationHeader
        //title={UIText[language].settings}
        navigation={navigation}
        noneTranslucent
        borderShown
        language={language}
      /> */}
      <View style={styles.backButton}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonTouch}>
          <Image
            source={require('../../assets/images/settingsBack.png')}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.btnsContainer}>
        {(__DEV__ || isIos) && (
          <FullWidthButton
            textStyle={{
              color: '#ffcea2',
              fontSize: 21,
            }}
            //onLongPress={deleteUserAndLogout}
            buttonName={UIText[language].language}
            language={language}
            onChangeDropDownValue={onSelectLanguage}
            dropdownData={[
              { value: 'en', label: UIText[language].english },
              { value: 'ar', label: UIText[language].arabic },
            ]}
            containerStyle={{
              backgroundColor: '#425c5a',
              flexDirection: language === 'ar' && isIos ? 'row-reverse' : 'row',
              direction: 'ltr',
            }}
          />
        )}

        <FullWidthButton
          textStyle={{
            color: '#ffcea2',
            fontSize: 21,
          }}
          onPress={navigateToHelp}
          buttonName={UIText[language].help}
          iconName="ios-help-circle"
          containerStyle={{ backgroundColor: '#425c5a' }}
        />

       {/*  {loggedIn && (
          <FullWidthButton
            containerStyle={{ borderBottomWidth: 0, backgroundColor: '#425c5a' }}
            textStyle={{
              color: '#ffcea2',
              fontSize: 21,
            }}
            onPress={navigateToProfile}
            //onLongPress={deleteUserAndLogout}
            buttonName={UIText[language].profileSettings}
            iconName="ios-settings"
            language={language}
          />
        )}
 */}

        {loggedIn && (
          <FullWidthButton
            containerStyle={{ borderBottomWidth: 0, backgroundColor: '#425c5a' }}
            textStyle={{
              color: '#ffcea2',
              fontSize: 21,
            }}
            onPress={() => setShowLogoutPopup(true)}
            //onLongPress={deleteUserAndLogout}
            buttonName={UIText[language].logout}
            iconName="ios-log-out"
            language={language}
          />
        )}

        {!loggedIn && (
          <FullWidthButton
            containerStyle={{ borderBottomWidth: 0, backgroundColor: '#425c5a' }}
            textStyle={{
              color: '#ffcea2',
              fontSize: 21,
            }}
            onPress={navigationToLoginIn}
            //onLongPress={deleteUserAndLogout}
            buttonName={UIText[language].login}
            iconName="ios-log-in"
            language={language}
          />
        )}

      </View>

      <DismissibleModal
        visible={showLogoutPopup}
        okayBtnLabel={UIText[language].logout}
        okayBtnColor={Colors.red}
        cancelBtnLabel={UIText[language].cancel}
        onPressOk={onPressLogout}
        dismiss={() => setShowLogoutPopup(false)}
        style={{ width: '80%' }}
        includeCancelBtn>
        <CustomIcon
          name="ios-log-out"
          iconFamily={IONICONS}
          size={35}
          color={Colors.tintColor}
          style={styles.popupIcon}
        />

        <View style={styles.popupLabelContainer}>
          <Text style={styles.popupLabel}>
            {UIText[language].confirmLogout}
          </Text>
        </View>
      </DismissibleModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#425c5a',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    right: 26,
  },
  backButtonTouch: {
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonImage: {
    width: 21,
    height: 20,
  },
  btnsContainer: {
    flex: 1,
    paddingTop: 130,
    paddingHorizontal: 26,
  },
  popupIcon: {
    alignSelf: 'center',
    marginTop: 10,
  },
  popupLabelContainer: {
    width: '100%',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 10,
  },
  popupLabel: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.grayTextColor,
  },
});

export default SettingsScreen;
