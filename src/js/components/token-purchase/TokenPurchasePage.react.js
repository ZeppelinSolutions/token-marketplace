import React from 'react'
import Store from '../../store'
import Modal from '../Modal.react'
import AccountActions from '../../actions/accounts'
import TokenPurchaseDetails from './TokenPurchaseDetails.react'
import TokenPurchaseFulfill from './TokenPurchaseFulfill.react'
import TokenPurchaseActions from '../../actions/tokenpurchases'

export default class TokenPurchasePage extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenPurchase: {}, fulfiller: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenPurchaseActions.getTokenPurchase(this.props.match.params.address))
  }

  render() {
    const undefinedContract = typeof this.state.tokenPurchase.opened === 'undefined'
    const undefinedFulfiller = typeof this.state.fulfiller.balance === 'undefined'
    const loading = undefinedContract || undefinedFulfiller
    return (
      <div ref="tokenPurchase" className="row">
        <TokenPurchaseDetails tokenPurchase={this.state.tokenPurchase} col="s12"/>
        <TokenPurchaseFulfill tokenPurchase={this.state.tokenPurchase} fulfiller={this.state.fulfiller} col="s12"/>
        <Modal open={loading} progressBar message={'Loading token purchase data...'}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.tokenPurchase) {
      const state = Store.getState()
      this.setState({ tokenPurchase: state.tokenPurchase, fulfiller: state.account })
      if(this.state.tokenPurchase.tokenAddress)
        Store.dispatch(AccountActions.findAccountFor(this.state.tokenPurchase.tokenAddress))
    }
  }
}
