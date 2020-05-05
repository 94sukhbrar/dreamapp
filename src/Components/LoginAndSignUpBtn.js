import React from 'react';
import { 
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import Layout from '../Constants/Layout';

const LoginAndSignUpBtn = ({ text, onPress, loading }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text style={styles.btnText}>{text}</Text>
    
    <ActivityIndicator
      animating={loading}
      size='small'
      color={Colors.grayTextColor}
      style={styles.loadingIndicator}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container:{
    width: Layout.authScreensElementsWidth,
    height: Layout.authScreensElementsHeight,
    marginTop: Layout.authScreensElementsHeight / -2,
    backgroundColor: Colors.elementsColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 15,
  }
});

LoginAndSignUpBtn.propTypes = {
  text: PropTypes.string,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
}

export default LoginAndSignUpBtn;