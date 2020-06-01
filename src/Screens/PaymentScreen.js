import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput
} from 'react-native';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import Colors from '../Constants/Colors';
import NavigationHeader from '../Components/NavigationHeader';
import UIText from '../Constants/UIText';
import useAppointmentScheduler from '../Hooks/useAppointmentScheduler';
import useMessageDisplayer from '../Hooks/useMessageDisplayer';
import stripe from 'tipsi-stripe';
import AppointmentCard from '../Components/AppointmentCard';
import {
  convertDateToText,
  convertTimeToText,
  getAppointmentTime,
} from '../Utilities/DateAndTimeTools';
import { USER } from '../Constants/UserTypes';
import PrimaryBtn from '../Components/PrimaryBtn';
import { IONICONS, FEATHER } from '../Constants/IconFamilies';
import { createAndSaveStripeCustomer } from '../Networking/Https';
import { setStripeCustomerId, fetchAppointments } from '../Redux/Actions';
import DismissibleModal from '../Components/DismissibleModal';
import CustomIcon from '../Components/CustomIcon';
import CheckBox from '../Components/CheckBox';
import { reportProblem } from '../Utilities/ErrorHandlers';
import TermsAndPrivacyModal from '../Components/TermsAndPrivacyModal';

const PaymentScreen = ({ route, navigation }) => {
  const { language, name, uid, email, stripeCustomerId, isConnectedToInternet } = useSelector(state => ({
    language: state.language,
    name: state.name,
    uid: state.uid,
    email: state.email,
    stripeCustomerId: state.stripeCustomerId,
    isConnectedToInternet: state.isConnectedToInternet,
  }), shallowEqual);

  const dispatch = useDispatch();

  const { selectedConsultant, appointmentUTCDateTime } = route.params;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userAgrees, setUserAgrees] = useState(true);
  const [showTermsAndPrivacyModal, setShowTermsAndPrivacyModal] = useState(false);

  const [schedule, loading] = useAppointmentScheduler(name, uid);
  const [messageDisplayer, displayMessage] = useMessageDisplayer();

  const [fullName, setFullName] = useState("");
  const [cardNumber, setCardNumber] = useState();

  /**
   * @description Schedule an appointment without requesting card details. (for testing)
   */
  const onPayBtnLongPress = () => {
    if (!__DEV__) return;

    onPaymentComplete();
  };

  const completePaymentsWithStripe = async () => {

    if (!isConnectedToInternet) {
      displayMessage(UIText[language].checkInternetConnectionAndTry());
      return;
    }

    if (stripeCustomerId) {
      // User's customer ID is already saved on the app and the database.
      onPaymentComplete();
      return;
    }

    // User's customer ID hasn't been generated yet.

    const token = await showCardForm();

    if (!token) return; // User canceled the card form.

    try {
      const response = await createAndSaveStripeCustomer(token.tokenId, email);
      const { data: fetchedStripeCustomerId } = response;

      dispatch(setStripeCustomerId(fetchedStripeCustomerId));
      onPaymentComplete();
    } catch (error) {
      reportProblem(error);
      displayMessage(UIText[language].somethingWentWrong);
    }
  };

  const showCardForm = async () => {
    try {
      const token = await stripe.paymentRequestWithCardForm({
        requiredBillingAddressFields: 'zip',
      });

      return token;
    } catch (error) {
      return null;
    }
  };

  const onPaymentComplete = async () => {
    await schedule(route.params);
    dispatch(fetchAppointments(USER, uid));
    setShowSuccessModal(true);
  };

  const onSuccessModalDismiss = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const { date, time } = appointmentUTCDateTime;

  const showPrivacyPolicy = () => {
    setShowTermsAndPrivacyModal(true);
  };

  return (
    <View style={styles.container}>
      <NavigationHeader
        title={"Checkout"/* UIText[language].scheduleAppointment */}
        navigation={navigation}
        language={language}
      />
      {/* <Text style={styles.headerText}>Checkout</Text> */}
      <View style={styles.cardLogos}>
        <Image
          style={styles.masterCardLogo}
          source={require("../../assets/images/masterCardLogo.png")} />
        <Image
          style={styles.visaLogo}
          source={require("../../assets/images/visaLogo.png")} />
      </View>

      <AppointmentCard
        style={{ marginTop: 35 }}
        appointmentId={''}
        localDateText={convertDateToText(date, language)}
        localTimeText={convertTimeToText(getAppointmentTime({ time }), language)}
        name={selectedConsultant.name}
        rating={selectedConsultant.rating}
        userType={USER}
        language={language}
        minimized
      />

     {/*  <View style={styles.inputContainer}>
        <Text>Full name: (on the card)</Text>
        <TextInput
          style={styles.textInputField}
          onChangeText={fullName => this.setState({ fullName })} />
      </View> */}

     {/*  <View style={styles.inputContainer}>
        <Text>Card number:</Text>
        <TextInput
          style={styles.textInputField}
          keyboardType={"number-pad"}
          maxLength={16}
          //value={this.state.cardNumber}
          onChangeText={cardNumber => this.setState({ cardNumber })} />
      </View> */}

      <Text style={styles.priceLabel}>
        {UIText[language].consultationPrice + ':\t'}
        <Text style={styles.price}>
          {selectedConsultant.pricePerCall +
            (selectedConsultant.pricePerCall % 1 === 0 ? '.00' : '') + ' '}USD
        </Text>
      </Text>

      <Text style={styles.noteLabel}>
        {UIText[language].paymentNote}
      </Text>

      <View style={styles.checkBoxContainer}>
        <CheckBox
          checked={userAgrees}
          onPress={() => setUserAgrees(!userAgrees)}
          fillColor={Colors.tintColor}
          checkMarkColor='#fff'
        />

        <Text style={styles.checkBoxLabel}>
          {UIText[language].iAgreeTo}
          <Text onPress={showPrivacyPolicy} style={{ color: Colors.tintColor }}>
            {' ' + UIText[language].privacyPolicy.toLowerCase()}
          </Text>
        </Text>
      </View>

      <PrimaryBtn
        label={UIText[language].pay}
        onPress={completePaymentsWithStripe}
        onLongPress={onPayBtnLongPress}
        iconName="ios-card"
        iconFamily={IONICONS}
        style={styles.payBtn}
        loading={loading}
      />

      <TermsAndPrivacyModal
        visible={showTermsAndPrivacyModal}
        requestClose={() => setShowTermsAndPrivacyModal(false)}
        showTermsOrPrivacy={'privacy'}
      />

      <DismissibleModal
        visible={showSuccessModal}
        okayBtnLabel={UIText[language].ok}
        onPressOk={onSuccessModalDismiss}
        dismiss={onSuccessModalDismiss}
        animateOnDismiss={false}>
        <View style={styles.successPopupContainer}>
          <CustomIcon
            iconFamily={FEATHER}
            name="check-circle"
            color={Colors.tintColor}
            size={90}
          />

          <Text style={styles.successMessage}>
            {UIText[language].appointmentScheduledSuccessfully}
          </Text>
        </View>
      </DismissibleModal>

      {messageDisplayer}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  payBtn: {
    position: 'absolute',
    bottom: '6%',
  },
  headerText: {
    color: "#425c5a",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 1
  },
  priceLabel: {
    marginVertical: 20,
    fontSize: 20,
    color: Colors.fadedTextColor,
    fontWeight: 'bold',
    paddingHorizontal: 30,
    width: '100%',
  },
  inputContainer: {
    marginTop: 19
  },
  textInputField: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#f9f8f8",
    marginTop: 10,
    color: "#425c5a",
    fontSize: 15,
    fontWeight: "700",
    paddingLeft: 7
  },
  price: {
    fontSize: 18,
    color: Colors.fadedTextColor,
    paddingHorizontal: 30,
    width: '100%',
    fontWeight: 'normal',
  },
  noteLabel: {
    marginVertical: 20,
    fontSize: 16,
    color: Colors.extraFadedTextColor,
    paddingHorizontal: 30,
    width: '100%',
  },
  checkBoxContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkBoxLabel: {
    marginTop: 1,
    fontSize: 16,
    color: Colors.grayTextColor,
    textAlign: 'center',
  },
  cardLogos: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  },
  masterCardLogo: {
    width: 37,
    height: 23
  },
  visaLogo: {
    width: 50,
    height: 16,
    marginLeft: 15
  },
  successPopupContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    marginVertical: 20,
    fontSize: 18,
    textAlign: 'center',
    color: Colors.grayTextColor,
  },
});

export default PaymentScreen;