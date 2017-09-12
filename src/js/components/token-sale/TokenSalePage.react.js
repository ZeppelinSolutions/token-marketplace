import React from 'react'
import Store from '../../store'
import Modal from '../Modal.react'
import TokenSaleDetails from './TokenSaleDetails.react'
import TokenSaleFulfill from './TokenSaleFulfill.react'
import TokenSaleActions from '../../actions/tokensales'
import AccountActions from "../../actions/accounts";

export default class TokenSalePage extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenSale: {}, fulfiller: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenSaleActions.getTokenSale(this.props.match.params.address))
  }

  render() {
    const undefinedContract = typeof this.state.tokenSale.closed === 'undefined'
    const undefinedFulfiller = typeof this.state.fulfiller.balance === 'undefined'
    const loading = undefinedContract || undefinedFulfiller
    return (
      <div ref="tokenSale" className="row">
        <TokenSaleDetails tokenSale={this.state.tokenSale} col="s12"/>
        <TokenSaleFulfill tokenSale={this.state.tokenSale} fulfiller={this.state.fulfiller} col="s12"/>
        <Modal open={loading} progressBar message={'Loading token sale data...'}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.tokenSale) {
      const state = Store.getState()
      this.setState({ tokenSale: state.tokenSale, fulfiller: state.account })
      if(this.state.tokenSale.tokenAddress)
        Store.dispatch(AccountActions.findAccountFor(this.state.tokenSale.tokenAddress))
    }
  }
}
