import React from 'react';
import * as ActionTypes from '../actiontypes'

const TokenPurchasesListReducer = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_TOKEN_PURCHASE:
      const tokenPurchase = action.tokenPurchase
      const existingTokenPurchase = state.find(contract => contract.address === tokenPurchase.address)
      return existingTokenPurchase ? state : [tokenPurchase].concat(state)
    default:
      return state
  }
};

export default TokenPurchasesListReducer;
