import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';

const ReduxProvider = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)

export default ReduxProvider;