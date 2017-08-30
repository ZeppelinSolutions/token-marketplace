import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { connected: null }

const NetworkReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CONNECTION_FAILED:
      return Object.assign({}, state, { connected: false })
    case ActionTypes.CONNECTION_SUCCEEDED:
      return Object.assign({}, state, { connected: true })
    default:
      return state
  }
}

export default NetworkReducer
