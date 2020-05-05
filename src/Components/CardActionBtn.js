import React, { useEffect, useState, useRef, useContext } from 'react';
import { 
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';
import Layout from '../Constants/Layout';

const CardActionBtn = ({
  width,
  iconName,
  btnLabel,
  backgroundColor,
  labelColor,
  onPress,
  disabled,
  style,
}) => {
  useEffect(() => {}, []);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: disabled
            ? Colors.disabledTintColor
            : backgroundColor,
          width,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled && !__DEV__}>
      {iconName && (
        <Icon
          name={iconName}
          color={labelColor}
          size={25}
          style={{marginBottom: -4}}
        />
      )}

      <Text
        style={{
          color: labelColor,
          marginLeft: iconName ? 10 : 0,
          fontSize: Layout.appointmentCardFontSize,
        }}>
        {btnLabel}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container:{
    height: 37,
    borderRadius: Layout.appointmentCardBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tintColor,
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
});

CardActionBtn.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  iconName: PropTypes.string,
  btnLabel: PropTypes.string,
  backgroundColor: PropTypes.string,
  labelColor: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
}

export default CardActionBtn;