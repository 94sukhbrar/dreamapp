import React from 'react';
import { View, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Stars from './Stars';
import {translateDigitsToArabicIfLanguageIsArabic} from '../Utilities/DateAndTimeTools';
import Colors from '../Constants/Colors';
import { roundHalf } from '../Utilities/Tools';

const Rating = ({rating, language, style, size}) => {

  // If no rating, return a dummy view with the same style so it takes the same dimensions.
  if (!rating) return <View style={style} />;

  rating = roundHalf(rating);

  return (
    <View style={{flexDirection: 'row', ...style}}>
      <Stars size={size || 16} rating={rating} language={language} />

      <Text style={{color: Colors.fadedTextColor, fontSize: 12, marginLeft: 2}}>
        {translateDigitsToArabicIfLanguageIsArabic(
          rating + (rating % 1 == 0 && '.0'),
          language,
          true,
        )}
      </Text>
    </View>
  );
};

Rating.propTypes = {
  rating: PropTypes.number,
  language: PropTypes.string,
  size: PropTypes.number,
  style: ViewPropTypes.style,
};

export default Rating;
