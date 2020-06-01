/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  setUserData,
  setLoggedIn,
  setKeepLoggedIn,
  setUid,
  setIsAdmin,
} from '../Redux/Actions';
import UIText from '../Constants/UIText';
import AuthImageBackground from '../Components/AuthBackgroundImage';
import LoginAndSignUpBtn from '../Components/LoginAndSignUpBtn';
import TransparentTextField from '../Components/TransparentTextField';
import DreamLogo from '../Components/DreamLogo';
//import styles from '../SharedStyles/AuthScreensStyles';
//import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import KeyboardDismissor from '../Components/KeyboardDismissor';
import CustomKeyboardAvoidingView from '../Components/CustomKeyboardAvoidingView';
import Layout from '../Constants/Layout';
import CheckBox from '../Components/CheckBox';
import Colors from '../Constants/Colors';
import RegexPatterns from '../Constants/RegexPatterns';
import {
  fetchUserData,
  updateUserPrivateData,
  checkAdministration,
} from '../Networking/Firestore';
import {
  loginUserIn,
  sendResetPasswordEmail,
} from '../Networking/Authentication';
import useMessageDisplayer from '../Hooks/useMessageDisplayer';
import NavigationHeader from '../Components/NavigationHeader';
import ResetPasswordPopup from '../Components/ResetPasswordPopup';
import useNotificationRegisterer from '../Hooks/useNotificationRegisterer';
import { reportProblem } from '../Utilities/ErrorHandlers';

const topMargin = 35;
const keyboardYTranslation =
  Layout.authScreensDreamLogoContainerAbsoluteHeight - topMargin;

