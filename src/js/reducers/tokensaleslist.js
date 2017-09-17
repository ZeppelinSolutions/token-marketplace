import React from 'react';
import * as ActionTypes from '../actiontypes'

const TokenSalesListReducer = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_TOKEN_SALE:
      const tokenSale = action.tokenSale
      const existingTokenSale = state.find(contract => contract.address === tokenSale.address)
      return existingTokenSale ? state : [tokenSale].concat(state)
    default:
      return state
  }
};

export default TokenSalesListReducer;
