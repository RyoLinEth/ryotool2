import { createStore } from 'redux';

const initialState = {
  publicAddress: null,
  value: null,
};

const SET_PUBLIC_ADDRESS = 'SET_PUBLIC_ADDRESS';
const SET_VALUE = 'SET_VALUE';

function walletReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PUBLIC_ADDRESS:
      return { ...state, publicAddress: action.publicAddress };
    case SET_VALUE:
      return { ...state, value: action.value };
    default:
      return state;
  }
}

const store = createStore(walletReducer);

export function setPublicAddress(publicAddress) {
  return {
    type: SET_PUBLIC_ADDRESS,
    publicAddress,
  };
}

export function setValue(value) {
  return {
    type: SET_VALUE,
    value,
  };
}
