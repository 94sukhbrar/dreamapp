import React from 'react';
import { 
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';

const boxSize = 15;

const CheckBox = ({label, checked, onPress, fillColor, checkMarkColor}) => {

  const boxColors = {
    backgroundColor: checked ? fillColor : 'transparent',
    borderColor: checked ? 'transparent' : '#51C8F4',
  }

  return (
    <View style={styles.container} >
      <TouchableOpacity style={styles.boxContainer} onPress={onPress}>
        <View style={[ styles.box, boxColors ]} onPress={onPress}>
          {checked && <Icon name='md-checkmark' color={checkMarkColor} size={13} />}
        </View>
      </TouchableOpacity>
      <Text style={{color: Colors.textColor}}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  box:{
    width: boxSize,
    height: boxSize,
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContainer:{
    padding: 5,
  },
});

CheckBox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  fillColor: PropTypes.string.isRequired,
  checkMarkColor: PropTypes.string.isRequired,
}

export default CheckBox;