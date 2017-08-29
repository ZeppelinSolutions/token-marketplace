import Network from '../network'
import { showError } from "../constants"

const AccountActions = {
  findAll() {
    return Network.getAccounts()
      .then(addresses => addresses.map(address => {
        return { address: address, balance: 0 }
      }))
      .catch(error => showError(error))
  },

  getBalance(address) {
    return Network.getBalance(address)
      .catch(error => showError(error))
  },
}

export default AccountActions
