import React, { useState } from 'react';
import { View, StyleSheet, Linking, ScrollView, StatusBar } from 'react-native';
import NavigationHeader from '../Components/NavigationHeader';
import FullWidthButton from '../Components/FullWidthButton';
import TermsAndPrivacyModal from '../Components/TermsAndPrivacyModal';
import Colors from '../Constants/Colors';
import UIText from '../Constants/UIText';
import { useSelector } from 'react-redux';

const Help = ({ navigation }) => {

  const language = useSelector(state => state.language);

  const [showTermsAndPrivacyModal, setShowTermsAndPrivacyModal] = useState(false);
  const [showTermsOrPrivacy, setShowTermsOrPrivacy] = useState('terms');

  const onTermsOrPrivacyPress = termsOrPrivacy => {
    setShowTermsAndPrivacyModal(true); 
    setShowTermsOrPrivacy(termsOrPrivacy); 
  };

  const emailUs = () => {
    try {
      Linking.openURL('mailto:dreamconsultationsapp@gmail.com?subject=&body=');
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <>
      <StatusBar translucent barStyle='default' backgroundColor='rgba(0, 0, 0, 0.1)' />

      <View style={[styles.container, {backgroundColor: Colors.secondaryBackgroundColor}]}>

        <NavigationHeader
          title={UIText[language].help}
          navigation={navigation}
          language={language}
          noneTranslucent
          borderShown
        />

        <ScrollView>
          <FullWidthButton
            containerStyle={{marginTop: 60}}
            onPress={emailUs}
            buttonName={UIText[language].contactUs}
            iconName='md-people'
          />
          <FullWidthButton
            onPress={() => onTermsOrPrivacyPress('terms')}
            buttonName={UIText[language].termsOfService}
            iconName='ios-document'
          />
          <FullWidthButton
            onPress={() => onTermsOrPrivacyPress('privacy')}
            buttonName={UIText[language].privacyPolicy}
            iconName='ios-document'
          />
        </ScrollView>

        <TermsAndPrivacyModal
          visible={showTermsAndPrivacyModal}
          requestClose={() => setShowTermsAndPrivacyModal(false)}
          showTermsOrPrivacy={showTermsOrPrivacy}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
});

export default Help;