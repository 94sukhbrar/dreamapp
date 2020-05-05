import React from 'react';
import { 
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';

const TwoBtnRow = ({
  firstBtnLabel,
  firstBtnColor,
  onFirstBtnPress,
  secondBtnLabel,
  secondBtnColor,
  onSecondBtnPress,
  showTopBorder,
  style,
}) => (
  <View style={[ styles.container, {borderTopWidth: showTopBorder ? 1 : 0}, style ]}>
    <TouchableOpacity style={[styles.btn, {borderRightWidth: .5}]} onPress={onFirstBtnPress}>
      <Text style={[styles.label, {color: firstBtnColor}]}>{firstBtnLabel}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.btn, {borderLeftWidth: .5}]}
      onPress={onSecondBtnPress}>
      <Text style={[styles.label, {color: secondBtnColor}]}>{secondBtnLabel}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container:{
    width: '100%',
    flexDirection: 'row',
    borderColor: Colors.borderColor,
  },
  btn: {
    flex: 1,
    minHeight: 30,
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
    textAlign: 'center',
  }
});

TwoBtnRow.propTypes = {
  firstBtnLabel: PropTypes.string.isRequired,
  firstBtnColor: PropTypes.string,
  onFirstBtnPress: PropTypes.func.isRequired,
  secondBtnLabel: PropTypes.string.isRequired,
  secondBtnColor: PropTypes.string,
  onSecondBtnPress: PropTypes.func.isRequired,
  showTopBorder: PropTypes.bool,
  style: ViewPropTypes.style,
};

TwoBtnRow.defaultProps = {
  firstBtnColor: Colors.tintColor,
  secondBtnColor: Colors.tintColor,
};

export default TwoBtnRow;