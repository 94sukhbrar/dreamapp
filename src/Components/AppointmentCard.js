import React from 'react';
import { 
  StyleSheet,
  View,
  Text,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../Constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import CardActionBtn from './CardActionBtn';
import Layout from '../Constants/Layout';
import UIText from '../Constants/UIText';
import { USER, CONSULTANT } from '../Constants/UserTypes';
import Rating from './Rating';
import { REQUESTED, DECLINED, ACCEPTED, MISSED, COMPLETED } from '../Constants/AppointmentStatusTypes';


const AppointmentCard = props => {
  const {
    language,
    appointmentId,
    localDateText,
    localTimeText,
    localAppointmentTime,
    localAppointmentDate,
    onPressCall,
    respond,
    status,
    name,
    rating,
    userType,
    minimized,
    style,
    charging,
  } = props;

  const dateAndTimeContainer = color => (
    <View style={styles.dateAndTimeContainer}>
      <Icon name='md-time' size={25} style={{ marginBottom: -4 }} color={color} />
      <Text style={[ styles.dateAndTimeText, {color} ]}>{localDateText}, {localTimeText}</Text>
    </View>
  );

  const acceptAndDeclineBtns = [
    <CardActionBtn
      key={0}
      backgroundColor={Colors.tintColor}
      labelColor={'#fff'}
      btnLabel={UIText[language].accept}
      onPress={() => respond(appointmentId, true)}
      disabled={charging}
    />,
    <CardActionBtn
      key={1}
      backgroundColor={Colors.secondaryElementsColor}
      labelColor={Colors.tintColor}
      btnLabel={UIText[language].decline}
      onPress={() => respond(appointmentId, false)}
    />,
  ];


  const showStatus = () => {
    const statusFontColor = [DECLINED, MISSED].includes(status) ? Colors.red : Colors.tintColor;

    let btnText = UIText[language][status.toLowerCase()];

    if (language === 'ar' && status === COMPLETED) {
      btnText = 'تم الإنتهاء'
    }

    return(
      <View style={styles.statusContainer}>
        <Text style={{color: statusFontColor, fontSize: 17, marginBottom: 2}}>
          {btnText}
        </Text>
        <Text style={{color: Colors.statusFontColor, fontSize: 13}}>{UIText[language].status}</Text>
      </View>
    );
  }

  let appointmentIsThisHour = false;

  if (!minimized) {
    const currentDate = new Date();
    const datesMatch = localAppointmentDate.localDate == currentDate.getDate();
    const hoursMatch = localAppointmentTime.localHour == currentDate.getHours();
    appointmentIsThisHour = datesMatch && hoursMatch;
  }

  const callNowBtnIsEnabled = userType === CONSULTANT || (status === ACCEPTED && appointmentIsThisHour);

  if (minimized) {
    return (
      <View style={[styles.container, {paddingHorizontal: '5%', paddingVertical: 20}, style]}>
        <Text style={styles.name}>{name}</Text>

        <Rating style={{marginBottom: 10}} rating={rating} language={language} />

        { dateAndTimeContainer(Colors.fadedTextColor) }
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        { userType == CONSULTANT && status == REQUESTED && (
          <Text style={{color: '#fff', minHeight: 22}}>{UIText[language].appointmentRequest}</Text>
        )}

        { dateAndTimeContainer('#fff') }

      </View>

      <View style={styles.body}>
        <View style={styles.nameAndRatingContainer}>
          <Text style={styles.name}>{name}</Text>

          <Rating rating={rating} language={language} />
        </View>

        <View style={styles.btnsAndStatusRow}>
          <CardActionBtn
            backgroundColor={Colors.tintColor}
            labelColor={'#fff'}
            iconName='md-call'
            btnLabel={UIText[language].startConsultation}
            onPress={() => onPressCall(appointmentId)}
            disabled={!callNowBtnIsEnabled}
          />

          {
            userType === USER || status !== REQUESTED
              ? showStatus() 
              : acceptAndDeclineBtns
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '92%',
    marginVertical: 10,
    backgroundColor: Colors.backgroundColor,
    borderRadius: Layout.appointmentCardBorderRadius,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    width: '100%',
    minHeight: 50,
    paddingVertical: 15,
    paddingHorizontal: '5%',
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    borderTopLeftRadius: Layout.appointmentCardBorderRadius,
    borderTopRightRadius: Layout.appointmentCardBorderRadius,
  },
  dateAndTimeContainer: {
    flexDirection: 'row',
  },
  dateAndTimeText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 18,
  },
  body: {
    backgroundColor: Colors.elementsColor,
    paddingHorizontal: '5%',
    borderBottomLeftRadius: Layout.appointmentCardBorderRadius,
    borderBottomRightRadius: Layout.appointmentCardBorderRadius,
  },
  nameAndRatingContainer: {
    minHeight: 50,
    paddingTop: 15,
  },
  name: {
    color: Colors.textColor,
    fontSize: 24,
    marginBottom: 5,
  },
  btnsAndStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 55,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '50%'
  }
});

AppointmentCard.propTypes = {
  language: PropTypes.string.isRequired,
  appointmentId: PropTypes.string.isRequired,
  localDateText: PropTypes.string.isRequired,
  localTimeText: PropTypes.string.isRequired,
  localAppointmentDate: PropTypes.object,
  localAppointmentTime: PropTypes.object,
  onPressCall: PropTypes.func,
  respond: PropTypes.func,
  status: PropTypes.string,
  name: PropTypes.string,
  rating: PropTypes.number,
  userType: PropTypes.string,
  minimized: PropTypes.bool,
  style: ViewPropTypes.style,
  charging: PropTypes.bool,
}

export default AppointmentCard;