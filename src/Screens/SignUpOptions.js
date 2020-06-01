/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';

export default class SignUpOptions extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />



        <View style={styles.header}>
          <View
            style={{
              justifyContent: 'center',
              marginTop: 30,
            }}>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.backButtonTouch}>
                <Icon
                  //style={{ transform: [{ scaleX: language == 'ar' ? -1 : 1 }] }}
                  name={'ios-arrow-back'}
                  size={33}
                  color={Colors.grayTextColor}
                />
              </TouchableOpacity>
            </View>
            <Image
              style={styles.logo}
              source={require('../../assets/images/dreamLogo.png')}
            />
          </View>

          <Text style={styles.headerText}>How would you like to register?</Text>
        </View>

        <View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('SignUp', { userType: 'CONSULTANT' })
            }
            style={[styles.button, { backgroundColor: '#f9f8f8' }]}>
            <Text style={[styles.containerText, { color: '#425c5a' }]}>
              Register as Consultant
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('SignUp', { userType: 'USER' })
            }
            style={[
              styles.button,
              { backgroundColor: '#425c5a', marginTop: 32, marginBottom: 150 },
            ]}>
            <Text style={[styles.containerText, { color: '#ffcea2' }]}>
              Register as Client
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 29,
    justifyContent: 'flex-end',
  },
  backButtonContainer: {
    width: 30,
    height: 40,
    position: 'absolute',
    left: 0,
  },
  backButtonTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignSelf: 'center',
  },
  headerText: {
    color: '#000000',
    fontSize: 25,
    fontWeight: '700',
    marginTop: 35,
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  containerText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
