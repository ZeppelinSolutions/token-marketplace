import React from 'react';
import thunkMiddleware from 'redux-thunk';
import error from './reducers/errors';
import account from './reducers/accounts';
import transactions from './reducers/transactions';
import tokenSale from './reducers/tokensales';
import tokenPurchase from './reducers/tokenpurchases';
import { createStore, combineReducers, applyMiddleware } from 'redux';

const mainReducer = combineReducers({
  error,
  account,
  transactions,
  tokenSale,
  tokenPurchase,
});

const Store = createStore (
  mainReducer,
  applyMiddleware(thunkMiddleware)
);

export default Store;
