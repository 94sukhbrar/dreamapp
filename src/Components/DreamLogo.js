import React, { useEffect, useState, useRef, useContext } from 'react';
import { 
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';

const DreamLogo = ({fontSize}) => (
  <Text style={[styles.textContainer, {fontSize}]}>
    Dream
    <Text style={{color: Colors.tintColor, fontSize: fontSize + 5}}>.</Text>
  </Text>
);

const styles = StyleSheet.create({
  textContainer:{
    fontWeight: 'bold',
    color: '#000',
  },
});

DreamLogo.propTypes = {
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default DreamLogo;