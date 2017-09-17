import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { address: '', etherBalance: 0, tokensBalance: null, deployedAddress: null };

const AccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ACCOUNT:
      return Object.assign({}, state, { address: action.address, tokens: null });
    case ActionTypes.RECEIVE_ETHER_BALANCE:
      return Object.assign({}, state, { etherBalance: action.etherBalance });
    case ActionTypes.RECEIVE_TOKEN_BALANCE:
      return Object.assign({}, state, { tokensBalance: action.tokensBalance });
    case ActionTypes.DEPLOYED_NEW_CONTRACT:
      return Object.assign({}, state, { deployedAddress: action.address });
    case ActionTypes.DEPLOYED_NEW_CONTRACT_RESET:
      return Object.assign({}, state, { deployedAddress: null });
    default:
      return state
  }
};

export default AccountsReducer;
