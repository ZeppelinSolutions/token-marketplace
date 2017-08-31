import React from 'react'
import thunkMiddleware from 'redux-thunk'
import error from './reducers/errors'
import search from './reducers/search'
import network from './reducers/network'
import fetching from './reducers/fetching'
import account from './reducers/accounts'
import tokenSale from './reducers/tokensales'
import transactions from './reducers/transactions'
import tokenPurchase from './reducers/tokenpurchases'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const mainReducer = combineReducers({
  error,
  search,
  network,
  account,
  fetching,
  transactions,
  tokenSale,
  tokenPurchase,
  tokenPurchase,
});

const Store = createStore (
  mainReducer,
  applyMiddleware(thunkMiddleware)
);

export default Store;
