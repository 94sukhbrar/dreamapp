import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Layout from '../Constants/Layout';

const useMessageDisplayer = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) {
      setShowMessage(false);
      return;
    }

    setShowMessage(true);

    const messageTimeToLive = message.length * 125;

    const timeout = setTimeout(() => {
      setShowMessage(false);
      setMessage('');
    }, messageTimeToLive);

    return () => clearTimeout(timeout);
  }, [message]);

  const messageDisplayer = showMessage ? (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  ) : null;

  return [messageDisplayer, setMessage];
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'absolute',
    height: Layout.screenHeight,
    width: Layout.screenWidth,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    backgroundColor: 'rgba(80, 80, 80, 0.65)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    position: 'absolute',
    bottom: '20%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default useMessageDisplayer;
