import React from 'react';
import * as ActionTypes from '../actiontypes'

const TokenPurchasesReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_TOKEN_PURCHASE:
      return Object.assign({}, state, {
        address: action.tokenPurchase.address,
        buyer: action.tokenPurchase.buyer,
        amount: action.tokenPurchase.amount.toString(),
        price: action.tokenPurchase.price.toString(),
        opened: action.tokenPurchase.opened,
      })
    default:
      return state
  }
};

export default TokenPurchasesReducer;
