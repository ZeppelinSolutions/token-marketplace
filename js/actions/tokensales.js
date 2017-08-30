import ErrorActions from './errors'
import AccountActions from './accounts'
import TransactionActions from './transactions'
import * as ActionTypes from '../actiontypes'
import { GAS, showError } from '../constants'
import { ERC20, TokenSale } from '../contracts'
import Network from '../network'

const TokenSaleActions = {
  validate(address) {
    return async function(dispatch) {
      try {
        const existsContract = await Network.validateCode(address, TokenSale.unlinked_binary)
          existsContract ?
          dispatch(TokenSaleActions.tokenSaleValid(address)) :
          dispatch(TokenSaleActions.tokenSaleInvalid(address))
      } catch(error) {
        dispatch(TokenSaleActions.tokenSaleInvalid(address))
      }
    }
  },

  getTokenSale(tokenSaleAddress) {
    return async function(dispatch) {
      try {
        const tokenSale = await TokenSale.at(tokenSaleAddress)
        const contract = await TokenSaleActions._buildContractInformation(tokenSale)
        dispatch(TokenSaleActions.receiveTokenSale(contract))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  publish(erc20Address, seller, amount, price) {
    return async function(dispatch) {
      console.log(`Selling ${amount} tokens at ${erc20Address} from ${seller} by Wei ${price}`)
      try {
        const erc20 = await ERC20.at(erc20Address)
        const tokenSale = await TokenSale.new(erc20Address, price, {from: seller, gas: GAS})
        dispatch(TransactionActions.addTransaction(tokenSale.transactionHash))

        const response = await erc20.transfer(tokenSale.address, amount, {from: seller, gas: GAS})
        dispatch(AccountActions.updateAccount(seller, erc20Address))
        dispatch(TransactionActions.addTransaction(response.tx))
        const contract = await TokenSaleActions._buildContractInformation(tokenSale)
        dispatch(TokenSaleActions.receiveTokenSale(contract))
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  apply(tokenSaleAddress, buyer) {
    return async function(dispatch) {
      try {
        const tokenSale = await TokenSale.at(tokenSaleAddress)
        const erc20Address = await tokenSale.token()
        const price = await tokenSale.priceInWei()

        console.log(`Buying tokens from ${buyer} by Wei ${price}`)
        const response = await tokenSale.sendTransaction({from: buyer, value: price})
        dispatch(TransactionActions.addTransaction(response.tx))
        dispatch(AccountActions.updateAccount(buyer, erc20Address))
        const contract = await TokenSaleActions._buildContractInformation(tokenSale)
        dispatch(TokenSaleActions.receiveTokenSale(contract))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receiveTokenSale(tokenSale) {
    return { type: ActionTypes.RECEIVE_TOKEN_SALE, tokenSale }
  },

  tokenSaleValid(tokenSaleAddress) {
    return { type: ActionTypes.VALID_TOKEN_SALE, tokenSaleAddress }
  },

  tokenSaleInvalid(tokenSaleAddress) {
    return { type: ActionTypes.INVALID_TOKEN_SALE, tokenSaleAddress }
  },

  async _buildContractInformation(tokenSale) {
    return {
      address: tokenSale.address,
      seller: await tokenSale.owner(),
      amount: await tokenSale.amount(),
      price: await tokenSale.priceInWei(),
      closed: await tokenSale.closed(),
    }
  }
}

export default TokenSaleActions
