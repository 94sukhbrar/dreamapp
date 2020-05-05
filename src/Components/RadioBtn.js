import React from 'react';
import { 
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import Layout from '../Constants/Layout';

const outerCircleSize = 20;
const innerCircleSize = outerCircleSize * 0.6;

const RadioBtn = ({label, selected, value, onPress}) => (
  <TouchableOpacity testID={`${value}RadioBtn`} style={styles.container} onPress={() => onPress(value)}>
    <View style={styles.outerCircle}>
      {selected && <View style={styles.innerCircle}/>}
    </View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.authScreensElementsAbsoluteMarginVertical,
  },
  outerCircle:{
    width: outerCircleSize,
    height: outerCircleSize,
    borderRadius: outerCircleSize / 2,
    borderColor: '#BFE0DC',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: innerCircleSize,
    height: innerCircleSize,
    borderRadius: innerCircleSize / 2,
    backgroundColor: '#fff'
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  }
});

RadioBtn.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.string,
  onPress: PropTypes.func,
}

export default RadioBtn;