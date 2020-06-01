import React, { useState } from 'react';
import { 
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import Layout from '../Constants/Layout';
import { IONICONS, FONT_AWESOME, FEATHER, ENTYPO } from '../Constants/IconFamilies';
import CustomIcon from './CustomIcon';
import { calculateBottomOffsetFromLayout } from '../Utilities/Tools';

const IconInputField = props => {
  const {
    title,
    note,
    placeholder,
    iconName,
    iconSize,
    onPress,
    onFocus,
    onBlur,
    textColor,
    iconFamily,
    value,
    onChangeText,
    textInputWidth,
    multiline,
    style,
  } = props;
  const [bottomOffset, setBottomOffset] = useState(0);

  const onLayout = event => {
    const calculatedBottomOffset = calculateBottomOffsetFromLayout(event.nativeEvent.layout, Layout.screenHeight);
    
    setBottomOffset(calculatedBottomOffset);
  };

  const textInputOrButton = () => {
    if (onPress) {
      return (
        <TouchableOpacity
          style={[ styles.textInput, {width: textInputWidth || '82%', justifyContent: 'center'} ]}
          onPress={onPress}>
          <Text style={{color: textColor, fontSize: 17,}}>{placeholder}</Text>
        </TouchableOpacity>
      );
    }
  
    return (
      <TextInput
        style={[styles.textInput, {width: textInputWidth || '85%', color: textColor, paddingTop: multiline && 10}]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={textColor}
        multiline={multiline}
        onFocus={() => onFocus && onFocus(bottomOffset)}
        onBlur={() => onBlur && onBlur(0)}
      />
    );
  }

  return (
    <View style={styles.container} onLayout={!bottomOffset && onLayout}>
      <Text style={[ styles.title, {color: Colors.fadedTextColor} ]}>
        {title}
        {note && <Text style={{fontSize: 13}}>{'  ' + note}</Text>}
      </Text>
      <View style={[styles.subContainer, style]}>
        { textInputOrButton() }

        {iconName != undefined && (
          <TouchableOpacity style={styles.iconContainer} disabled={!onPress} onPress={onPress}>
            <CustomIcon
              name={iconName}
              color={Colors.tintColor}
              size={iconSize || 30}
              iconFamily={iconFamily}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    marginVertical: 7,
  },
  title: {
    marginBottom: 10,
    fontSize: 16,
  },
  subContainer: {
    width: '100%',
    height: Layout.primaryTextFieldHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    height: '100%',
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '78%',
    backgroundColor: Colors.secondaryElementsColor,
    color: Colors.textColor,
    fontSize: 18,
  },
  iconContainer: {
    height: Layout.primaryTextFieldHeight,
    width: Layout.primaryTextFieldHeight,
    backgroundColor: Colors.secondaryElementsColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
  }
});

IconInputField.propTypes = {
  title: PropTypes.string,
  note: PropTypes.string,
  placeholder: PropTypes.string,
  iconFamily: PropTypes.oneOf([IONICONS, FONT_AWESOME, FEATHER, ENTYPO]),
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onPress: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  textColor: PropTypes.string.isRequired,
  textInputWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  multiline: PropTypes.bool,
  style: ViewPropTypes.style,
};

export default IconInputField;