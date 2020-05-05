import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';


const KeyboardDismissor = ({children, backgroundColor}) => (
  <ScrollView
    style={{flex: 1, backgroundColor}}
    keyboardShouldPersistTaps='handled'
    contentContainerStyle={{flexGrow: 1}}
    scrollEnabled={false}
    showsVerticalScrollIndicator={false}
  >
    { children }
  </ScrollView>
);

KeyboardDismissor.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
}

export default KeyboardDismissor;