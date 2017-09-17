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
    this.state = { tokenSale: {}, account: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findCurrent())
    Store.dispatch(TokenSaleActions.find(this.props.match.params.address))
  }

  render() {
    const account = this.state.account
    const tokenSale = this.state.tokenSale
    const undefinedAccount = typeof account.etherBalance === 'undefined'
    const undefinedContract = typeof tokenSale.closed === 'undefined'
    const loading = undefinedContract || undefinedAccount

    return (
      <div ref="tokenSale">
        {loading ? '' :
        <div className="row">
          <Account account={account} col="s12"/>
          <TokenSaleDetails tokenSale={tokenSale} account={account} col="s12"/>
          {!tokenSale.closed ? <TokenSaleFulfill tokenSale={tokenSale} account={account} col="s12"/> : ''}
        </div>}
      </div>
    )
  }

  _onChange() {
    if(this.refs.tokenSale) {
      const state = Store.getState()
      this.setState({ tokenSale: state.tokenSale, account: state.account })
      if(state.tokenSale.tokenAddress && state.account.address && state.account.tokensBalance === null)
        Store.dispatch(AccountActions.updateTokensBalance(state.account.address, state.tokenSale.tokenAddress))
    }
  }
}
