import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import Layout from '../Constants/Layout';

const scrollViewPaddingVertical = Layout.screenHeight * 0.018;

const ConsultantsHorizontalPicker = ({ children }) => (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={{paddingVertical: scrollViewPaddingVertical, paddingHorizontal: 5}} horizontal>
      { children }
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container:{
    height: Layout.consultantCardsHeight + 2 * scrollViewPaddingVertical,
    width: '100%',
  },
});

ConsultantsHorizontalPicker.propTypes = {
  children: PropTypes.any,
}

export default ConsultantsHorizontalPicker;