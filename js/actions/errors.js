import FetchingActions from './fetching'
import * as ActionTypes from '../actiontypes';

const ErrorActions = {
  showError(error) {
    return dispatch => {
      dispatch({ type: ActionTypes.SHOW_ERROR, error })
      dispatch(FetchingActions.stop())
    }
  },
}

export default ErrorActions
