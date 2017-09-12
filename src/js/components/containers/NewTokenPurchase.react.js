import React from 'react'
import Store from '../../store'
import Account from '../Account.react'
import AccountActions from '../../actions/accounts'
import TokenPurchaseForm from '../token-purchase/TokenPurchaseForm.react'

export default class NewTokenPurchase extends React.Component {
  constructor(props){
    super(props)
    this.state = { fetching: true, account: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findAccount())
  }

  render() {
    const undefinedAccount = typeof this.state.account.address === 'undefined'
    const loading = this.state.fetching || undefinedAccount
    return (
      <div ref="newTokenPurchase">
        {loading ? '' :
        <div className="row">
          <Account account={this.state.account} col="s12"/>
          <TokenPurchaseForm account={this.state.account} col="s12"/>
        </div>}
      </div>
    )
  }

  _onChange() {
    if(this.refs.newTokenPurchase) {
      const state = Store.getState()
      this.setState({ fetching: state.fetching, account: state.account })
      const deployedAddress = state.account.deployedAddress;
      if(deployedAddress) {
        this.props.history.push(`/token-purchase/${deployedAddress}`)
        Store.dispatch(AccountActions.resetDeployedContract())
      }
    }
  }
}
