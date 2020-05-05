import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from './Reducer';
import { currentSessionState } from './InitialState';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [...Object.keys(currentSessionState), 'paymentMethod'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
