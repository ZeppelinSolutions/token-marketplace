import React from 'react';
import * as ActionTypes from '../actiontypes'

const ErrorsReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_ERROR:
      return action.error;
    case ActionTypes.RESET_ERROR:
      return null;
    default:
      return state
  }
};

export default ErrorsReducer;
