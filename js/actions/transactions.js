import Network from '../network'
import ErrorActions from './errors'
import * as ActionTypes from '../actiontypes'

const TransactionActions = {
  getTransactions() {
    return dispatch => dispatch({ type: ActionTypes.RECEIVE_TRANSACTIONS })
  },

  getLastTransaction() {
    return dispatch => dispatch({ type: ActionTypes.RECEIVE_LAST_TRANSACTION })
  },

  addTransaction(transaction) {
    return dispatch => {
      dispatch({ type: ActionTypes.ADD_TRANSACTION, transaction })
      dispatch(TransactionActions.receiveTransaction(transaction))
    }
  },

  getData(txHash) {
    return async function(dispatch) {
      try {
        const transaction = await Network.getTransaction(txHash)
        dispatch(TransactionActions.receiveTransaction({
          hash: transaction.hash,
          nonce: transaction.nonce,
          blackHash: transaction.blockHash,
          blockNumber: transaction.blockNumber,
          gas: transaction.gas,
          transactionIndex: transaction.transactionIndex,
          from: transaction.from,
          to: transaction.to,
          value: (transaction.value ? transaction.value.toString() : null)
        }))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receiveTransaction(transaction) {
    return { type: ActionTypes.RECEIVE_TRANSACTION, transaction }
  },
};

export default TransactionActions
