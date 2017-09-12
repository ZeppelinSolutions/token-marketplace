import React from 'react';
import * as ActionTypes from '../actiontypes'

const TokenSalesReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_TOKEN_SALE:
      return Object.assign({}, state, action.tokenSale)
    default:
      return state
  }
};

export default TokenSalesReducer;
