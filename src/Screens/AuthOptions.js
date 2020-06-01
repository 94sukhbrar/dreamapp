/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Constants/Colors';

export default class HomeAuthScreen extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <View style={{ justifyContent: "center" }}>
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
          <Text style={styles.headerText}>Dream interpretation service</Text>
        </View>


        <View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SignUpOptions')}
            style={[styles.button, { backgroundColor: '#a2bfbd' }]}>
            <Text style={[styles.containerText, { color: '#ffffff' }]}>
              Create an account
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: '#f9f8f8', marginTop: 70},
            ]}>
            <Text style={[styles.containerText, {color: '#425c5a'}]}>
              Login as Consultant
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
            style={[
              styles.button,
              { backgroundColor: '#425c5a', marginTop: 70, marginBottom: 55 },
            ]}>
            <Text style={[styles.containerText, { color: '#ffcea2' }]}>
              Login
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
  header: {
    position: 'absolute',
    top: 30,
    width: '100%',
    alignSelf: 'center',
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
  headerText: {
    color: '#000000',
    fontSize: 30,
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
