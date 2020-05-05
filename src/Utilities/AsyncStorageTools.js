import AsyncStorage from '@react-native-community/async-storage';
import { tryStringify, tryParse } from './Tools';

/**
 * @description Retrieves the specified keys form AsyncStorage And Parses
 * the values if they are parsable.
 * @param {array} keys An Array of the AsyncStorage keys to be retrieved.
 * @returns An Array of the retrieved values parsed.
 */
export const retrieveItemsFromAsyncStorage = keys =>
  Promise.all(keys.map(key => retrieveItemFromAsyncStorage(key)));

/**
 * @description Retrieves the specified key form AsyncStorage And Parses
 * the value if it's parsable.
 * @param {string} key The AsyncStorage key to retrieved.
 * @returns the retrieved value parsed.
 */
export const retrieveItemFromAsyncStorage = async key =>
  tryParse(await AsyncStorage.getItem(key));

/**
 * @description Stores the specified items in AsyncStorage And stringifies
 * the values if they are not strings.
 * @param {array} items An Array of {key, value} objects representing the keys and the
 * values of the items that are to be stored.
 */
export const setItemsInAsyncStorage = items =>
  Promise.all(items.map(item => setItemInAsyncStorage(item)));

/**
 * @description Stores the specified item in AsyncStorage And stringifies
 * the value if it's not a string.
 * @param {object} item A {key, value} object representing the key and the
 * value of the item that is to be stored.
 */
export const setItemInAsyncStorage = ({key, value}) =>
  AsyncStorage.setItem(key, tryStringify(value));

/**
 * @description Removes the specified keys from AsyncStorage.
 * @param {array} keys An Array of the keys that are to be removed.
 */
export const removeItemsFromAsyncStorage = keys =>
  Promise.all(keys.map(key => removeItemFromAsyncStorage(key)));

/**
 * @description Removes the specified key from AsyncStorage.
 * @param {string} key The key that are to be removed.
 */
export const removeItemFromAsyncStorage = key =>
  AsyncStorage.removeItem(key);

/**
 * @description Retrieves the specified keys form AsyncStorage And Parses
 * the values if they are parsable And then removes the keys from asyncStorage.
 * @param {array} keys An Array of the AsyncStorage keys to be retrieved.
 * @returns An Array of the retrieved values parsed.
 */
export const retrieveItemsFromAsyncStorageAndRemoveThem = async keys => {
  const retrievedItems = await retrieveItemsFromAsyncStorage(keys);
  removeItemsFromAsyncStorage(keys);

  return retrievedItems;
};
