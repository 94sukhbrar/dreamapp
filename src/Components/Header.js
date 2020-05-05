import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import DreamLogo from './DreamLogo';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';
import Layout from '../Constants/Layout';
import RoundImage from './RoundImage';
import UIText from '../Constants/UIText';

const Header = ({ navigation, language, photoUrl, loggedIn, borderShown }) => {

  const navigateToProfile = () => navigation.navigate('Profile');
  const navigateToSettings = () => navigation.navigate('Settings');
  const navigateToAuth = () => navigation.navigate('Auth');

  return (
    <View style={[styles.container, {borderBottomColor: Colors.headerBorderColor, borderBottomWidth: borderShown ? .5 : 0}]}>
      <TouchableOpacity style={styles.leftBtn} onPress={loggedIn ? navigateToProfile : navigateToAuth}>
      {
        loggedIn
          ? <RoundImage size={35} uri={photoUrl} onPress={navigateToProfile} />
          : <Text style={styles.loginBnLabel}>{UIText[language].login.toUpperCase()}</Text>
      }
      </TouchableOpacity>
      <DreamLogo fontSize={30}/>
      <TouchableOpacity style={styles.settingsBtn} onPress={navigateToSettings}>
        <Icon name='md-settings' size={30} color={Colors.fadedTextColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    width: Layout.screenWidth,
    height: Layout.rootScreensAbsoluteHeaderHeight,
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: Layout.screenHeight > 850 ? 25 : 5,
  },
  leftBtn: {
    position: 'absolute',
    left: 15,
    bottom: Layout.screenHeight > 850 ? 25 : 5,
  },
  loginBnLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.tintColor,
    marginBottom: 8,
  },
  settingsBtn: {
    position: 'absolute',
    padding: 5,
    right: 10,
    bottom: Layout.screenHeight > 850 ? 25 : 5,
  }
});

Header.propTypes = {
  navigation: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  photoUrl: PropTypes.string,
  loggedIn: PropTypes.bool.isRequired,
  borderShown: PropTypes.bool,
}

export default Header;