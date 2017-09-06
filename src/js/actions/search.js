import FetchingActions from './fetching'
import * as ActionTypes from '../actiontypes'
import { showError } from '../constants'
import { TokenPurchase, TokenSale } from '../contracts'

const SearchActions = {
  searchContract(address) {
    return async function(dispatch) {
      dispatch(FetchingActions.start('searching...'))
      try {
        // TODO: assume always it's a token sale till I know how to get contract class/type
        await TokenSale.at(address)
        dispatch(SearchActions.foundTokenSale(address))
        dispatch(FetchingActions.stop())
      } catch(error) {
        dispatch(SearchActions.notFound(address))
      }
    }
  },

  resetSearch() {
    return { type: ActionTypes.SEARCH_RESET }
  },

  notFound(address) {
    return { type: ActionTypes.SEARCH_NOT_FOUND, address }
  },

  foundTokenSale(tokenSale) {
    return { type: ActionTypes.SEARCH_FOUND_TOKEN_SALE, tokenSale }
  },

  foundTokenPurchase(tokenPurchase) {
    return { type: ActionTypes.SEARCH_FOUND_TOKEN_PURCHASE, tokenPurchase }
  },
}

export default SearchActions
