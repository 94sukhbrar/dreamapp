import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { setUserData, setLoggedIn, setIsAdmin } from '../Redux/Actions';
import { defaultConsultantData, defaultUserData } from '../Redux/InitialState';
import UIText from '../Constants/UIText';
import AuthImageBackground from '../Components/AuthBackgroundImage';
import LoginAndSignUpBtn from '../Components/LoginAndSignUpBtn';
import TransparentTextField from '../Components/TransparentTextField';
import DreamLogo from '../Components/DreamLogo';
import RadioBtn from '../Components/RadioBtn';
import styles from '../SharedStyles/AuthScreensStyles';
import KeyboardDismissor from '../Components/KeyboardDismissor';
import CustomKeyboardAvoidingView from '../Components/CustomKeyboardAvoidingView';
import Layout from '../Constants/Layout';
import Colors from '../Constants/Colors';
import RegexPatterns from '../Constants/RegexPatterns';
import { USER, CONSULTANT } from '../Constants/UserTypes';
import { createUser } from '../Networking/Authentication';
import useMessageDisplayer from '../Hooks/useMessageDisplayer';
import { uploadUserData, updateUserPrivateData, getToBeUploadedUserData, checkAdministration } from '../Networking/Firestore';
import NavigationHeader from '../Components/NavigationHeader';
import useNotificationRegisterer from '../Hooks/useNotificationRegisterer';
import { reportProblem } from '../Utilities/Tools';


const topMargin = 35;
const keyboardYTranslation = Layout.authScreensDreamLogoContainerAbsoluteHeight - topMargin;

