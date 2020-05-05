import React from 'react';
import { StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { ACCEPT, DECLINE, SPEAKER, MUTE } from '../Constants/CallBtnTypes';
import Icon from 'react-native-vector-icons/Ionicons';
import Layout from '../Constants/Layout';
import { LARGE, SMALL } from '../Constants/CallBtnSizes';

const iconMap = {
  [ACCEPT]: 'ios-call',
  [DECLINE]: 'ios-call',
  [SPEAKER]: 'ios-volume-high',
  [MUTE]: 'ios-mic-off',
}

const CallBtn = ({ onPress, size, type, active, style }) => {
  const iconName = iconMap[type];

  let btnBackgroundColor;

  switch (type) {
    case ACCEPT:
      btnBackgroundColor = '#00E568';
      break;

    case DECLINE:
      btnBackgroundColor = '#FF0000';
      break;

    case SPEAKER:
    case MUTE:
      if (active)
        btnBackgroundColor = 'rgba(255, 255, 255, 0.7)';
      else
        btnBackgroundColor = 'rgba(255, 255, 255, 0.1)';
      break;
  }
  
  const btnSize = size === LARGE ? Layout.largeCallBtnSize : Layout.smallCallBtnSize;

  return (
    <TouchableOpacity
      style={[
				styles.container,
				{height: btnSize, width: btnSize, borderRadius: btnSize/2, backgroundColor: btnBackgroundColor},
				style,
			]}
      onPress={onPress}>
      <Icon name={iconName} size={40} color="#fff" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

CallBtn.propTypes = {
  onPress: PropTypes.func.isRequired,
  size: PropTypes.oneOf([LARGE, SMALL]).isRequired,
  type: PropTypes.oneOf([ACCEPT, DECLINE, SPEAKER, MUTE]).isRequired,
  active: PropTypes.bool,
  style: ViewPropTypes.style,
}

export default CallBtn;