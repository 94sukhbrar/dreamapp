import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Layout from '../Constants/Layout';
import { reportProblem } from '../Utilities/Tools';

const backBtnSize = 33;

const NavigationHeader = props => {
  const {
    navigation,
    title,
    absolute,
    navigateBackTo,
    roundBtn,
    noneTranslucent,
    borderShown,
    language,
    onPressBack,
  } = props;

  const absoluteStyle = absolute
    ? {position: 'absolute', top: 0, left: 0, right: 0}
    : {};

  const navigateBack = () => {
    if (navigateBackTo) navigation.navigate(navigateBackTo);
    else navigation.goBack();
  };

  const backgroundColor = noneTranslucent
    ? Colors.backgroundColor
    : 'transparent';
  const backBtnBackgroundColor = roundBtn
    ? 'rgba(255, 255, 255, 0.2)'
    : 'transparent';
  const backBtnIconSize = backBtnSize - (roundBtn ? 6 : 2);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderBottomColor: Colors.headerBorderColor,
          borderBottomWidth: borderShown ? 0.5 : 0,
        },
        absoluteStyle,
      ]}>
      <TouchableOpacity
        style={[styles.backButton, {backgroundColor: backBtnBackgroundColor}]}
        onPress={onPressBack || navigateBack}>
        <Icon
          style={{transform: [{scaleX: language == 'ar' ? -1 : 1}]}}
          name={'ios-arrow-back'}
          size={backBtnIconSize}
          color={Colors.grayTextColor}
        />
      </TouchableOpacity>

      <Text style={[styles.screenTitle, {color: Colors.fadedTextColor}]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: Layout.screenAspectRatio > 16 / 9 ? 90 : 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 15,
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    height: backBtnSize,
    width: backBtnSize,
    borderRadius: backBtnSize / 2,
    justifyContent: 'center',
    paddingLeft: 9,
    bottom: 8,
  },
  screenTitle: {
    fontSize: 19,
  },
});

NavigationHeader.propTypes = {
  language: PropTypes.string,
  navigation: PropTypes.object,
  title: PropTypes.string,
  navigateBackTo: PropTypes.string,
  absolute: PropTypes.bool,
  roundBtn: PropTypes.bool,
  noneTranslucent: PropTypes.bool,
  borderShown: PropTypes.bool,
  onPressBack: PropTypes.func,
};

export default NavigationHeader;
