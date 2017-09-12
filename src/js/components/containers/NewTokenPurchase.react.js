import React from 'react'
import Store from '../../store'
import Modal from '../Modal.react'
import Account from '../Account.react'
import AccountActions from '../../actions/accounts'
import TokenPurchaseForm from '../token-purchase/TokenPurchaseForm.react'

export default class NewTokenPurchase extends React.Component {
  constructor(props){
    super(props)
    this.state = { account: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findAccount())
  }

  render() {
    const undefinedAccount = typeof this.state.account.address === 'undefined'
    return (
      <div ref="newTokenPurchase" className="row">
        <Account account={this.state.account} col="s12"/>
        <TokenPurchaseForm account={this.state.account} col="s12"/>
        <Modal open={undefinedAccount} progressBar message={'Loading account data...'}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.newTokenPurchase) {
      const state = Store.getState()
      this.setState({ account: state.account })
      const deployedAddress = state.account.deployedAddress;
      if(deployedAddress) {
        this.props.history.push(`/token-purchase/${deployedAddress}`)
        Store.dispatch(AccountActions.resetDeployedContract())
      }
    }
  }
}