import React from 'react';
import Store from '../../store'
import ERC20List from './ERC20List.react'
import AccountActions from '../../actions/accounts'
import TokenSaleActions from '../../actions/tokensales'
import TokenPurchaseActions from '../../actions/tokenpurchases'

export default class BuySellForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { account: {}, ownerAddress: '', tokenAddress: '', amount: 0, price: 0 }
    this._selectERC20 = this._selectERC20.bind(this)
    this._updateToken = this._updateToken.bind(this)
    this._updateOwner = this._updateOwner.bind(this)
    this._updatePrice = this._updatePrice.bind(this)
    this._updateAmount = this._updateAmount.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange());
    Store.dispatch(AccountActions.findAccount());
  }

  render() {
    const tokens = this.state.account.tokens
    const balance = this.state.account.balance || '...'
    return (
      <div ref="buySellForm" className={"col " + this.props.col}>
        <form className="card" onSubmit={this._handleSubmit}>
          <div className="card-content">
            <h3 className="title">{this.props.action} tokens</h3>
            <p>Please select the token you want to {this.props.action}</p>
            <ERC20List selectERC20={this._selectERC20}/>
            <div className="row">
              <div className="input-field col s5">
                <label className={this.state.tokenAddress ? 'active' : ''} htmlFor="token-address">Token (address)</label>
                <input onChange={this._updateToken} type="text" value={this.state.tokenAddress} id="token-address" required/>
              </div>
              <div className="input-field col s3">
                <label htmlFor="amount">Amount (tokens)</label>
                <input onChange={this._updateAmount} type="number" id="amount" required/>
              </div>
              <div className="input-field col s4">
                { tokens ? <p className="balance-notification">Your balance: { tokens }</p> : '' }
              </div>
              <div className="input-field col s5">
                <label className={this.state.ownerAddress ? 'active' : ''} htmlFor="owner-address">You (address)</label>
                <input onChange={this._updateOwner} type="text" value={this.state.ownerAddress} id="owner-address" disabled required/>
              </div>
              <div className="input-field col s3">
                <label htmlFor="price">Price (wei)</label>
                <input onChange={this._updatePrice} type="number" id="price" required/>
              </div>
              <div className="input-field col s4">
                <p className="balance-notification">Your balance: { balance }</p>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button className="btn btn-primary">Publish</button>
          </div>
        </form>
      </div>
    )
  }

  _handleSubmit(e) {
    e.preventDefault()
    const state = this.state
    const args = [state.tokenAddress, state.ownerAddress, state.amount, state.price]
    const contract = this.props.action === 'buy' ? TokenPurchaseActions : TokenSaleActions
    Store.dispatch(contract.create(...args))
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
    if(this.refs.buySellForm) {
      this.setState({ account: state.account, ownerAddress: state.account.address });
    }
  }
}
