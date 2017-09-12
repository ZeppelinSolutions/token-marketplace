import ErrorActions from './errors'
import AccountActions from './accounts'
import FetchingActions from './fetching'
import * as ActionTypes from '../actiontypes'
import { GAS } from '../constants'
import { ERC20, TokenPurchase } from '../contracts'

const TokenPurchaseActions = {

  getTokenPurchase(tokenPurchaseAddress) {
    return async function(dispatch) {
      try {
        const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
        dispatch(TokenPurchaseActions.receiveTokenPurchase(tokenPurchase))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  create(erc20Address, buyer, amount, pricePerToken) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('creating your token purchase contract'))
      try {
        const price = pricePerToken * amount
        const erc20 = await ERC20.at(erc20Address)
        const tokenPurchase = await TokenPurchase.new(erc20.address, amount, { from: buyer, gas: GAS })
        dispatch(FetchingActions.start('sending ether to your token purchase contract'))
        await tokenPurchase.sendTransaction({ from: buyer, value: price, gas: GAS })
        dispatch(AccountActions.findAccount())
        dispatch(AccountActions.deployedNewContract(tokenPurchase.address))
        dispatch(FetchingActions.stop())
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  fulfill(tokenPurchaseAddress, seller) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('fulfilling token purchase contract'))
      try {
        const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
        const erc20Address = await tokenPurchase.token()
        const erc20 = await ERC20.at(erc20Address)
        const amount = await tokenPurchase.amount()
        dispatch(FetchingActions.start(`approving ${amount} tokens to the token purchase contract`))
        await erc20.approve(tokenPurchase.address, amount, {from: seller, gas: GAS})
        dispatch(FetchingActions.start('claiming your ether to the token purchase contract'))
        await tokenPurchase.claim({from: seller, gas: GAS})
        dispatch(AccountActions.updateAccountBalance(erc20Address))
        dispatch(TokenPurchaseActions.receiveTokenPurchase(tokenPurchase))
        dispatch(FetchingActions.stop())
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receiveTokenPurchase(tokenPurchase) {
    return async function(dispatch) {
      try {
        const erc20Address = await tokenPurchase.token()
        const erc20 = await ERC20.at(erc20Address)
        const tokenPurchaseInformation = {
          tokenName: erc20.name,
          tokenSymbol: erc20.symbol,
          address: tokenPurchase.address,
          buyer: await tokenPurchase.owner(),
          opened: await tokenPurchase.opened(),
          amount: (await tokenPurchase.amount()).toString(),
          price: (await tokenPurchase.priceInWei()).toString(),
          tokenAddress: await tokenPurchase.token(),
        }
        dispatch({ type: ActionTypes.RECEIVE_TOKEN_PURCHASE, tokenPurchase: tokenPurchaseInformation })
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },
}

export default TokenPurchaseActions
