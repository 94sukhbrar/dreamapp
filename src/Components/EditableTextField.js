import React, { useState, useRef} from 'react';
import { 
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import UIText from '../Constants/UIText';
import Layout from '../Constants/Layout';
import { calculateBottomOffsetFromLayout } from '../Utilities/Tools';

const editBtnSize = 25;

const EditableTextField = props => {

  const {
    label,
    value: appliedValue,
    onApplyChange,
    type,
    language,
    onBottomOffsetDetermined,
  } = props;

  const [unAppliedValue, setUnAppliedValue] = useState(appliedValue);
  const [editable, setEditable] = useState(false);
  const [actionBtnsContainerHeight] = useState(new Animated.Value(0));
  const [bottomOffsetReported, setBottomOffsetReported] = useState(false);

  const textInputRef = useRef(null);

  const onChangeText = text => {
    setUnAppliedValue(text);
  }

  const onDiscardChange = () => {
    setEditable(false);
    setUnAppliedValue(appliedValue);
    animate(actionBtnsContainerHeight, 0, 350).start();
  }

  const onPressEdit = () => {
    setEditable(true);
    setUnAppliedValue(appliedValue);
    setTimeout(() => textInputRef.current.focus(), 0);
    animate(actionBtnsContainerHeight, Layout.profileFieldsActionBtnsHeight, 350).start();
  }

  const applyIsDisabled = appliedValue == unAppliedValue;

  const onPressApply = () => {
    setEditable(false);
    animate(actionBtnsContainerHeight, 0, 350).start();
    onApplyChange({type, value: unAppliedValue});
  }

  const animate  = (drivenValue, animateTo, duration) => {
    return Animated.timing(drivenValue, {
      toValue: animateTo,
      duration,
    })
  }

  const onLayout = event => {
    const bottomOffset = calculateBottomOffsetFromLayout(event.nativeEvent.layout, Layout.screenHeight);
    
    onBottomOffsetDetermined && onBottomOffsetDetermined(bottomOffset);
    setBottomOffsetReported(true);
  }

  return (
    <View style={styles.container} onLayout={!bottomOffsetReported && onLayout}>
      <Text style={{color: Colors.extraFadedTextColor}}>{label}</Text>

      <View style={styles.subContainer}>
        <TextInput
          ref={textInputRef}
          style={{ flex: 9, color: Colors.textColor, paddingHorizontal: 10 }}
          editable={editable}
          value={editable ? unAppliedValue : appliedValue}
          onChangeText={onChangeText}
        />

        <TouchableOpacity
          style={[ styles.editBtn, {backgroundColor: Colors.tintColor} ]}
          onPress={onPressEdit}
        >
          <Icon name='md-create' color='#fff' size={editBtnSize - 8} />
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.actionBtnsContainer, {height: actionBtnsContainerHeight}]}>
        <TouchableOpacity
          style={[ styles.actionBtn, {backgroundColor: Colors.tintColor} ]}
          onPress={onDiscardChange} 
        >
          <Text style={styles.btnLabel}>{UIText[language].discard}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[ styles.actionBtn, {backgroundColor: applyIsDisabled ? Colors.disabledTintColor : Colors.tintColor} ]}
          disabled={applyIsDisabled}
          onPress={onPressApply} 
        >
          <Text style={styles.btnLabel}>{UIText[language].apply}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop: 5,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: '5%',
  },
  subContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    minHeight: editBtnSize + 20,
  },
  editBtnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    width: editBtnSize,
    height: editBtnSize,
    borderRadius: editBtnSize/2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnsContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  actionBtn: {
    paddingHorizontal: 10,
    height: Layout.profileFieldsActionBtnsHeight,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 18,
  },
  btnLabel: {
    color: '#fff',
    fontSize: 14,
  },
});

EditableTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onBottomOffsetDetermined: PropTypes.func,
  onApplyChange: PropTypes.func.isRequired,
}

export default EditableTextField;