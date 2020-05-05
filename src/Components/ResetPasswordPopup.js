import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import UIText from '../Constants/UIText';
import Colors from '../Constants/Colors';
import DismissibleModal from '../Components/DismissibleModal';
import RegexPatterns from '../Constants/RegexPatterns';
import Icon from 'react-native-vector-icons/Ionicons';

const ResetPasswordPopup = ({ language, email, visible, sendResetEmail, dismiss }) => {

  const [receiverEmail, setReceiverEmail] = useState(email);
  const [errorMessage, setErrorMessage] = useState('');

  const textInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => visible && textInputRef.current.focus(), 0);
  }, [visible]);

  const onPressOk = () => {
    if (!receiverEmail) 
      setErrorMessage(UIText[language].blankEmail);

    else if (!RegexPatterns.email.test(receiverEmail))
      setErrorMessage(UIText[language].invalidEmail);

    else
      sendResetEmail(receiverEmail);
  }

  return (
    <DismissibleModal
      visible={visible}
      okayBtnLabel={UIText[language].send}
      onPressOk={onPressOk}
      dismiss={dismiss}>
      <View style={styles.container}>
        <Icon
          name='md-mail'
          size={35}
          color={Colors.tintColor}
          style={styles.icon}
        />

        <Text style={styles.title}>{UIText[language].sendResetEmail}</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>

        <TextInput
          ref={textInputRef}
          editable
          style={styles.textInput}
          value={receiverEmail}
          onChangeText={text => setReceiverEmail(text)}
        />
      </View>
    </DismissibleModal>
  );
}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    marginBottom: 25,
    backgroundColor: Colors.backgroundColor,
  },
  icon: {
    position: 'absolute',
    alignSelf: 'center',
    top: -42
  },
  title: {
    fontSize: 20,
    color: Colors.tintColor,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  errorMessage: {
    minHeight: 16,
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 5,
    color: Colors.red,
  },
  textInput: {
    height: 35,
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.borderColor,
    borderBottomWidth: 1,
    padding: 0,
    paddingLeft: 5,
  }
});

ResetPasswordPopup.propTypes = {
  email: PropTypes.string,
  visible: PropTypes.bool,
  okayBtnLabel: PropTypes.string,
  sendResetEmail: PropTypes.func,
  dismiss: PropTypes.func,
}

export default ResetPasswordPopup;