const SignUpScreen = ({ navigation }) => {
  
  const [userType, setUserType] = useState(USER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerForPushNotifications = useNotificationRegisterer();
  const [ messageDisplayer, displayMessage ] = useMessageDisplayer();
  
  const {language, isConnectedToInternet} = useSelector(state => ({
    language: state.language,
    isConnectedToInternet: state.isConnectedToInternet,
  }), shallowEqual);

  const dispatch = useDispatch();
  
  const displayNoConnectionMessage = action => {
    displayMessage(UIText[language].checkInternetConnectionAndTry(action));
  }

  const onPressSignUp = async() => {
    Keyboard.dismiss();

    const nameIsValid = validateName();
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();
    const passwordConfirmationIsValid = validateConfirmPassword();

    if (!emailIsValid || !passwordIsValid || !nameIsValid || !passwordConfirmationIsValid) return;

    if (!isConnectedToInternet) {
      displayNoConnectionMessage();
      return;
    }

    setLoading(true);

    try {
      const { user } = await createUser(email, password);

      if (!user) throw new Error('User is undefined');
      
      const { uid } = user;

      let userData = { ...defaultUserData, uid, name, email, userType };

      if (userType == CONSULTANT)
        userData = {...userData, ...defaultConsultantData}

      const toBeUploadedUserData = getToBeUploadedUserData(userData, userType);

      uploadUserData(uid, toBeUploadedUserData);
      updateUserPrivateData(uid, {language});

      checkAdministration(email).then(collectionSnap => {
        if (!collectionSnap.empty) dispatch(setIsAdmin(true));
      });

      registerForPushNotifications(uid);

      dispatch(setUserData(userData));
      dispatch(setLoggedIn(true));

      setLoading(false);

      userType == USER ? navigateToApp() : showConsultantActivationAlert(uid);
    }
    catch (error) {
      handleSignupError(error);
      setLoading(false);
    }
  }

  const handleSignupError = error => {
    switch (error.code) {
      case 'auth/network-request-failed':
        displayNoConnectionMessage();
        break;

      case 'auth/email-already-in-use':
        displayMessage(UIText[language].emailAlreadyExists);
        break;
    
      default:
        reportProblem(error);
        displayMessage(error.message);
    }
  };

  const showConsultantActivationAlert = uid => {
    Alert.alert(  
      UIText[language].activationMessage,
      '',
      [
        {
          text: UIText[language].ok,
          onPress: () => {
            registerForPushNotifications(uid);
            navigateToApp();
          },
        },
      ]
    );
  }

  const onNameChangeText = text => setName(text);

  const onEmailChangeText = text => setEmail(text);

  const onPasswordChangeText = text => setPassword(text);

  const onPasswordConfirmationChangeText = text => setPasswordConfirmation(text);

  const onSelectUserType = userTypeArg => userTypeArg == setUserType(userTypeArg);

  const navigateToLoginScreen = () => navigation.navigate('Login');

  const navigateToApp = () => navigation.navigate('Main');

  const validateName = () => {
    if (!name) setNameErrorMessage(UIText[language].blankName);

    else {
      setNameErrorMessage('');
      return true;
    }
  }

  const validateEmail = () => {
    if (!email) setEmailErrorMessage(UIText[language].blankEmail);
    else if (!RegexPatterns.email.test(email)) setEmailErrorMessage(UIText[language].invalidEmail);
    else {
      setEmailErrorMessage('');
      return true;
    }
  }

  const validatePassword = () => {
    passwordConfirmation && validateConfirmPassword();
    if (!password) setPasswordErrorMessage(UIText[language].blankPassword);
    else if (!RegexPatterns.password.test(password)) setPasswordErrorMessage(UIText[language].invalidPassword);
    else {
      setPasswordErrorMessage('');
      return true;
    }
  }

  const validateConfirmPassword = () => {
    if (!passwordConfirmation) setConfirmPasswordErrorMessage(UIText[language].blankPasswordConfirmation);
    else if (password != passwordConfirmation) setConfirmPasswordErrorMessage(UIText[language].invalidPasswordConfirmation);
    else {
      setConfirmPasswordErrorMessage('');
      return true;
    }
  }

  return (
    <KeyboardDismissor backgroundColor={Colors.backgroundColor} >
      <StatusBar translucent barStyle='default' backgroundColor='rgba(0, 0, 0, 0.1)' />

      { messageDisplayer }

      <CustomKeyboardAvoidingView style={styles.container} YTranslation={keyboardYTranslation} >
        <NavigationHeader title='' navigation={navigation} navigateBackTo={'Main'} absolute roundBtn language={language}/>
        <View style={{width: '100%', alignItems: 'center'}}>
              <AuthImageBackground>
                  <View style={styles.logoContainer}>
                    <DreamLogo fontSize={55}/>
                  </View>

                  <Text style={styles.screenTitle}>{UIText[language].signUp}</Text>

                  <TransparentTextField
                    placeholder={UIText[language].fullName}
                    onChangeText={onNameChangeText}
                    type='fullName'
                    language={language}
                    onBlur={validateName}
                    onFocus={() => setNameErrorMessage('')}
                    errorMessage={nameErrorMessage}
                  />
                  
                  <TransparentTextField
                    placeholder={UIText[language].email}
                    onChangeText={onEmailChangeText}
                    type='email'
                    language={language}
                    onBlur={validateEmail}
                    onFocus={() => setEmailErrorMessage('')}
                    errorMessage={emailErrorMessage}
                  />

                  <TransparentTextField
                    placeholder={UIText[language].password}
                    onChangeText={onPasswordChangeText}
                    type='password'
                    language={language}
                    onBlur={validatePassword}
                    onFocus={() => setPasswordErrorMessage('')}
                    errorMessage={passwordErrorMessage}
                  />

                  <TransparentTextField
                    placeholder={UIText[language].confirmPassword}
                    onChangeText={onPasswordConfirmationChangeText}
                    type='confirmPassword'
                    language={language}
                    onBlur={validateConfirmPassword}
                    onFocus={() => setConfirmPasswordErrorMessage('')}
                    errorMessage={confirmPasswordErrorMessage}
                  />

                  <View style={styles.userTypeContainer}>
                    <RadioBtn
                      label={UIText[language].user}
                      value={USER}
                      selected={userType == USER}
                      onPress={onSelectUserType}
                    />

                    <RadioBtn
                      label={UIText[language].consultant}
                      value={CONSULTANT}
                      selected={userType == CONSULTANT}
                      onPress={onSelectUserType}
                    />
                  </View>
              </AuthImageBackground>
          </View>

          <LoginAndSignUpBtn text={UIText[language].signUp} onPress={onPressSignUp} loading={loading} />

        <View style={styles.changeAuthMethodBtnContainer}>
          <Text style={{fontSize: 14}}>{UIText[language].haveAccount}</Text>

          <TouchableOpacity onPress={navigateToLoginScreen}>
            <Text style={styles.changeAuthMethodBtnText}>
              {UIText[language].login.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </CustomKeyboardAvoidingView>
    </KeyboardDismissor>
  );
}


SignUpScreen.propTypes = {
  language: PropTypes.string,
  theme: PropTypes.string,
  navigation: PropTypes.object,
}

export default SignUpScreen;