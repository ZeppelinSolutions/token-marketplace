import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { searching: false, found: false, tokenSale: null, tokenPurchase: null, address: null };

const SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.START_SEARCHING:
      return Object.assign({}, state, { searching: true, address: action.address, found: false })
    case ActionTypes.SEARCH_NOT_FOUND:
      return Object.assign({}, state, { searching: false, address: action.address, found: false })
    case ActionTypes.SEARCH_FOUND_TOKEN_SALE:
      return Object.assign({}, state, { searching: false, tokenSale: action.tokenSale, found: true })
    case ActionTypes.SEARCH_FOUND_TOKEN_PURCHASE:
      return Object.assign({}, state, { searching: false, tokenPurchase: action.tokenPurchase, found: true })
    default:
      return state
  }
};

export default SearchReducer;
