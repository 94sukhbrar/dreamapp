import React, { Children } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';


const ProfileHeader = ({ children }) => (
  <View style={styles.container}>
    { children }
  </View>
)

const styles = StyleSheet.create({
  container:{
    width: '100%',
    minHeight: '28%',
    paddingTop: 95,
    paddingBottom: 10,
    backgroundColor: Colors.secondaryElementsColor,
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});

ProfileHeader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
}

export default ProfileHeader;