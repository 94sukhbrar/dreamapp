import React from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import Colors from '../Constants/Colors';

const TabBarIcon = ({ name, color, size }) => (
  <Octicons
    name={name}
    size={size}
    style={{ marginBottom: -9 }}
    color={color}
  />
);


export default TabBarIcon;