import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';

const Star = ({ value, rating, size, onPress, language }) => {

  const active = rating && rating >= value;
  const halfActive = rating && (value - rating) == 0.5;

  let iconName = 'ios-star-outline';

  if (active) iconName = 'ios-star';

  else if (halfActive) iconName = 'ios-star-half';

  return (
    <TouchableOpacity
      style={{marginHorizontal: size / 8}}
      onPress={() => onPress(value)}
      disabled={!onPress}>
      <Icon
        style={{transform: [{scaleX: language == 'ar' ? -1 : 1}]}}
        name={iconName}
        size={size}
        color={active || halfActive ? '#FFC200' : Colors.fadedTextColor}
      />
    </TouchableOpacity>
  );
}

Star.propTypes = {
  value: PropTypes.number.isRequired,
  rating: PropTypes.number,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onPress: PropTypes.func,
  language: PropTypes.string,
};


export default Star;