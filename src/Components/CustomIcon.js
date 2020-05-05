import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { IONICONS, FONT_AWESOME, FEATHER, ENTYPO } from '../Constants/IconFamilies';
import { ViewPropTypes } from 'react-native';

const CustomIcon = ({iconFamily, name, color, size, style, extraProps}) => {

  const iconProps = {name, color, size, style, ...extraProps}

  switch (iconFamily) {
    case IONICONS:
      return <Ionicons {...iconProps}/>

    case FONT_AWESOME:
      return <FontAwesome {...iconProps}/>

    case FEATHER:
      return <Feather {...iconProps}/>

    case ENTYPO:
      return <Entypo {...iconProps}/>

    default:
      return null;
  }
};

CustomIcon.propTypes = {
  iconFamily: PropTypes.oneOf([IONICONS, FONT_AWESOME, FEATHER, ENTYPO]),
  name: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
  style: ViewPropTypes.style,
  extraProps: PropTypes.object,
};

CustomIcon.defaultProps = {
  iconFamily: IONICONS,
}

export default CustomIcon;