const LoginScreen = ({ navigation }) => {
  const [keepUserLoggedIn, setKeepUserLoggedIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messageDisplayer, displayMessage] = useMessageDisplayer();
  const registerForPushNotifications = useNotificationRegisterer();

  const { language, isConnectedToInternet } = useSelector(
    state => ({
      language: state.language,
      isConnectedToInternet: state.isConnectedToInternet,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const onPressLogin = async () => {
    Keyboard.dismiss();

    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();

    if (!emailIsValid || !passwordIsValid) {
      return;
    }

    if (!isConnectedToInternet) {
      displayNoConnectionMessage();
      return;
    }

    setLoading(true);

    let user;
    try {
      ({ user } = await loginUserIn(email, password));
      if (!user) {
        throw new Error('User is undefined');
      }
    } catch (error) {
      handleLoginError(error);
      setLoading(false);
      return;
    }

    const { uid } = user;

    let userDoc;
    try {
      userDoc = await fetchUserData(uid);
    } catch (error) {
      reportProblem(error);
      displayMessage(UIText[language].noUserMessage);
      setLoading(false);
      return;
    }

    if (userDoc.exists) {
      checkAdministration(email).then(collectionSnap => {
        if (!collectionSnap.empty) {
          dispatch(setIsAdmin(true));
        }
      });

      updateUserPrivateData(uid, { language });
      dispatchDataToStore(userDoc, uid);
      setLoading(false);
      registerForPushNotifications(uid);
      navigation.navigate('Main');
    }
  };

  const handleLoginError = error => {
    switch (error.code) {
      case 'auth/network-request-failed':
        displayNoConnectionMessage();
        break;

      case 'auth/user-not-found':
        displayMessage(UIText[language].noUserMessage);
        break;

      default:
        reportProblem(error);
        displayMessage(error.message);
    }
  };

  const displayNoConnectionMessage = action => {
    displayMessage(UIText[language].checkInternetConnectionAndTry(action));
  };

  const dispatchDataToStore = (userDoc, uid) => {
    dispatch(setUserData(userDoc.data()));
    dispatch(setUid(uid));
    dispatch(setLoggedIn(true));
    dispatch(setKeepLoggedIn(keepUserLoggedIn));
  };

  const onEmailChangeText = text => setEmail(text);

  const onPasswordChangeText = text => setPassword(text);

  const toggleKeepUserLoggedIn = () => setKeepUserLoggedIn(!keepUserLoggedIn);

  const onPressForgotPassword = () => {
    Keyboard.dismiss();
    setShowResetPasswordPopup(true);
  };

  //const navigateToSignUpScreen = () => navigation.navigate('SignUp');

  const validateEmail = () => {
    if (!email) {
      setEmailErrorMessage(UIText[language].blankEmail);
    } else if (!RegexPatterns.email.test(email)) {
      setEmailErrorMessage(UIText[language].invalidEmail);
    } else {
      setEmailErrorMessage('');
      return true;
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordErrorMessage(UIText[language].blankPassword);
    } else if (!RegexPatterns.password.test(password)) {
      setPasswordErrorMessage(UIText[language].invalidPassword);
    } else {
      setPasswordErrorMessage('');
      return true;
    }
  };

  const onPressSendResetPasswordEmail = async receiverEmail => {
    setShowResetPasswordPopup(false);
    try {
      await sendResetPasswordEmail(receiverEmail);
      displayMessage(UIText[language].emailSentSuccessfully);
    } catch (err) {
      if (err.message.includes('no user record')) {
        displayMessage(UIText[language].noUserCorrespondingToEmail);
      } else {
        displayMessage(UIText[language].someThingWentWrong);
      }
    }
  };

  if (loading) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          //backgroundColor: '#000',
          //opacity: 0.1,
        }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
        <View style={{ justifyContent: 'center', marginTop: 30 }}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButtonTouch}>
              <Icon
                style={{ transform: [{ scaleX: language == 'ar' ? -1 : 1 }] }}
                name={'ios-arrow-back'}
                size={33}
                color={Colors.grayTextColor}
              />
            </TouchableOpacity>
          </View>
          <Image
            style={styles.logo}
            source={require('../../assets/images/dreamLogo.png')}
          />
        </View>
        {messageDisplayer}
        <View style={styles.buttonsAndInputs}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUpOptions')}
            style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Create an account</Text>
          </TouchableOpacity>

          <TransparentTextField
            placeholder={UIText[language].email}
            onChangeText={onEmailChangeText}
            type="email"
            language={language}
            onBlur={validateEmail}
            onFocus={() => setEmailErrorMessage('')}
            errorMessage={emailErrorMessage}
          />

          <TransparentTextField
            placeholder={UIText[language].password}
            onChangeText={onPasswordChangeText}
            type="password"
            language={language}
            onBlur={validatePassword}
            onFocus={() => setPasswordErrorMessage('')}
            errorMessage={passwordErrorMessage}
          />

          <TouchableOpacity
            onPress={onPressForgotPassword}
            style={styles.forgotPasswordButton}>
            <Text>{UIText[language].forgotPassword}</Text>
          </TouchableOpacity>

          <CheckBox
            label={UIText[language].keepLoggedIn}
            checked={keepUserLoggedIn}
            onPress={toggleKeepUserLoggedIn}
            fillColor={'#ffcea2'}
            checkMarkColor={Colors.elementsColor}
          />

          {messageDisplayer}

          <TouchableOpacity onPress={onPressLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {showResetPasswordPopup && (
            <ResetPasswordPopup
              language={language}
              visible={showResetPasswordPopup}
              sendResetEmail={onPressSendResetPasswordEmail}
              dismiss={() => setShowResetPasswordPopup(false)}
              email={email}
            />
          )}
        </View>
      </View>

      /* <KeyboardDismissor backgroundColor={Colors.backgroundColor}>
        <StatusBar
          translucent
          barStyle="default"
          backgroundColor="rgba(0, 0, 0, 0.1)"
        />

        {messageDisplayer}

        <CustomKeyboardAvoidingView
          style={styles.container}
          YTranslation={keyboardYTranslation}
          avoidingIsActive={!showResetPasswordPopup}>
          <NavigationHeader
            title=""
            navigation={navigation}
            navigateBackTo={'Main'}
            absolute
            roundBtn
            language={language}
          />

          <View style={{width: '100%', alignItems: 'center'}}>
            <AuthImageBackground>
              <View style={styles.logoContainer}>
                <DreamLogo fontSize={55} />
              </View>

              <Text style={styles.screenTitle}>
                {UIText[language].login.toUpperCase()}
              </Text>

              <TransparentTextField
                placeholder={UIText[language].email}
                onChangeText={onEmailChangeText}
                type="email"
                language={language}
                onBlur={validateEmail}
                onFocus={() => setEmailErrorMessage('')}
                errorMessage={emailErrorMessage}
              />

              <TransparentTextField
                placeholder={UIText[language].password}
                onChangeText={onPasswordChangeText}
                type="password"
                language={language}
                onBlur={validatePassword}
                onFocus={() => setPasswordErrorMessage('')}
                errorMessage={passwordErrorMessage}
              />
            </AuthImageBackground>
          </View>

          <LoginAndSignUpBtn
            text={UIText[language].login.toUpperCase()}
            onPress={onPressLogin}
            loading={loading}
          />

          <View style={localStyles.forgotPasswordAndKeepLoggedInContainer}>
            <CheckBox
              label={UIText[language].keepLoggedIn}
              checked={keepUserLoggedIn}
              onPress={toggleKeepUserLoggedIn}
              fillColor={Colors.invertedBackgroundColor}
              checkMarkColor={Colors.elementsColor}
            />

            <TouchableOpacity onPress={onPressForgotPassword}>
              <Text>{UIText[language].forgotPassword}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.changeAuthMethodBtnContainer}>
            <Text style={{fontSize: 14}}>{UIText[language].dontHaveAccount}</Text>

            <TouchableOpacity onPress={navigateToSignUpScreen}>
              <Text style={styles.changeAuthMethodBtnText}>
                {UIText[language].signUp}
              </Text>
            </TouchableOpacity>
          </View>
        </CustomKeyboardAvoidingView>

        {showResetPasswordPopup && (
          <ResetPasswordPopup
            language={language}
            visible={showResetPasswordPopup}
            sendResetEmail={onPressSendResetPasswordEmail}
            dismiss={() => setShowResetPasswordPopup(false)}
            email={email}
          />
        )}
      </KeyboardDismissor> */
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 29,
    justifyContent: 'space-between',
  },
  buttonsAndInputs: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#a2bfbd',
  },
  header: {
    width: '100%',
    alignSelf: 'center',
  },
  backButtonContainer: {
    width: 30,
    height: 40,
    position: 'absolute',
    left: 0,
  },
  backButtonTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  signUpButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  inputField: {
    backgroundColor: '#f9f8f8',
    width: '100%',
    height: 50,
    borderRadius: 5,
    marginTop: 24,
    padding: 15,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 15,
    padding: 3,
  },
  forgotPasswordButtonText: {
    color: '#000000',
    fontSize: 14,
  },
  keepLoggedIn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    marginTop: 30,
  },
  checkLoggedIn: {
    width: 24,
    height: 24,
    backgroundColor: '#ffcea2',
    borderRadius: 7,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepLoggedInText: {
    color: '#000000',
    fontSize: 14,
  },
  loginButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#425c5a',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 21,
    marginBottom: 40,
  },
  loginButtonText: {
    color: '#ffcea2',
    fontSize: 20,
    fontWeight: '600',
  },
  skipButton: {
    marginBottom: 10,
    marginTop: 50,
    padding: 3,
  },
  skipButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textDecorationLine: 'underline',
  },
});

const localStyles = StyleSheet.create({
  forgotPasswordAndKeepLoggedInContainer: {
    width: Layout.authScreensElementsWidth,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

LoginScreen.propTypes = {
  navigation: PropTypes.object,
};

export default LoginScreen;
