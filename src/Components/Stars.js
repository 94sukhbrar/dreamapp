import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Star from './Star';

const Stars = ({ size, rating, onRate, language }) => (
  <View style={styles.container}>
    <Star value={1} size={size} rating={rating} onPress={onRate} language={language} />
    <Star value={2} size={size} rating={rating} onPress={onRate} language={language} />
    <Star value={3} size={size} rating={rating} onPress={onRate} language={language} />
    <Star value={4} size={size} rating={rating} onPress={onRate} language={language} />
    <Star value={5} size={size} rating={rating} onPress={onRate} language={language} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

Stars.propTypes = {
  size: PropTypes.number,
  rating: PropTypes.number,
  language: PropTypes.string,
}

export default Stars;