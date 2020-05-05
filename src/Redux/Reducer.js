import { convertReduxTypeToPropertyName, isTypeConvertible } from '../Utilities/Tools'
import { SET_USER_DATA } from './ActionTypes';
import initialState from './InitialState';

const reducer = (state = initialState, action) => {
  switch(action.type) {

    case SET_USER_DATA:
      return { ...state, ...action.payload };

    default:
      if (action.type && isTypeConvertible(action.type)) {
        const propertyName = convertReduxTypeToPropertyName(action.type);
        return { ...state, [propertyName]: action.payload };
      }
      return state
  }
}

export default reducer;