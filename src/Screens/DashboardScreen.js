import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import Colors from '../Constants/Colors';
import Header from '../Components/Header';
import useUnReviewedConsultantsFetcher from '../Hooks/useUnReviewedConsultantsFetcher';
import ConsultantCard from '../Components/ConsultantCard';
import UIText from '../Constants/UIText';
import { ENTYPO } from '../Constants/IconFamilies';
import IconInputField from '../Components/IconInputField';
import functions from '@react-native-firebase/functions';
import useMessageDisplayer from '../Hooks/useMessageDisplayer';
import { updateUserData, addNewAdminEmail } from '../Networking/Firestore';
import SegmentedControl from '@react-native-community/segmented-control';
import { fetchConsultants, setConsultants } from '../Redux/Actions';


const DashboardScreen = ({navigation}) => {

  const {
    language,
    photoUrl,
    loggedIn,
    loadingConsultants,
    activeConsultants,
    isConnectedToInternet,
  } = useSelector(state => ({
    language: state.language,
    photoUrl: state.photoUrl,
    loggedIn: state.loggedIn,
    loadingConsultants: state.loadingConsultants,
    activeConsultants: state.consultants,
    isConnectedToInternet: state.isConnectedToInternet,
  }), shallowEqual);

  const dispatch = useDispatch();

  const [showHeaderBorder, setShowHeaderBorder] = useState(false);
  const [toBeGrantedAdministrationEmail, setToBeGrantedAdministrationEmail] = useState('');
  const [unReviewedConsultants, setUnReviewedConsultants] = useState({});
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);

  const [messageDisplayer, displayMessage] = useMessageDisplayer();
  const [fetchUnReviewedConsultants, loading] = useUnReviewedConsultantsFetcher();

  useEffect(() => {
    setUpUnReviewedConsultants();
    dispatch(fetchConsultants());
  }, []);

  const setUpUnReviewedConsultants = async () => {
    const fetchedConsultants = await fetchUnReviewedConsultants();

    setUnReviewedConsultants(fetchedConsultants);
  }

  const onRefresh = () => {
    setUpUnReviewedConsultants();
    dispatch(fetchConsultants());
  };

  const respondToConsultant = (consultantId, response) => {
    if (!isConnectedToInternet) {
      displayMessage(UIText[language].checkInternetConnectionAndTry());
      return;
    }

    const consultant = unReviewedConsultants[consultantId];

    const accountActivated = response;
    const updatedUserData = {accountActivated, accountReviewed: true};

    updateUserData(consultantId, updatedUserData);
    const notifyUserConsultantUponAccountReview = 
      functions().httpsCallable('notifyUserConsultantUponAccountReview');
    notifyUserConsultantUponAccountReview({uid: consultantId, accountActivated});

    const updatedConsultant = {...consultant, accountActivated, accountReviewed: true};

    const updatedConsultantsObject = {
      ...unReviewedConsultants,
      [consultantId]: updatedConsultant,
    };

    setUnReviewedConsultants(updatedConsultantsObject);
  }

  const unReviewedConsultantsMapper = consultantUid => {
    const consultant = unReviewedConsultants[consultantUid];
    const { name, photoUrl, pricePerCall, rating, numberOfRates, bio, email } = consultant;
    
    return (
      <ConsultantCard
        style={{width: '90%', height: 'auto', marginTop: 25}}
        language={language}
        name={name}
        photoUrl={photoUrl}
        pricePerCall={pricePerCall}
        rating={rating}
        numberOfRates={numberOfRates}
        bio={bio}
        key={consultantUid}
        id={consultantUid}
        onRespond={respondToConsultant}
        email={email}
        reviewingAccount
      />
    );
  };

  const activeConsultantsMapper = consultantUid => {
    const consultant = activeConsultants[consultantUid];
    const { name, photoUrl, pricePerCall, paymentDue} = consultant;
    
    return (
      <ConsultantCard
        style={{width: '90%', height: 'auto', marginTop: 25}}
        language={language}
        name={name}
        photoUrl={photoUrl}
        pricePerCall={pricePerCall}
        key={consultantUid}
        id={consultantUid}
        paymentDue={paymentDue}
        resetPaymentDue={resetPaymentDue}
        viewingPaymentDue
      />
    );
  };

  const resetPaymentDue = consultantId => {
    if (!isConnectedToInternet) {
      displayMessage(UIText[language].checkInternetConnectionAndTry());
      return;
    }

    updateUserData(consultantId, {paymentDue: 0});
    const consultant = activeConsultants[consultantId];

    const updatedConsultant = {...consultant, paymentDue: 0};

    const updatedConsultantsObject = {
      ...activeConsultants,
      [consultantId]: updatedConsultant,
    };

    dispatch(setConsultants(updatedConsultantsObject));
  }

  const onScroll = event => setShowHeaderBorder(event.nativeEvent.contentOffset.y > 1);

  const onPressGrant = async () => {
    Keyboard.dismiss();

    if (!isConnectedToInternet) {
      displayMessage(UIText[language].checkInternetConnectionAndTry());
      return;
    }

    const email = toBeGrantedAdministrationEmail.toLowerCase();
    const grantAdminstration = functions().httpsCallable('grantAdminstration');
    const response = await grantAdminstration({email});
    const {error, result} = response.data;

    if (error) {
      displayMessage(error);
      return;
    } else displayMessage(result);

    addNewAdminEmail(email);
  };

  const addAdministratorFieldContainer = (
    <View style={{width: '100%', alignItems: 'center', marginTop: 30}}>
      <IconInputField
        title={UIText[language].grantAdministration}
        iconName='email'
        iconSize={25}
        iconFamily={ENTYPO}
        textColor={Colors.tintColor}
        value={toBeGrantedAdministrationEmail}
        onChangeText={text => setToBeGrantedAdministrationEmail(text)}
      />

      <TouchableOpacity style={styles.addAdministratorBtn} onPress={onPressGrant}>
        <Text style={styles.addAdministratorBtnLabel}>{UIText[language].addAdministrator}</Text>
      </TouchableOpacity>
    </View>
  );

  const unReviewedConsultantsContainer = (
    <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={styles.unReviewedConsultantsTitle}>
          {UIText[language].unReviewedConsultants}
        </Text>

        {!loading && (
          Object.keys(unReviewedConsultants)
            .filter(key => !unReviewedConsultants[key].accountReviewed)
            .map(unReviewedConsultantsMapper)
        )}

        {Object.keys(unReviewedConsultants).length === 0 && (
          <Text style={styles.noNewConsultants}>
            {UIText[language].noNewConsultantsToBeReviewed}
          </Text>
        )}
    </View>
  );

  const paymentDuesContainer = (
    <View style={{width: '100%', alignItems: 'center'}}>
      { !loadingConsultants && Object.keys(activeConsultants).map(activeConsultantsMapper) }

      {Object.keys(activeConsultants).length === 0 && (
        <Text style={styles.noNewConsultants}>
          {UIText[language].noNewConsultantsToBeReviewed}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle='default' backgroundColor='rgba(0, 0, 0, 0.1)' />
      <Header
        navigation={navigation}
        photoUrl={photoUrl}
        loggedIn={loggedIn}
        language={language}
        borderShown={showHeaderBorder}
      />

      <SegmentedControl
        style={styles.segmentedControl}
        values={[ UIText[language].activateConsultants, UIText[language].paymentDues, UIText[language].addAdministrators ]}
        selectedIndex={selectedSegmentIndex}
        onChange={event => {
          setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
        }}
        appearance='light'
      />

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        scrollEnabled={true}
        keyboardShouldPersistTaps='handled'
        onScroll={onScroll}
        scrollEventThrottle={25}
        refreshControl={
          <RefreshControl
            refreshing={loading || loadingConsultants}
            onRefresh={onRefresh}
            tintColor={Colors.fadedTextColor}
            colors={['#0077bc']}
          />
        }>

          {selectedSegmentIndex === 0 && unReviewedConsultantsContainer}
          {selectedSegmentIndex === 1 && paymentDuesContainer}
          {selectedSegmentIndex === 2 && addAdministratorFieldContainer}

      </ScrollView>

      { messageDisplayer }
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  segmentedControl: {
    height: 32,
    width: '95%',
    alignSelf: 'center',
    marginTop: 5,
  },
  scrollViewContainer:{
    alignItems: 'center',
    paddingBottom: 20,
  },
  addAdministratorBtn: {
    height: 35,
    paddingHorizontal: 10,
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 15,
    marginLeft: 20,
  },
  addAdministratorBtnLabel: {
    color: '#fff',
    fontSize: 16,
  },
  unReviewedConsultantsTitle: {
    width: '100%',
    marginTop: 35,
    marginBottom: 15,
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.fadedTextColor,
  },
  noNewConsultants: {
    marginTop: 25,
    paddingHorizontal: 20,
    fontSize: 18,
    color: Colors.fadedTextColor,
  }
});

DashboardScreen.propTypes = {
  prop: PropTypes.object,
}

export default DashboardScreen;