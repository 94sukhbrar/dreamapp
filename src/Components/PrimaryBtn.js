import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Layout from '../Constants/Layout';
import Colors from '../Constants/Colors';
import { IONICONS, FONT_AWESOME } from '../Constants/IconFamilies';
import CustomIcon from './CustomIcon';

const iconSize = 25;

const PrimaryBtn = ({
  label,
  onPress,
  onLongPress,
  loading,
  iconName,
  iconFamily,
  style,
  disabled,
}) => (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: disabled ? "#f9f8f8" : Colors.tintColor },
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled || loading}>
      {iconName != undefined && (
        <CustomIcon
          iconFamily={iconFamily}
          name={iconName}
          color={'#fff'}
          size={iconSize}
          style={styles.icon}
        />
      )}

      <Text style={styles.label}>{label}</Text>

      <ActivityIndicator
        animating={loading}
        size="small"
        color={'#fff'}
        style={styles.loadingIndicator}
      />
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
  container: {
    height: Layout.primaryBtnHeight,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 8,
  },
  icon: {
    position: 'absolute',
    left: '8%',
  },
  label: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 18,
  },
  loadingIndicator: {
    position: 'absolute',
    right: '8%',
  },
});

PrimaryBtn.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  iconName: PropTypes.string,
  iconFamily: PropTypes.oneOf([IONICONS, FONT_AWESOME]),
  style: ViewPropTypes.style,
};

PrimaryBtn.defaultProps = {
  loading: false,
  disabled: false,
  iconFamily: IONICONS,
};

export default PrimaryBtn;
