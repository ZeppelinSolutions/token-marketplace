import Network from '../network'
import ErrorActions from './errors'
import { ERC20 } from '../contracts'
import * as ActionTypes from '../actiontypes'
import fromTokens from "../helpers/fromTokens";
import fromWei from "../helpers/fromWei";

const AccountActions = {
  findCurrent() {
    return async function(dispatch) {
      try {
        const addresses = await Network.getAccounts()
        const mainAddress = addresses[0]
        dispatch(AccountActions.receive(mainAddress))
        dispatch(AccountActions.updateEtherBalance(mainAddress))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateEtherBalance(address) {
    return async function(dispatch) {
      try {
        const balance = await Network.getBalance(address);
        const etherBalance = fromWei(balance);
        dispatch(AccountActions.receiveEtherBalance(etherBalance))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateTokensBalance(owner, erc20Address) {
    return async function(dispatch) {
      try {
        const erc20 = await ERC20.at(erc20Address)
        const tokens = await erc20.balanceOf(owner)
        const symbol = await erc20.symbol()
        const decimals = await erc20.decimals()
        // TODO: should I use fromTokens(tokens, decimals)
        const tokensBalance = { symbol: symbol, amount: tokens }
        dispatch(AccountActions.receiveTokenBalance(tokensBalance))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receive(address) {
    return { type: ActionTypes.RECEIVE_ACCOUNT, address }
  },

  notifyContractDeployed(address) {
    return { type: ActionTypes.DEPLOYED_NEW_CONTRACT, address }
  },

  resetContractDeployed() {
    return { type: ActionTypes.DEPLOYED_NEW_CONTRACT_RESET }
  },

  receiveEtherBalance(etherBalance) {
    return { type: ActionTypes.RECEIVE_ETHER_BALANCE, etherBalance }
  },

  receiveTokenBalance(tokensBalance) {
    return { type: ActionTypes.RECEIVE_TOKEN_BALANCE, tokensBalance }
  },
}

export default AccountActions
