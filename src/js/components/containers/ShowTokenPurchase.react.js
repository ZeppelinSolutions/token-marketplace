import React from 'react'
import Store from '../../store'
import Modal from '../Modal.react'
import Account from '../Account.react'
import AccountActions from '../../actions/accounts'
import TokenPurchaseDetails from '../token-purchase/TokenPurchaseDetails.react'
import TokenPurchaseFulfill from '../token-purchase/TokenPurchaseFulfill.react'
import TokenPurchaseActions from '../../actions/tokenpurchases'

export default class ShowTokenPurchase extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenPurchase: {}, account: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenPurchaseActions.getTokenPurchase(this.props.match.params.address))
  }

  render() {
    const undefinedAccount = typeof this.state.account.balance === 'undefined'
    const undefinedContract = typeof this.state.tokenPurchase.opened === 'undefined'
    const loading = undefinedContract || undefinedAccount
    return (
      <div ref="tokenPurchase" className="row">
        <Account account={this.state.account} col="s12"/>
        <TokenPurchaseDetails tokenPurchase={this.state.tokenPurchase} col="s12"/>
        <TokenPurchaseFulfill tokenPurchase={this.state.tokenPurchase} account={this.state.account} col="s12"/>
        <Modal open={loading} progressBar message={'Loading token purchase data...'}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.tokenPurchase) {
      const state = Store.getState()
      this.setState({ tokenPurchase: state.tokenPurchase, account: state.account })
      if(this.state.tokenPurchase.tokenAddress)
        Store.dispatch(AccountActions.findAccountFor(this.state.tokenPurchase.tokenAddress))
    }
  }
}
