/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
//import {Ionicons} from '@expo/vector-icons';

export default class SignUpConsultantScreen3 extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log('DidMount succesfully reg: ', this.props);
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Image
            style={styles.logo}
            source={require('../../assets/images/dreamLogo.png')}
          />

          <Text style={[styles.headerText, {fontWeight: '300', marginTop: 39}]}>
            As Salamo Alikum
          </Text>
          <Text style={[styles.headerText, {fontWeight: '700'}]}>
            Ahmed Abdulaziz
          </Text>

          <View style={styles.informationContainer}>
            <Image
              style={styles.informationIcon}
              source={require('../../assets/images/aboutMeIcon.png')}
            />
            {this.props.route.params.user === 'CONSULTANT' ? (
              <Text style={styles.informationMessage}>
                Your profile is under review and can't sell your services for
                the moment. We will send you our response in 24 hours to your
                email address.
              </Text>
            ) : (
              <Text style={styles.informationMessage}>
                Uspesna registracija!
              </Text>
            )}

            {this.props.route.params.user === 'CONSULTANT' ? (
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreButtonText}>Read more</Text>
                {/* <View style={{position: 'absolute', right: 15}}>
                  <Ionicons
                    name="ios-arrow-round-forward"
                    size={25}
                    color="#ffffff"
                  />
                </View> */}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Main')}
          style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore our app</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    justifyContent: 'space-between',
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#425c5a',
  },
  informationContainer: {
    alignItems: 'center',
  },
  informationIcon: {
    width: 65,
    height: 60,
    marginTop: 10,
    marginLeft: 5,
  },
  informationMessage: {
    paddingHorizontal: 15,
    textAlign: 'center',
  },
  readMoreButton: {
    width: 177,
    height: 39,
    backgroundColor: '#425c5a',
    borderRadius: 5,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  readMoreButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  exploreButton: {
    height: 60,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#425c5a',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 45,
  },
  exploreButtonText: {
    color: '#ffcea2',
    fontWeight: '600',
    fontSize: 20,
  },
});
