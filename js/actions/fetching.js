import * as ActionTypes from '../actiontypes';

const FetchingActions = {
  start() {
    return { type: ActionTypes.START_FETCHING }
  },

  stop() {
    return { type: ActionTypes.STOP_FETCHING }
  },
}

export default FetchingActions
