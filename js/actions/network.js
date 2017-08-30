import Network from '../network'
import * as ActionTypes from '../actiontypes'

const NetworkActions = {
  checkConnection() {
    return dispatch => {
      Network.web3().isConnected() ?
        dispatch(NetworkActions.connectionSucceeded()) :
        dispatch(NetworkActions.connectionFailed())
    }
  },

  connectionSucceeded() {
    return { type: ActionTypes.CONNECTION_SUCCEEDED }
  },

  connectionFailed() {
    return { type: ActionTypes.CONNECTION_FAILED }
  }
}

export default NetworkActions
