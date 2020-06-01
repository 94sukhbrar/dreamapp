/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import RoundImage from './RoundImage';
import UIText from '../Constants/UIText';
import Layout from '../Constants/Layout';
import {translateDigitsToArabicIfLanguageIsArabic} from '../Utilities/DateAndTimeTools';
import Rating from './Rating';
import CardActionBtn from './CardActionBtn';
import {round} from '../Utilities/Tools';
import TwoBtnRow from './TwoBtnRow';

const elementsMarginVertical = 4;

const ConsultantCard = ({
  navigation,
  language,
  photoUrl,
  name,
  rating,
  pricePerCall,
  bio,
  selectedId,
  onPress,
  id,
  email,
  reviewingAccount,
  viewingPaymentDue,
  paymentDue,
  resetPaymentDue,
  onRespond,
  style,
}) => {
  const acceptAndDeclineBtnsContainer = (
    <TwoBtnRow
      style={{marginTop: 15, marginBottom: 5}}
      firstBtnLabel={UIText[language].accept}
      onFirstBtnPress={() => onRespond(id, true)}
      secondBtnLabel={UIText[language].decline}
      onSecondBtnPress={() => onRespond(id, false)}
    />
  );

  const scheduleAppointmentLayout = (
    <View style={styles.scheduleAppointmentLayoutContainer}>
      <RoundImage
        style={{marginVertical: elementsMarginVertical}}
        uri={photoUrl}
        size={65}
      />
      <View style={{marginLeft: 5, flex: 1}}>
        <Text style={[styles.name, {color: Colors.textColor}]}>{name}</Text>

        <Text style={[styles.bodyText]}>{bio}</Text>
        <Rating
          size={22}
          rating={rating}
          language={language}
          style={styles.ratingContainer}
        />
      </View>

      <Text style={[styles.price, {color: Colors.fadedTextColor}]}>
        ${translateDigitsToArabicIfLanguageIsArabic(pricePerCall, language)} /{' '}
        {UIText[language].call}
      </Text>
    </View>
  );

  const dashboardLayout = (
    <View style={styles.dashboardLayoutContainer}>
      <View style={styles.imageNameAndPriceContainer}>
        <View style={styles.imageContainer}>
          <RoundImage
            style={{marginVertical: elementsMarginVertical}}
            uri={photoUrl}
            size={65}
          />
        </View>

        <View style={styles.nameAndPriceContainer}>
          <Text style={[styles.name, {color: Colors.textColor}]}>{name}</Text>

          <Text style={[styles.price, {color: Colors.fadedTextColor}]}>
            ${translateDigitsToArabicIfLanguageIsArabic(pricePerCall, language)}{' '}
            / {UIText[language].call}
          </Text>
        </View>
      </View>

      {reviewingAccount && (
        <>
          <Text
            selectable
            style={[
              styles.bodyText,
              {textAlign: 'left', paddingHorizontal: 10, marginTop: 15},
            ]}>
            Email: {email}
          </Text>

          <Text
            style={[
              styles.bodyText,
              {textAlign: 'left', paddingHorizontal: 10},
            ]}>
            {bio}
          </Text>

          <Rating
            size={22}
            rating={rating}
            language={language}
            style={styles.ratingContainer}
          />

          {acceptAndDeclineBtnsContainer}
        </>
      )}

      {viewingPaymentDue && (
        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            selectable
            style={[
              styles.bodyText,
              {textAlign: 'left', paddingHorizontal: 10},
            ]}>
            {UIText[language].paymentDue}: ${round(paymentDue, 1)}
          </Text>

          <CardActionBtn
            style={{paddingHorizontal: 20, marginHorizontal: 10}}
            backgroundColor={Colors.tintColor}
            labelColor={'#fff'}
            btnLabel={UIText[language].paymentCompleted}
            onPress={() => resetPaymentDue(id)}
            disabled={false}
          />
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={[styles.container, {borderWidth: selectedId == id ? 1 : 0}, style]}
      disabled={!onPress}
      onPress={() => {
        console.log('navigation: ', navigation);
        navigation.navigate('ConsultantInfo', {consultantID: id});
      }}
      /* onPress={() => {
    onPress && onPress(id);
  }} */
    >
      {reviewingAccount || viewingPaymentDue
        ? dashboardLayout
        : scheduleAppointmentLayout}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    //height: Layout.consultantCardsHeight,
    flex: 1,
    width: '95%',
    marginHorizontal: 8,
    marginTop: 10,
    borderRadius: 5,
    borderColor: Colors.tintColor,
    backgroundColor: Colors.elementsColor,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 4,
  },
  scheduleAppointmentLayoutContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
  },
  dashboardLayoutContainer: {
    width: '100%',
    padding: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: elementsMarginVertical,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 14,
    color: Colors.grayTextColor,
    marginVertical: elementsMarginVertical,
    textAlign: 'center',
    minHeight: '10%',
    maxHeight: 115,
    overflow: 'hidden',
    paddingHorizontal: 2,
  },
  price: {
    textAlign: 'center',
    marginVertical: elementsMarginVertical,
  },
  ratingContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: elementsMarginVertical,
    minHeight: 22,
  },
  imageNameAndPriceContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: '5%',
  },
  nameAndPriceContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: '20%',
  },
  btnsRow: {
    marginTop: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 55,
  },
});

ConsultantCard.propTypes = {
  language: PropTypes.string,
  photoUrl: PropTypes.string,
  name: PropTypes.string,
  rating: PropTypes.number,
  pricePerCall: PropTypes.number,
  bio: PropTypes.string,
  selectedId: PropTypes.string,
  onPress: PropTypes.func,
  id: PropTypes.string,
  email: PropTypes.string,
  reviewingAccount: PropTypes.bool,
  viewingPaymentDue: PropTypes.bool,
  paymentDue: PropTypes.number,
  resetPaymentDue: PropTypes.func,
  style: ViewPropTypes.style,
};

export default ConsultantCard;
