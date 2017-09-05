import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { found: false, tokenSale: null, tokenPurchase: null };

const SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SEARCH_NOT_FOUND:
      return Object.assign({}, state, { found: false })
    case ActionTypes.SEARCH_FOUND_TOKEN_SALE:
      return Object.assign({}, state, { tokenSale: action.tokenSale, found: true })
    case ActionTypes.SEARCH_FOUND_TOKEN_PURCHASE:
      return Object.assign({}, state, { tokenPurchase: action.tokenPurchase, found: true })
    case ActionTypes.SEARCH_RESET:
      return Object.assign({}, state, { tokenSale: null, tokenPurchase: null, found: false })
    default:
      return state
  }
};

export default SearchReducer;
