import React from 'react';
import * as ActionTypes from '../actiontypes'

const ErrorsReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_ERROR:
      const error = action.error;
      return Object.assign({}, state, error);
    default:
      return state
  }
};

export default ErrorsReducer;
