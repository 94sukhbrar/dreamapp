import React from 'react';
import { 
  StyleSheet,
  ImageBackground,
  Dimensions,
  Platform,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import paradise from '../../assets/images/paradise.png';
import { convertPercentageToFraction, calculateImageWidthBasedOnRatio, isStringPercentage } from '../Utilities/Tools';
import Layout from '../Constants/Layout';

const isIos = Platform.OS === 'ios';
const screen = Dimensions.get('screen');

const imageAspectRatio = 564 / 647;

const AuthImageBackground = ({height, children}) => {

  let width = '100%';

  if (isStringPercentage(height)) {
    const heightPercentage = convertPercentageToFraction(height);
    height = heightPercentage * screen.height;
    width = calculateImageWidthBasedOnRatio(height, imageAspectRatio);
  }

  return(
      <ImageBackground style={styles.container} source={paradise} blurRadius={isIos ? 8: 3} >
        <View style={styles.darkOverLay}>
          {children}
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    resizeMode: 'cover',
  },
  darkOverLay: {
    minHeight: Layout.screenHeight * 0.65,
    width: Layout.screenWidth,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignItems: 'center',
    paddingBottom: Layout.authScreensElementsHeight / 2,
  },
});

AuthImageBackground.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
}

export default AuthImageBackground;

