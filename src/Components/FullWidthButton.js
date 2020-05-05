import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';
import { Dropdown } from 'react-native-material-dropdown';

const FullWidthButton = props => {

  const buttonContainerStyle = [
    styles.buttonContainer,
    {backgroundColor: Colors.elementsColor, borderColor: Colors.borderColor},
    props.containerStyle,
  ];

  const buttonNameStyle = [
    styles.buttonName,
    { color: 'light' == 'dark' ? Colors.textColor : Colors.tintColor },
    props.textStyle,
  ];

  let icon = null;

  const idleIconColor = 'rgb(170, 170, 170)';
  const activeIconColor = Colors.tintColor;

  if (props.iconName) 
    icon = <Icon name={props.iconName} size={props.iconSize || 26} color={props.active ? activeIconColor : idleIconColor} />;

  if (props.iconImage) 
    icon = props.iconImage;

  const onLongPress = () => {
    if (!props.onLongPress) return;
    props.onLongPress();
  }

  const showDropdown = () => { 
    return (
      <Dropdown
        value={props.language}
        label={''}
        data={props.dropdownData}
        animationDuration={100}
        baseColor={Colors.borderColor}
        itemColor={'#000'}
        selectedItemColor={'#000'}
        disabledItemColor={'#000'}
        textColor={Colors.textColor}
        containerStyle={styles.dropdown}
        shadeOpacity={.2}
        rippleOpacity={0}
        rippleDuration={0}
        onChangeText={props.onChangeDropDownValue}
        useNativeDriver
      />
    );
  }

  return (
    <TouchableOpacity style={buttonContainerStyle} onPress={props.onPress} onLongPress={onLongPress} >
      <Text style={buttonNameStyle}>
        {props.buttonName}
      </Text>
      <View style={styles.rightSectionContainer}>
        { props.dropdownData ? showDropdown() : icon }
      </View>
    </TouchableOpacity>
  )
}

FullWidthButton.propTypes = {
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  buttonName: PropTypes.string.isRequired,
  iconName: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  textStyle: PropTypes.object,
  active: PropTypes.bool,
  onChangeDropDownValue: PropTypes.func,
  dropdownData: PropTypes.array,
}

const styles = StyleSheet.create({
  buttonContainer:{
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
  },
  buttonName: {
    position: 'absolute',
    left: 10,
    fontSize: 18,
  },
  rightSectionContainer: {
    position: 'absolute',
    right: 15,
  },
  dropdown: {
    width: 90,
  }
});

export default FullWidthButton;

