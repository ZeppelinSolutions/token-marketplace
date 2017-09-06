import ErrorActions from './errors'
import AccountActions from './accounts'
import FetchingActions from './fetching'
import TransactionActions from './transactions'
import * as ActionTypes from '../actiontypes'
import { GAS } from '../constants'
import { ERC20, TokenSale } from '../contracts'

const TokenSaleActions = {

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
      dispatch(FetchingActions.start('creating your token sale contract'))
      try {
        const erc20 = await ERC20.at(erc20Address)
        const tokenSale = await TokenSale.new(erc20Address, price, {from: seller, gas: GAS})
        dispatch(TransactionActions.addTransaction(tokenSale.transactionHash))

        dispatch(FetchingActions.start('sending tokens to your token sale contract'))
        const response = await erc20.transfer(tokenSale.address, amount, {from: seller, gas: GAS})
        dispatch(AccountActions.updateAccount(seller, erc20Address))
        dispatch(TransactionActions.addTransaction(response.tx))
        const contract = await TokenSaleActions._buildContractInformation(tokenSale)
        dispatch(AccountActions.deployedNewContract(contract.address))
        dispatch(FetchingActions.stop())
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  apply(tokenSaleAddress, buyer) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('applying token sale contract'))
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
        dispatch(FetchingActions.stop())
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receiveTokenSale(tokenSale) {
    return { type: ActionTypes.RECEIVE_TOKEN_SALE, tokenSale }
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
