import BigNumber from 'bignumber.js'
import ErrorActions from './errors'
import AccountActions from './accounts'
import FetchingActions from './fetching'
import * as ActionTypes from '../actiontypes'
import { GAS } from '../constants'
import { ERC20, TokenPurchase, TokenPurchaseFactory } from '../contracts'
import toWei from '../helpers/toWei'
import fromWei from '../helpers/fromWei'
import toTokens from '../helpers/toTokens'
import fromTokens from '../helpers/fromTokens'

const TokenPurchaseActions = {

  findAll() {
    return async function(dispatch) {
      try {
        const factory = await TokenPurchaseFactory.deployed()
        const events = factory.TokenPurchaseCreated({}, { fromBlock: 1686385, toBlock: 'latest' });
        events.watch(function(error, result) {
          if(error) ErrorActions.show(error)
          else dispatch(TokenPurchaseActions.loadToList(result.args.tokenPurchaseAddress))
        })
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  find(tokenPurchaseAddress) {
    return async function(dispatch) {
      try {
        dispatch({ type: ActionTypes.FINDING_TOKEN_PURCHASE })
        dispatch(FetchingActions.start('Loading token purchase data'))
        const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
        dispatch(TokenPurchaseActions.load(tokenPurchase))
      } catch(error) {
        dispatch(ErrorActions.show(error, `There was an error trying to load given token purchase contract at ${tokenPurchaseAddress}`))
      }
    }
  },

  create(erc20Address, purchaser, amount, pricePerTokenInEther) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('Creating your token purchase contract'))
      try {
        const erc20 = await ERC20.at(erc20Address)
        const decimals = await erc20.decimals()
        const factory = await TokenPurchaseFactory.deployed()
        const transaction = await factory.createTokenPurchase(erc20Address, toTokens(amount, decimals), { from: purchaser, gas: GAS })
        const tokenPurchaseAddress = transaction.logs[0].args.tokenPurchaseAddress;
        dispatch(FetchingActions.start('Sending ether to your token purchase contract'))
        const price = new BigNumber(pricePerTokenInEther).times(amount)
        const tokenSale = await TokenPurchase.at(tokenPurchaseAddress);
        await tokenSale.sendTransaction({ from: purchaser, value: toWei(price), gas: GAS })
        dispatch(AccountActions.updateEtherBalance(purchaser))
        dispatch(TokenPurchaseActions.loadToList(tokenPurchaseAddress))
        dispatch(AccountActions.notifyContractDeployed(tokenPurchaseAddress))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  fulfill(tokenPurchaseAddress, seller) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('Fulfilling token purchase contract'))
      try {
        const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
        const erc20Address = await tokenPurchase.token()
        const erc20 = await ERC20.at(erc20Address)
        const decimals = await erc20.decimals()
        const amount = await tokenPurchase.amount()
        dispatch(FetchingActions.start(`Approving ${toTokens(amount, decimals)} tokens to the token purchase contract`))
        await erc20.approve(tokenPurchase.address, toTokens(amount, decimals), { from: seller, gas: GAS })
        dispatch(FetchingActions.start('Claiming your ether to the token purchase contract'))
        await tokenPurchase.claim({ from: seller, gas: GAS })
        dispatch(AccountActions.updateEtherBalance(seller))
        dispatch(AccountActions.updateTokensBalance(seller, erc20Address))
        dispatch(TokenPurchaseActions.load(tokenPurchase))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  refund(tokenPurchaseAddress, purchaser) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('Refunding your token purchase contract'))
      try {
        const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
        const erc20Address = await tokenPurchase.token()
        await tokenPurchase.refund({ from: purchaser, gas: GAS })
        dispatch(AccountActions.updateEtherBalance(purchaser))
        dispatch(AccountActions.updateTokensBalance(purchaser, erc20Address))
        dispatch(TokenPurchaseActions.load(tokenPurchase))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  loadToList(tokenPurchaseAddress) {
    return async function(dispatch) {
      try {
        const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
        const information = await TokenPurchaseActions._buildTokenPurchaseInformation(tokenPurchase);
        dispatch(TokenPurchaseActions.add(information))
        if(information.closed) {
          dispatch(TokenPurchaseActions.loadRefundInformation(tokenPurchase, information, ActionTypes.ADD_TOKEN_PURCHASE))
          dispatch(TokenPurchaseActions.loadSellerInformation(tokenPurchase, information, ActionTypes.ADD_TOKEN_PURCHASE))
        }
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  load(tokenPurchase) {
    return async function(dispatch) {
      try {
        const information = await TokenPurchaseActions._buildTokenPurchaseInformation(tokenPurchase);
        dispatch(TokenPurchaseActions.receive(information))
        if(information.closed) {
          dispatch(TokenPurchaseActions.loadRefundInformation(tokenPurchase, information, ActionTypes.RECEIVE_TOKEN_PURCHASE))
          dispatch(TokenPurchaseActions.loadSellerInformation(tokenPurchase, information, ActionTypes.RECEIVE_TOKEN_PURCHASE))
        }
        dispatch(FetchingActions.stop())
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  loadSellerInformation(tokenPurchase, tokenPurchaseInformation, actionType) {
    return dispatch => {
      const events = tokenPurchase.TokenSold({}, { fromBlock: 0, toBlock: 'latest' });
      events.watch(function (error, result) {
        if (error) ErrorActions.show(error)
        else {
          tokenPurchaseInformation.price = fromWei(result.args.price)
          tokenPurchaseInformation.seller = result.args.seller
          tokenPurchaseInformation.transactionHash = result.transactionHash
          dispatch({ type: actionType, tokenPurchase: tokenPurchaseInformation })
        }
      })
    }
  },

  loadRefundInformation(tokenPurchase, tokenPurchaseInformation, actionType) {
    return dispatch => {
      const events = tokenPurchase.Refund({}, { fromBlock: 0, toBlock: 'latest' });
      events.watch(function (error, result) {
        if (error) ErrorActions.show(error)
        else {
          tokenPurchaseInformation.refunded = true
          tokenPurchaseInformation.price = fromWei(result.args.price)
          tokenPurchaseInformation.transactionHash = result.transactionHash
          dispatch({ type: actionType, tokenPurchase: tokenPurchaseInformation })
        }
      })
    }
  },

  receive(tokenPurchase) {
    return { type: ActionTypes.RECEIVE_TOKEN_PURCHASE, tokenPurchase }
  },

  add(tokenPurchase) {
    return { type: ActionTypes.ADD_TOKEN_PURCHASE, tokenPurchase }
  },

  async _buildTokenPurchaseInformation(tokenPurchase) {
    const erc20Address = await tokenPurchase.token()
    const erc20 = await ERC20.at(erc20Address)
    const decimals = await erc20.decimals()
    return {
      tokenDecimals: decimals,
      tokenName: await erc20.name(),
      tokenSymbol: await erc20.symbol(),
      address: tokenPurchase.address,
      closed: await tokenPurchase.closed(),
      purchaser: await tokenPurchase.owner(),
      amount: fromTokens(await tokenPurchase.amount(), decimals),
      price: fromWei(await tokenPurchase.priceInWei()),
      tokenAddress: await tokenPurchase.token(),
    }
  },
}

export default TokenPurchaseActions
