import BigNumber from 'bignumber.js'
import ErrorActions from './errors'
import AccountActions from './accounts'
import FetchingActions from './fetching'
import * as ActionTypes from '../actiontypes'
import { GAS } from '../constants'
import { ERC20, TokenSale, TokenSaleFactory } from '../contracts'
import toWei from '../helpers/toWei'
import fromWei from '../helpers/fromWei'
import toTokens from '../helpers/toTokens'
import fromTokens from '../helpers/fromTokens'

const TokenSaleActions = {

  findAll() {
    return async function(dispatch) {
      try {
        const factory = await TokenSaleFactory.deployed()
        const events = factory.TokenSaleCreated({}, { fromBlock: 1686385, toBlock: 'latest' });
        events.watch(function(error, result) {
          if(error) ErrorActions.show(error)
          else dispatch(TokenSaleActions.loadToList(result.args.tokenSaleAddress))
        })
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  find(tokenSaleAddress) {
    return async function(dispatch) {
      try {
        dispatch({ type: ActionTypes.FINDING_TOKEN_SALE })
        dispatch(FetchingActions.start('Loading token sale data'))
        const tokenSale = await TokenSale.at(tokenSaleAddress)
        dispatch(TokenSaleActions.load(tokenSale))
      } catch(error) {
        dispatch(ErrorActions.show(error, `There was an error trying to load given token sale contract at ${tokenSaleAddress}`))
      }
    }
  },

  create(erc20Address, seller, amount, pricePerTokenInEther) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('Creating your token sale contract'))
      try {
        const price = new BigNumber(pricePerTokenInEther).times(amount)
        const factory = await TokenSaleFactory.deployed()
        const transaction = await factory.createTokenSale(erc20Address, toWei(price), { from: seller, gas: GAS })
        const tokenSaleAddress = transaction.logs[0].args.tokenSaleAddress;

        dispatch(FetchingActions.start('Sending tokens to your token sale contract'))
        const erc20 = await ERC20.at(erc20Address)
        const decimals = await erc20.decimals()
        await erc20.transfer(tokenSaleAddress, toTokens(amount, decimals), { from: seller, gas: GAS })
        dispatch(AccountActions.updateEtherBalance(seller))
        dispatch(AccountActions.updateTokensBalance(seller, erc20Address))
        dispatch(TokenSaleActions.loadToList(tokenSaleAddress))
        dispatch(AccountActions.notifyContractDeployed(tokenSaleAddress))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  fulfill(tokenSaleAddress, purchaser) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('Fulfilling token sale contract'))
      try {
        const tokenSale = await TokenSale.at(tokenSaleAddress)
        const erc20Address = await tokenSale.token()
        const price = await tokenSale.priceInWei()
        await tokenSale.sendTransaction({ from: purchaser, value: price })
        dispatch(AccountActions.updateEtherBalance(purchaser))
        dispatch(AccountActions.updateTokensBalance(purchaser, erc20Address))
        dispatch(TokenSaleActions.load(tokenSale))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  refund(tokenSaleAddress, seller) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('Refunding your token sale contract'))
      try {
        const tokenSale = await TokenSale.at(tokenSaleAddress)
        const erc20Address = await tokenSale.token()
        await tokenSale.refund({ from: seller, gas: GAS })
        dispatch(AccountActions.updateEtherBalance(seller))
        dispatch(AccountActions.updateTokensBalance(seller, erc20Address))
        dispatch(TokenSaleActions.load(tokenSale))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  loadToList(tokenSaleAddress) {
    return async function(dispatch) {
      try {
        const tokenSale = await TokenSale.at(tokenSaleAddress)
        const information = await TokenSaleActions._buildTokenSaleInformation(tokenSale);
        dispatch(TokenSaleActions.add(information))
        if(information.closed) {
          dispatch(TokenSaleActions.loadRefundInformation(tokenSale, information, ActionTypes.ADD_TOKEN_SALE))
          dispatch(TokenSaleActions.loadPurchaserInformation(tokenSale, information, ActionTypes.ADD_TOKEN_SALE))
        }
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  load(tokenSale) {
    return async function(dispatch) {
      try {
        const information = await TokenSaleActions._buildTokenSaleInformation(tokenSale);
        dispatch(TokenSaleActions.receive(information))
        if(information.closed) {
          dispatch(TokenSaleActions.loadRefundInformation(tokenSale, information, ActionTypes.RECEIVE_TOKEN_SALE))
          dispatch(TokenSaleActions.loadPurchaserInformation(tokenSale, information, ActionTypes.RECEIVE_TOKEN_SALE))
        }
        dispatch(FetchingActions.stop())
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  loadPurchaserInformation(tokenSale, tokenSaleInformation, actionType) {
    return dispatch => {
      const events = tokenSale.TokenPurchased({}, { fromBlock: 0, toBlock: 'latest' });
      events.watch(function (error, result) {
        if (error) ErrorActions.show(error)
        else {
          tokenSaleInformation.purchaser = result.args.buyer
          tokenSaleInformation.amount = fromTokens(result.args.amount, tokenSaleInformation.tokenDecimals)
          tokenSaleInformation.transactionHash = result.transactionHash
          dispatch({ type: actionType, tokenSale: tokenSaleInformation })
        }
      })
    }
  },

  loadRefundInformation(tokenSale, tokenSaleInformation, actionType) {
    return dispatch => {
      const events = tokenSale.Refund({}, { fromBlock: 0, toBlock: 'latest' });
      events.watch(function (error, result) {
        if (error) ErrorActions.show(error)
        else {
          tokenSaleInformation.refunded = true
          tokenSaleInformation.amount = fromTokens(result.args.amount, tokenSaleInformation.tokenDecimals)
          tokenSaleInformation.transactionHash = result.transactionHash
          dispatch({ type: actionType, tokenSale: tokenSaleInformation })
        }
      })
    }
  },

  receive(tokenSale) {
    return { type: ActionTypes.RECEIVE_TOKEN_SALE, tokenSale }
  },

  add(tokenSale) {
    return { type: ActionTypes.ADD_TOKEN_SALE, tokenSale }
  },

  async _buildTokenSaleInformation(tokenSale) {
    const erc20Address = await tokenSale.token()
    const erc20 = await ERC20.at(erc20Address)
    const decimals = await erc20.decimals()
    return {
      tokenDecimals: decimals,
      tokenName: await erc20.name(),
      tokenSymbol: await erc20.symbol(),
      address: tokenSale.address,
      seller: await tokenSale.owner(),
      closed: await tokenSale.closed(),
      amount: fromTokens(await tokenSale.amount(), decimals),
      price: fromWei(await tokenSale.priceInWei()),
      tokenAddress: await tokenSale.token(),
    };
  },
}

export default TokenSaleActions
