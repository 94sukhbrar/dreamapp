import React from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import PropTypes from 'prop-types';
import DismissibleModal from './DismissibleModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import UIText from '../Constants/UIText';
import Colors from '../Constants/Colors';

const isIos = Platform.OS === 'ios';

const DateAndTimePicker = props => {
  const {
    language,
    visible,
    onPressSelect,
    dismiss,
    pickerMode,
    labelColor,
    label,
    minimumDate,
    maximumDate,
    value,
    onChange,
  } = props;

  const pickerContainer = (
    <>
      {isIos && (
        <>
          <Icon
            name={pickerMode == 'date' ? 'md-calendar' : 'md-time'}
            size={35}
            color={Colors.tintColor}
            style={styles.pickerIcon}
          />
          <View style={styles.labelContainer}>
            <Text style={[styles.label, {color: labelColor}]}>{label}</Text>
          </View>
        </>
      )}


      <DateTimePicker
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        testID="dateTimePicker"
        value={value}
        mode={pickerMode}
        is24Hour={false}
        display="default"
        onChange={onChange}
        style={{height: 200}}
      />
    </>
  )

  if (!visible) return null;

  if (!isIos) return pickerContainer;

  return (
    <DismissibleModal
      visible={visible}
      onPressOk={onPressSelect}
      dismiss={dismiss}
      okayBtnLabel={UIText[language].select}>
        {pickerContainer}
    </DismissibleModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%',
  },
  pickerIcon: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 10,
  },
  labelContainer: {
    width: '100%',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

DateAndTimePicker.propTypes = {
  prop: PropTypes.object,
};

export default DateAndTimePicker;
