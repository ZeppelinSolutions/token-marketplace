import React from 'react';
import * as ActionTypes from '../actiontypes'

const FetchingReducer = (state = false, action) => {
  switch (action.type) {
    case ActionTypes.START_FETCHING:
      return true
    case ActionTypes.STOP_FETCHING:
      return false
    default:
      return state
  }
};

export default FetchingReducer;
