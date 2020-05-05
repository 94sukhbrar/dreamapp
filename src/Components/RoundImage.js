import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';

const RoundImage = ({ size, uri, style }) => {

  const imageDimensions = { height: size, width: size, borderRadius: size/2, borderWidth: uri ? 0 : 2 };

  return (
    <View style={[ styles.imageContainer, imageDimensions, style ]}>
      {
        uri == ''
          ? <Icon name='md-person' size={size * 0.75} color={Colors.grayTextColor} />
          : <Image style={imageDimensions} source={{uri, cache: 'force-cache'}} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.borderColor,
  },
});

RoundImage.propTypes = {
  size: PropTypes.number.isRequired,
  uri: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
}

export default RoundImage;