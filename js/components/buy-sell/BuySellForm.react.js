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
    Store.dispatch(AccountActions.resetDeployedContract());
  }

  render() {
    const tokens = this.state.account ? this.state.account.tokens : '...'
    const balance = this.state.account ? this.state.account.balance : '...'
    return (
      <form ref="buySellForm" className={"buy-sell-form col " + this.props.col} onSubmit={this._handleSubmit}>
        <h3>{this.props.action} some tokens</h3>
        <ERC20List selectERC20={this._selectERC20}/>
        <div className="row">
          <div className="input-field col s12">
            <label className={this.state.tokenAddress ? 'active' : ''} htmlFor="token-address">Token (address)</label>
            <input onChange={this._updateToken} type="text" value={this.state.tokenAddress} id="token-address" required/>
          </div>
          <div className="input-field col s12">
            <label className={this.state.ownerAddress ? 'active' : ''} htmlFor="owner-address">You (address)</label>
            <input onChange={this._updateOwner} type="text" value={this.state.ownerAddress} id="owner-address" disabled required/>
          </div>
          <div className="input-field col s6">
            <label htmlFor="amount">Amount of tokens ({tokens} available)</label>
            <input onChange={this._updateAmount} type="number" id="amount" required/>
          </div>
          <div className="input-field col s6">
            <label htmlFor="price">Price in wei ({balance} available)</label>
            <input onChange={this._updatePrice} type="number" id="price" required/>
          </div>
        </div>
        <div className="input-field row">
          <div className="col s1 offset-s10">
            <button className="btn btn-primary">Publish</button>
          </div>
        </div>
      </form>
    );
  }

  _handleSubmit(e) {
    e.preventDefault()
    const state = this.state
    const args = [state.tokenAddress, state.ownerAddress, state.amount, state.price]
    const contract = this.props.action === 'buy' ? TokenPurchaseActions : TokenSaleActions
    Store.dispatch(contract.publish(...args))
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
