import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../Components/Header';
//import {Ionicons} from '@expo/vector-icons';

export default class AboutUs extends Component {
    constructor() {
        super();
    }

    render() {
        return (

            <View style={styles.container}>
                <StatusBar translucent />
               
                <View style={{ width: 40, height: 40, position: "absolute", top: 29, left: 25, zIndex: 999 }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name="ios-arrow-round-back" size={35} style={{}} color={'black'} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginTop: 50, alignItems: "center" }}>
                    <Text style={{ color: "#425c5a", fontWeight: "700", fontSize: 24 }}>Why us?</Text>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: 'white',
        paddingHorizontal: 25,
        paddingTop: 50
    },
});
