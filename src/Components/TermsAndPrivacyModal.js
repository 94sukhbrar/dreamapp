import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import TermsAndConditions from './TermsAndConditions';
import PrivacyPolicy from './PrivacyPolicy';
import Colors from '../Constants/Colors';
import Layout from '../Constants/Layout';

const TermsAndPrivacyModal = ({visible, requestClose, showTermsOrPrivacy}) => (
  <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={requestClose}>
    <View style={styles.overlay}>
      <View style={[styles.modal, {backgroundColor: Colors.elementsColor}]}>
        <ScrollView style={[ styles.scrollViewContainer, {backgroundColor: Colors.backgroundColor} ]}>
          {showTermsOrPrivacy == 'terms' ? <TermsAndConditions /> : <PrivacyPolicy />}
        </ScrollView>
        <View style={{ justifyContent: 'center', width: '100%', height: 40 }}>
          <TouchableOpacity style={styles.cancelButton} onPress={requestClose}>
            <Text style={[ styles.cancelButtonText, {color: Colors.textColor} ]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column', 
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modal: {
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column', 
      width: '94%',
      height: Layout.screenAspectRatio > 16/9 ? '65%' : '75%',
      borderColor: 'rgb(200, 200, 200)',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 3 },
      marginTop: -Layout.screenHeight * 0.1,
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 7,
      borderRadius: 8,
  },
  scrollViewContainer:{
    width: '96%',
    borderWidth: 1,
    borderColor: 'rgb(200,200,200)',
    marginTop: 10,
    borderRadius: 3,
    paddingRight: 10,
  },
  cancelButton: {
    height: 40,
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end', 
  },
  cancelButtonText: {
    fontSize: 17,
    alignSelf: 'flex-end',
    marginRight: 10,
  }
});

TermsAndPrivacyModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  requestClose: PropTypes.func.isRequired,
  showTermsOrPrivacy: PropTypes.oneOf(['terms', 'privacy']),
};

export default TermsAndPrivacyModal;
        
        