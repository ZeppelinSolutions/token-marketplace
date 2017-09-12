import React from 'react'
import Store from '../../store'
import Account from '../Account.react'
import TokenSaleDetails from '../token-sale/TokenSaleDetails.react'
import TokenSaleFulfill from '../token-sale/TokenSaleFulfill.react'
import TokenSaleActions from '../../actions/tokensales'
import AccountActions from "../../actions/accounts";

export default class ShowTokenSale extends React.Component {
  constructor(props){
    super(props)
    this.state = { fetching: true, tokenSale: {}, account: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findAccount())
    Store.dispatch(TokenSaleActions.getTokenSale(this.props.match.params.address))
  }

  render() {
    const undefinedAccount = typeof this.state.account.balance === 'undefined'
    const undefinedContract = typeof this.state.tokenSale.closed === 'undefined'
    const loading = this.state.fetching || undefinedContract || undefinedAccount
    return (
      <div ref="tokenSale">
        {loading ? '' :
        <div className="row">
          <Account account={this.state.account} col="s12"/>
          <TokenSaleDetails tokenSale={this.state.tokenSale} col="s12"/>
          <TokenSaleFulfill tokenSale={this.state.tokenSale} account={this.state.account} col="s12"/>
        </div>}
      </div>
    )
  }

  _onChange() {
    if(this.refs.tokenSale) {
      const state = Store.getState()
      this.setState({ fetching: state.fetching, tokenSale: state.tokenSale, account: state.account })
      if(state.tokenSale.tokenAddress && state.account.address && state.account.tokens === null)
        Store.dispatch(AccountActions.updateTokensBalance(state.account.address, state.tokenSale.tokenAddress))
    }
  }
}
