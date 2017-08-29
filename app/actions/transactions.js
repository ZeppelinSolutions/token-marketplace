import Network from '../network'
import { showError } from "../constants"

const TransactionActions = {
  getData(txHash) {
    return Network.getTransaction(txHash).then(transaction => {
      return {
        hash: transaction.hash,
        nonce: transaction.nonce,
        blackHash: transaction.blockHash,
        blockNumber: transaction.blockNumber,
        gas: transaction.gas,
        transactionIndex: transaction.transactionIndex,
        from: transaction.from,
        to: transaction.to,
        value: (transaction.value ? transaction.value.toString() : null)
      }
    })
  }
};

export default TransactionActions
