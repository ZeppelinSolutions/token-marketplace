import ErrorActions from './errors'
import AccountActions from './accounts'
import FetchingActions from './fetching'
import * as ActionTypes from '../actiontypes'
import { GAS } from '../constants'
import { ERC20, TokenSale } from '../contracts'

const TokenSaleActions = {

  getTokenSale(tokenSaleAddress) {
    return async function(dispatch) {
      try {
        dispatch(FetchingActions.start('loading token sale data'))
        const tokenSale = await TokenSale.at(tokenSaleAddress)
        dispatch(TokenSaleActions.receiveTokenSale(tokenSale))
      } catch(error) {
        dispatch(ErrorActions.showError(error, `There was an error trying to load given token sale contract at ${tokenSaleAddress}`))
      }
    }
  },

  create(erc20Address, seller, amount, pricePerToken) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('creating your token sale contract'))
      try {
        const price = pricePerToken * amount
        const erc20 = await ERC20.at(erc20Address)
        const tokenSale = await TokenSale.new(erc20Address, price, {from: seller, gas: GAS})
        dispatch(FetchingActions.start('sending tokens to your token sale contract'))
        await erc20.transfer(tokenSale.address, amount, {from: seller, gas: GAS})
        dispatch(AccountActions.updateEtherBalance(seller))
        dispatch(AccountActions.updateTokensBalance(seller, erc20Address))
        dispatch(AccountActions.deployedNewContract(tokenSale.address))
        dispatch(FetchingActions.stop())
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  fulfill(tokenSaleAddress, buyer) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('fulfilling token sale contract'))
      try {
        const tokenSale = await TokenSale.at(tokenSaleAddress)
        const erc20Address = await tokenSale.token()
        const price = await tokenSale.priceInWei()
        await tokenSale.sendTransaction({from: buyer, value: price})
        dispatch(AccountActions.updateEtherBalance(buyer))
        dispatch(AccountActions.updateTokensBalance(buyer, erc20Address))
        dispatch(TokenSaleActions.receiveTokenSale(tokenSale))
        dispatch(FetchingActions.stop())
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receiveTokenSale(tokenSale) {
    return async function(dispatch) {
      try {
        const erc20Address = await tokenSale.token()
        const erc20 = await ERC20.at(erc20Address)
        const tokenSaleInformation = {
          tokenName: erc20.name,
          tokenSymbol: erc20.symbol,
          address: tokenSale.address,
          seller: await tokenSale.owner(),
          closed: await tokenSale.closed(),
          amount: (await tokenSale.amount()).toString(),
          price: (await tokenSale.priceInWei()).toString(),
          tokenAddress: await tokenSale.token(),
        }
        dispatch({ type: ActionTypes.RECEIVE_TOKEN_SALE, tokenSale: tokenSaleInformation })
        dispatch(FetchingActions.stop())
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },
}

export default TokenSaleActions
