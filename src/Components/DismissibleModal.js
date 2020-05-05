import React, { useEffect, useState } from 'react';
import { 
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Easing,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import PrimaryBtn from './PrimaryBtn';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomKeyboardAvoidingView from './CustomKeyboardAvoidingView';
import { calculateBottomOffsetFromLayout } from '../Utilities/Tools';
import Layout from '../Constants/Layout';
import TwoBtnRow from './TwoBtnRow';

const DismissibleModal = props => {

  const {
    children,
    visible,
    onPressOk,
    dismiss,
    okayBtnLabel,
    okayBtnColor,
    cancelBtnLabel,
    loading,
    animateOnDismiss,
    includeCancelBtn,
    style,
  } = props;

  const [popupBottomOffset, setPopupBottomOffset] = useState(0);
  const [popupOpacity, setPopupOpacity] = useState(1);  
  const [ popupYTranslation ] = useState(new Animated.Value(Layout.screenHeight));
  const [bottomOffsetReported, setBottomOffsetReported] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setPopupOpacity(1);
    const translation = 0;
    animatePopupTranslation(visible, translation);
  }, [visible]);


  const animatePopupTranslation = (visible, translation) => {
    const duration = visible ? 300 : 200;
    callBack = visible ? null : onDismissTranslationComplete;
    const easing = visible ? Easing.out(Easing.ease) : Easing.cubic;

    animate(popupYTranslation, translation, duration, easing).start(callBack);
  };

  const animate = (drivenValue, targetValue, duration, easing) => {
		return Animated.timing(drivenValue, {
			toValue: targetValue,
      duration,
      useNativeDriver: true,
      easing,
		});
  };

  const onPressDismiss = () => {
    if (!animateOnDismiss) {
      dismiss();
      return;
    }
    const translation = popupBottomOffset + Layout.screenHeight / 2 - popupBottomOffset;
    animatePopupTranslation(false, translation);
  };

  const onDismissTranslationComplete = () => {
    setPopupOpacity(0);
    dismiss();
  };

  const onPopupLayout = event => {
    const bottomOffset = calculateBottomOffsetFromLayout(
      event.nativeEvent.layout,
      Layout.screenHeight,
    );

    setPopupBottomOffset(bottomOffset);
    setBottomOffsetReported(true);
  };

  return (
    <Modal visible={visible} animated animationType='fade' transparent>
      <TouchableWithoutFeedback onPress={onPressDismiss}>
        <View style={[styles.overLay]}>
          <CustomKeyboardAvoidingView
            style={[ styles.modalContainer, {opacity: popupOpacity} ]}
            bottomOffset={popupBottomOffset}
            childIsPopup
            translationDeterminedByOffset>
            <Animated.View
              style={[
                styles.popupContainer,
                {
                  backgroundColor: Colors.elementsColor,
                  transform: [{translateY: popupYTranslation}],
                },
                style,
              ]}
              onLayout={!bottomOffsetReported && onPopupLayout}>
              {/*
                Use a TouchableWithoutFeedback as the popup container 
                to override the parent's onPress action.
              */}
              <TouchableWithoutFeedback style={{width: '100%'}}>
                <View style={{width: '100%'}}>
                  {!includeCancelBtn && (
                    <View style={styles.dismissBtnContainer}>
                      <TouchableOpacity onPress={onPressDismiss}>
                        <Icon
                          name='ios-close'
                          size={48}
                          color={Colors.fadedTextColor}
                          style={{paddingHorizontal: 18, paddingTop: 4}}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  { children }

                  {includeCancelBtn ? (
                      <TwoBtnRow
                        firstBtnLabel={cancelBtnLabel}
                        onFirstBtnPress={onPressDismiss}
                        secondBtnLabel={okayBtnLabel}
                        secondBtnColor={okayBtnColor}
                        onSecondBtnPress={onPressOk}
                        style={{marginBottom: 5, marginTop: 30}}
                      />
                    ) : (
                      <PrimaryBtn
                        loading={loading}
                        style={styles.button}
                        label={okayBtnLabel}
                        onPress={onPressOk}
                      />
                    )
                  }
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </CustomKeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overLay:{
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    overflow: 'hidden',
    width: '92%',
    borderRadius: 12,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  dismissBtnContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  button: {
    height: 45, 
    marginVertical: 10,
    alignSelf: 'center',
  }
});

DismissibleModal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  visible: PropTypes.bool,
  okayBtnLabel: PropTypes.string,
  okayBtnColor: PropTypes.string,
  cancelBtnLabel: PropTypes.string,
  onPressOk: PropTypes.func,
  dismiss: PropTypes.func,
  loading: PropTypes.bool,
  animateOnDismiss: PropTypes.bool,
  includeCancelBtn: PropTypes.bool,
  style: ViewPropTypes.style,
};

DismissibleModal.defaultProps = {
  animateOnDismiss: true,
};

export default DismissibleModal;

