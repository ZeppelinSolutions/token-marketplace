import React from 'react';
import * as ActionTypes from '../actiontypes'

const TokenSalesReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_TOKEN_SALE:
      return Object.assign({}, state, {
        address: action.tokenSale.address,
        seller: action.tokenSale.seller,
        amount: action.tokenSale.amount.toString(),
        price: action.tokenSale.price.toString(),
        closed: action.tokenSale.closed,
      })
    default:
      return state
  }
};

export default TokenSalesReducer;
