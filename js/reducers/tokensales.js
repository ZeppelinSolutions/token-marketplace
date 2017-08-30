import React from 'react';
import * as ActionTypes from '../actiontypes'

const TokenSalesReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.VALID_TOKEN_SALE:
      return Object.assign({}, state, { valid: true, address: action.tokenSaleAddress })
    case ActionTypes.INVALID_TOKEN_SALE:
      return Object.assign({}, state, { valid: false, address: action.tokenSaleAddress })
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
