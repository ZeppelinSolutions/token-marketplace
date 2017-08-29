import React from 'react';
import Store from '../../store'
import ERC20List from './ERC20List.react'
import AccountActions from '../../actions/accounts'
import TokenSaleActions from '../../actions/tokensales'
import TokenPurchaseActions from '../../actions/tokenpurchases'

export default class BuySellForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { account: null, ownerAddress: '', tokenAddress: '', amount: 0, price: 0 }
    this._buy = this._buy.bind(this)
    this._sell = this._sell.bind(this)
    this._selectERC20 = this._selectERC20.bind(this)
    this._updateToken = this._updateToken.bind(this)
    this._updateOwner = this._updateOwner.bind(this)
    this._updatePrice = this._updatePrice.bind(this)
    this._updateAmount = this._updateAmount.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange());
    Store.dispatch(AccountActions.findAccount());
  }

  render() {
    const tokens = this.state.account ? this.state.account.tokens : '...'
    const balance = this.state.account ? this.state.account.balance : '...'
    return (
      <form id="publish-contract" ref="buySellForm">
        <h3>Sell/Buy some tokens</h3>
        <ERC20List selectERC20={this._selectERC20}/>
        <div className="form-group row">
          <label htmlFor="token-address" className="col-sm-3 col-form-label">Token (address)</label>
          <div className="col-sm-9"><input onChange={this._updateToken} value={this.state.tokenAddress} className="form-control" id="token-address" required/></div>
        </div>
        <div className="form-group row">
          <label htmlFor="owner-address" className="col-sm-3 col-form-label">You (address)</label>
          <div className="col-sm-9"><input onChange={this._updateOwner} value={this.state.ownerAddress} className="form-control" id="owner-address" disabled required/></div>
        </div>
        <div className="form-group row">
          <label htmlFor="amount" className="col-sm-3 col-form-label">Amount of tokens ({tokens} available)</label>
          <div className="col-sm-4"><input onChange={this._updateAmount} type="number" className="form-control" id="amount" required/></div>
        </div>
        <div className="form-group row">
          <label htmlFor="price" className="col-sm-3 col-form-label">Price in wei ({balance} available)</label>
          <div className="col-sm-4"><input onChange={this._updatePrice} type="number" className="form-control" id="price" required/></div>
        </div>
        <button id="sell" className="btn btn-primary" onClick={this._sell}>Sell</button>
        <button id="buy" className="btn btn-secondary" onClick={this._buy}>Buy</button>
      </form>
    );
  }

  _sell(e) {
    e.preventDefault()
    const state = this.state
    Store.dispatch(TokenSaleActions.publish(state.tokenAddress, state.ownerAddress, state.amount, state.price))
  }

  _buy(e) {
    e.preventDefault()
    const state = this.state
    Store.dispatch(TokenPurchaseActions.publish(state.tokenAddress, state.ownerAddress, state.amount, state.price))
  }

  _selectERC20(erc20Address) {
    this.setState({ tokenAddress: erc20Address })
    Store.dispatch(AccountActions.getTokenBalance(this.state.ownerAddress, erc20Address))
  }

  _updateToken(e) {
    e.preventDefault();
    this.setState({ tokenAddress: e.target.value })
  }

  _updateOwner(e) {
    e.preventDefault();
    this.setState({ ownerAddress: e.target.value })
  }

  _updatePrice(e) {
    e.preventDefault();
    this.setState({ price: e.target.value })
  }

  _updateAmount(e) {
    e.preventDefault();
    this.setState({ amount: e.target.value })
  }

  _onChange() {
    const state = Store.getState();
    if(this.refs.buySellForm && state.account !== this.state.account) {
      this.setState({ account: state.account, ownerAddress: state.account.address });
    }
  }
}
