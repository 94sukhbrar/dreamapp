import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated,
  Platform,
  Keyboard,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';


const isIos = Platform.OS === 'ios';

const CustomKeyboardAvoidingView = props => {

  let {
    style,
    YTranslation,
    children,
    childIsPopup,
    avoidingIsActive,
    translationDeterminedByOffset,
    bottomOffset,
  } = props;

  const [ animatedYTranslation ] = useState(new Animated.Value(0));
  const [keyBoardListenersAreSet, setKeyBoardListenersAreSet] = useState(false);

  useEffect(() => {
    return () => {
      attemptToRemoveKeyboardEventListeners();
    }
  }, []);

  useEffect(() => {
    if (!avoidingIsActive) 
      attemptToRemoveKeyboardEventListeners();

    // If translation is determined by offset, wait for the offset to be defined 
    // before setting the listener.
    else if (translationDeterminedByOffset && bottomOffset)
      attemptToSetKeyboardEventListeners();

    // Else wait for the YTranslation to be defined before setting the listener.
    else if (YTranslation)
      attemptToSetKeyboardEventListeners();
  }, [avoidingIsActive, YTranslation, bottomOffset]);

  const attemptToSetKeyboardEventListeners = () => {
    if (keyBoardListenersAreSet) return;

    if (isIos) {
      Keyboard.addListener('keyboardWillShow', keyboardShown);
      Keyboard.addListener('keyboardWillHide', keyboardHidden);
    }
    else {
      Keyboard.addListener('keyboardDidShow', keyboardShown);
      Keyboard.addListener('keyboardDidHide', keyboardHidden);
    }
    setKeyBoardListenersAreSet(true);
  }

  const attemptToRemoveKeyboardEventListeners = () => {
    if (!keyBoardListenersAreSet) return;
    try {
      if (isIos) {
        Keyboard.removeAllListeners('keyboardWillShow');
        Keyboard.removeAllListeners('keyboardWillHide');
      } else {
        Keyboard.removeAllListeners('keyboardDidShow');
        Keyboard.removeAllListeners('keyboardDidHide');
      }
    } catch (err) {/*skip*/}
    setKeyBoardListenersAreSet(false);
  }

  const keyboardShown = event => {
    const keyboardHeight = event.endCoordinates.height;
    const animationDuration = 350;
    if (translationDeterminedByOffset) {
      if (childIsPopup && !isIos) return;

      if (keyboardHeight > bottomOffset) {
        YTranslation = keyboardHeight - bottomOffset + 40;
        animate(animatedYTranslation, -YTranslation, animationDuration).start();
      }
    }

    else
      animate(animatedYTranslation, -YTranslation, animationDuration).start();
  }

  const animate = (drivenValue, targetValue, duration) => {
		return Animated.timing(drivenValue, {
			toValue: targetValue,
			duration,
			useNativeDriver: true,
		});
	}

  const keyboardHidden = event => {
    const animationDuration = 350;
    animate(animatedYTranslation, 0, animationDuration).start();
  }

  return (
    <Animated.View style={[ {flex: 1, transform: [ {translateY: animatedYTranslation} ]}, style ]}>
      { children }
    </Animated.View>
  );
}

CustomKeyboardAvoidingView.propTypes = {
  style: ViewPropTypes.style,
  YTranslation: PropTypes.number,
  translationDeterminedByOffset: PropTypes.bool,
  childIsPopup: PropTypes.bool,
  bottomOffset: PropTypes.number,
  avoidingIsActive: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
}

CustomKeyboardAvoidingView.defaultProps = {
  avoidingIsActive: true,
};

export default CustomKeyboardAvoidingView;
