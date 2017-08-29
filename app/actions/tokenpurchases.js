import ErrorActions from './errors'
import AccountActions from './accounts'
import TransactionActions from './transactions'
import * as ActionTypes from '../actiontypes'
import { GAS } from "../constants"
import { ERC20, TokenPurchase } from "../contracts"

const TokenPurchaseActions = {
  getTokenPurchase(tokenPurchaseAddress) {
    return async function(dispatch) {
      try {
        const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
        const contract = await TokenPurchaseActions._buildContractInformation(tokenPurchase)
        dispatch(TokenPurchaseActions.receiveTokenPurchase(contract))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  publish(erc20Address, buyer, amount, price) {
    return async function(dispatch) {
      console.log(`Buying ${amount} tokens from ${buyer} by Wei ${price}`);
      try {
        const erc20 = await ERC20.at(erc20Address)
        const tokenPurchase = await TokenPurchase.new(erc20.address, amount, { from: buyer, gas: GAS })
        dispatch(TransactionActions.addTransaction(tokenPurchase.transactionHash));

        const response = await tokenPurchase.sendTransaction({ from: buyer, value: price, gas: GAS })
        dispatch(TransactionActions.addTransaction(response.tx));
        dispatch(AccountActions.updateAccount(buyer, erc20Address));
        const contract = await TokenPurchaseActions._buildContractInformation(tokenPurchase)
        dispatch(TokenPurchaseActions.receiveTokenPurchase(contract))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  apply(tokenPurchaseAddress, seller) {
    return async function(dispatch) {
      console.log(`Seller ${seller} applying to purchase ${tokenPurchaseAddress}`);
      try {
        const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
        const erc20Address = await tokenPurchase.token()
        const erc20 = await ERC20.at(erc20Address)
        const amount = await tokenPurchase.amount()
        const approval = await erc20.approve(tokenPurchase.address, amount, {from: seller, gas: GAS})
        dispatch(TransactionActions.addTransaction(approval.tx));

        const response = await tokenPurchase.claim({from: seller, gas: GAS})
        dispatch(AccountActions.updateAccount(seller, erc20Address))
        dispatch(TransactionActions.addTransaction(response.tx))
        const contract = await TokenPurchaseActions._buildContractInformation(tokenPurchase)
        dispatch(TokenPurchaseActions.receiveTokenPurchase(contract))
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receiveTokenPurchase(tokenPurchase) {
    return { type: ActionTypes.RECEIVE_TOKEN_PURCHASE, tokenPurchase }
  },

  async _buildContractInformation(tokenPurchase) {
    return {
      address: tokenPurchase.address,
      buyer: await tokenPurchase.owner(),
      amount: await tokenPurchase.amount(),
      price: await tokenPurchase.priceInWei(),
      opened: await tokenPurchase.opened(),
    }
  }
}

export default TokenPurchaseActions
