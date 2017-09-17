import React from 'react';
import * as ActionTypes from '../actiontypes'

const TokenPurchasesReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.FINDING_TOKEN_PURCHASE:
      return {}
    case ActionTypes.RECEIVE_TOKEN_PURCHASE:
      return Object.assign({}, state, action.tokenPurchase)
    default:
      return state
  }
};

export default TokenPurchasesReducer;
