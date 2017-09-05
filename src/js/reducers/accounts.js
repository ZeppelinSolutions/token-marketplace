import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { address: '', balance: 0, tokens: 0, deployedAddress: null };

const AccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ACCOUNT:
      return Object.assign({}, state, { address: action.address });
    case ActionTypes.RECEIVE_ETHER_BALANCE:
      return Object.assign({}, state, { balance: action.balance.toString() });
    case ActionTypes.RECEIVE_TOKEN_BALANCE:
      return Object.assign({}, state, { tokens: action.tokens.toString() });
    case ActionTypes.DEPLOYED_NEW_CONTRACT:
      return Object.assign({}, state, { deployedAddress: action.address });
    case ActionTypes.DEPLOYED_NEW_CONTRACT_RESET:
      return Object.assign({}, state, { deployedAddress: null });
    default:
      return state
  }
};

export default AccountsReducer;
