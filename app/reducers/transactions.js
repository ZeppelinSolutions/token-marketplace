import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { list: [], current: null };

const TransactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_TRANSACTIONS:
      return state;
    case ActionTypes.RECEIVE_TRANSACTION:
      return Object.assign({}, state, { current: action.transaction });
    case ActionTypes.RECEIVE_LAST_TRANSACTION:
      const lastTransaction = state.list[state.list.length - 1];
      return Object.assign({}, state, { current: lastTransaction });
    case ActionTypes.ADD_TRANSACTION:
      return Object.assign({}, state, { list: [action.transaction].concat(state.list) });
    default:
      return state
  }
};

export default TransactionsReducer;
