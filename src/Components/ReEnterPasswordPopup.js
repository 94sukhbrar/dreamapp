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
import Icon from 'react-native-vector-icons/Ionicons';

const ReEnterPasswordPopup = ({ language, visible, attemptLoginWithPassword, dismiss, errorMessage, loading}) => {

  const [password, setInputValue] = useState('');

  const textInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => visible && textInputRef.current.focus(), 0);
  }, [visible]);

  const onPressOk = () => {
    attemptLoginWithPassword(password);
  }

  return (
    <DismissibleModal
      visible={visible}
      okayBtnLabel={UIText[language].changeEmail}
      onPressOk={onPressOk}
      dismiss={dismiss}
      loading={loading}>
      <View style={styles.container}>
        <Icon
          name='ios-lock'
          size={35}
          color={Colors.tintColor}
          style={styles.icon}
        />

        <Text style={styles.title}>{UIText[language].reEnterPassword}</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>

        <TextInput
          ref={textInputRef}
          editable
          style={styles.textInput}
          value={password}
          onChangeText={text => setInputValue(text)}
          autoCompleteType='password'
          secureTextEntry={true}
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

ReEnterPasswordPopup.propTypes = {
  language: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  attemptLoginWithPassword: PropTypes.func,
  dismiss: PropTypes.func,
  errorMessage: PropTypes.string,
  loading: PropTypes.bool,
}

export default ReEnterPasswordPopup;