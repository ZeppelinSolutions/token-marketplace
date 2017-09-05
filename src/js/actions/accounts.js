import Network from '../network'
import ErrorActions from './errors'
import { ERC20 } from '../contracts'
import * as ActionTypes from '../actiontypes'

const AccountActions = {
  findAccount() {
    return async function(dispatch) {
      try {
        const addresses = await Network.getAccounts()
        const mainAddress = addresses[0]
        dispatch(AccountActions.receiveAccount(mainAddress))
        dispatch(AccountActions.getEtherBalance(mainAddress))

      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  updateAccount(address, erc20Address) {
    return dispatch => {
      dispatch(AccountActions.getEtherBalance(address))
      dispatch(AccountActions.getTokenBalance(address, erc20Address))
    }
  },

  getEtherBalance(address) {
    return async function(dispatch) {
      try {
        const balance = await Network.getBalance(address);
        dispatch(AccountActions.receiveEtherBalance(balance))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  getTokenBalance(owner, erc20Address) {
    return async function(dispatch) {
      try {
        const erc20 = await ERC20.at(erc20Address)
        const tokens = await erc20.balanceOf(owner)
        dispatch(AccountActions.receiveTokenBalance(tokens))
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receiveAccount(address) {
    return { type: ActionTypes.RECEIVE_ACCOUNT, address }
  },

  deployedNewContract(address) {
    return { type: ActionTypes.DEPLOYED_NEW_CONTRACT, address }
  },

  resetDeployedContract() {
    return { type: ActionTypes.DEPLOYED_NEW_CONTRACT_RESET }
  },

  receiveEtherBalance(balance) {
    return { type: ActionTypes.RECEIVE_ETHER_BALANCE, balance }
  },

  receiveTokenBalance(tokens) {
    return { type: ActionTypes.RECEIVE_TOKEN_BALANCE, tokens }
  }
}

export default AccountActions
