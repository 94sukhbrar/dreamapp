import React from 'react';
import RootNavigator from './Navigation/RootNavigator';
import useInitializer from './Hooks/useInitializer';
import { View } from 'react-native';
import Colors from './Constants/Colors';
import { useSelector, shallowEqual } from 'react-redux';
import CallScreen from './Screens/CallScreen';

const App = () => {

  const {language, showCallScreen, currentCallData} = useSelector(state => ({
    language: state.language,
    showCallScreen: state.showCallScreen,
    currentCallData: state.currentCallData,
  }), shallowEqual);

  const loading = useInitializer();

  const layoutDirection = language === 'ar' ? 'rtl' : 'ltr';

  if (loading) return <View style={{flex: 1, backgroundColor: Colors.backgroundColor}} />;

  if (showCallScreen && currentCallData)
    return (
      <View style={{ direction: layoutDirection, flex: 1 }}>
        <CallScreen {...currentCallData} />
      </View>
    );

  return (
    <View style={{ direction: layoutDirection, flex: 1 }}>
      <RootNavigator />
    </View>
  );
};

export default App;


// import React, { Component } from "react";
// import { View, Image, Text, StyleSheet } from "react-native";
// import { BlurView } from "@react-native-community/blur";

// export default class Menu extends Component {

//   render() {
//     return (
//       <View style={styles.container}>
//         <Image
//           key={'blurryImage'}
//           source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/dream-43bb8.appspot.com/o/users%2F7QhKJrTcKHWZ5Ww0tjA41G8CNiw1?alt=media&token=07893d4a-cb3e-4cb8-bc02-c4c5b928cc26' }}
//           style={styles.absolute}
//         />
//         <Text style={styles.absolute}>Hi, I am some blurred text</Text>
// {/* in terms of positioning and zIndex-ing everything before the BlurView will be blurred */}
//         <BlurView
//           style={styles.absolute}
//           blurType="dark"
//           blurAmount={30}
//           reducedTransparencyFallbackColor="white"
//         />
//         <Text>I'm the non blurred text because I got rendered on top of the BlurView</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   absolute: {
//     // position: "absolute",
//     // top: 0,
//     // left: 0,
//     // bottom: 0,
//     // right: 0
//     flex: 1,
//   }
// });