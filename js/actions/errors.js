import * as ActionTypes from '../actiontypes';

const ErrorActions = {
  showError(error) {
    console.error(error);
    return { type: ActionTypes.SHOW_ERROR, error }
  },
}

export default ErrorActions
