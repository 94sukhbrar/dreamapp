import React from 'react';
import { View,  ActivityIndicator, StyleSheet } from 'react-native';
import propTypes from 'prop-types';

const SmallLoadingOverlay = ({visible}) => {
 if (!visible) return <View />;
  return (
    <View style={styles.container}>
        <ActivityIndicator size='small' color={'rgb(240,240,240)'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

SmallLoadingOverlay.prototype = {
  visible: propTypes.bool.isRequired,
}

export default SmallLoadingOverlay;