import React from 'react';
import * as ActionTypes from '../actiontypes'

const TransactionsReducer = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_TRANSACTIONS:
      return state;
    case ActionTypes.ADD_TRANSACTION:
      const transaction = { hash: action.transactionHash }
      return [transaction].concat(state);
    case ActionTypes.RECEIVE_TRANSACTION:
      return state.map(transaction => (transaction.hash === action.transaction.hash) ? action.transaction : transaction)
    default:
      return state
  }
};

export default TransactionsReducer;
