import React from 'react'
import Store from '../../store'
import Account from '../Account.react'
import AccountActions from '../../actions/accounts'
import TokenPurchaseDetails from '../token-purchase/TokenPurchaseDetails.react'
import TokenPurchaseFulfill from '../token-purchase/TokenPurchaseFulfill.react'
import TokenPurchaseActions from '../../actions/tokenpurchases'

export default class ShowTokenPurchase extends React.Component {
  constructor(props){
    super(props)
    this.state = { fetching: true, tokenPurchase: {}, account: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findAccount())
    Store.dispatch(TokenPurchaseActions.getTokenPurchase(this.props.match.params.address))
  }

  render() {
    const undefinedAccount = typeof this.state.account.balance === 'undefined'
    const undefinedContract = typeof this.state.tokenPurchase.opened === 'undefined'
    const loading = this.state.fetching || undefinedContract || undefinedAccount
    return (
      <div ref="tokenPurchase">
        {loading ? '' :
        <div className="row">
          <Account account={this.state.account} col="s12"/>
          <TokenPurchaseDetails tokenPurchase={this.state.tokenPurchase} col="s12"/>
          <TokenPurchaseFulfill tokenPurchase={this.state.tokenPurchase} account={this.state.account} col="s12"/>
        </div>}
      </div>
    )
  }

  _onChange() {
    if(this.refs.tokenPurchase) {
      const state = Store.getState()
      this.setState({ fetching: state.fetching, tokenPurchase: state.tokenPurchase, account: state.account })
      if(state.tokenPurchase.tokenAddress && state.account.address && state.account.tokens === null)
        Store.dispatch(AccountActions.updateTokensBalance(state.account.address, state.tokenPurchase.tokenAddress))
    }
  }
}
