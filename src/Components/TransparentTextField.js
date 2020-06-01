import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Layout from '../Constants/Layout';

const TransparentTextField = ({
  placeholder,
  onChangeText,
  onBlur,
  onFocus,
  type,
  language,
  errorMessage,
}) => {
  let autoCompleteType,
    secureTextEntry,
    keyboardType = 'default';

  switch (type) {
    case 'fullName':
      autoCompleteType = 'name';
      break;
    case 'email':
      autoCompleteType = 'email';
      keyboardType = 'email-address';
      break;
    case 'confirmPassword':
    case 'password':
      autoCompleteType = 'password';
      secureTextEntry = true;
      break;
  }

  return (
    <View style={styles.container}>
      {errorMessage != '' && (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}

      <TextInput
        style={[
          styles.textField,
          { textAlign: language == 'ar' ? 'right' : 'left' },
        ]}
        placeholder={placeholder}
        autoCompleteType={autoCompleteType}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        //placeholderTextColor="red"
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f8f8',
    width: '100%',
    height: 50,
    borderRadius: 5,
    marginTop: 24,
    //padding: 15,
  },
  textField: {
    width: '100%',
    height: '100%',
    textAlignVertical: 'center',
    paddingLeft: 20,
    paddingRight: 8,
    color: '#425c5a',
    borderRadius: 5,
    //borderWidth: 0.5,
    //borderColor: 'red',
  },
  errorMessageContainer: {
    position: 'absolute',
    top: -Layout.errorMessageHeight,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  errorMessage: {
    color: 'red',
    fontSize: Layout.errorMessageFontSize,
  },
});

TransparentTextField.propTypes = {
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.oneOf(['fullName', 'email', 'password', 'confirmPassword'])
    .isRequired,
  language: PropTypes.oneOf(['ar', 'en']).isRequired,
};

export default TransparentTextField;
