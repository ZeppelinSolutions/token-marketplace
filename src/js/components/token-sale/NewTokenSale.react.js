import React from 'react';
import Store from '../../store'
import ERC20List from '../ERC20List.react'
import AccountActions from '../../actions/accounts'
import TokenSaleActions from '../../actions/tokensales'
import { withRouter } from 'react-router-dom'

class NewTokenSale extends React.Component {
  constructor(props){
    super(props)
    this.state = { account: {}, owner: '', token: '', amount: 0, price: 0 }
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
      <div ref="newTokenSale" className="row">
        <div className="col s12">
          <form className="card" onSubmit={this._handleSubmit}>
            <div className="card-content">
              <h3 className="title">Sell tokens</h3>
              <p>Please select the token you want to sell, or enter a token address manually below</p>
              <ERC20List selectERC20={this._selectERC20}/>
              <div className="row">
                <div className="input-field col s5">
                  <label className={this.state.token? 'active' : ''} htmlFor="token">Token</label>
                  <input onChange={this._updateToken} type="text" value={this.state.token} id="token" required/>
                </div>
                <div className="input-field col s3">
                  <label htmlFor="amount">Amount of tokens you want to sell</label>
                  <input onChange={this._updateAmount} type="number" id="amount" required/>
                </div>
                <div className="input-field col s4">
                  { tokens ? <p className="balance-notification">MTK balance: { tokens }</p> : '' }
                </div>
                <div className="input-field col s5">
                  <label className={this.state.owner? 'active' : ''} htmlFor="owner">Your account</label>
                  <input onChange={this._updateOwner} type="text" value={this.state.owner} id="owner" disabled required/>
                </div>
                <div className="input-field col s3">
                  <label htmlFor="price">Selling price per token</label>
                  <input onChange={this._updatePrice} type="number" id="price" required/>
                </div>
                <div className="input-field col s4">
                  <p className="balance-notification">ETH balance: { balance }</p>
                </div>
              </div>
            </div>
            <div className="card-action">
              <button className="btn btn-primary">Publish</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  _handleSubmit(e) {
    e.preventDefault()
    const state = this.state
    Store.dispatch(TokenSaleActions.create(state.token, state.owner, state.amount, state.price))
  }

  _selectERC20(erc20Address) {
    this.setState({ token: erc20Address })
    Store.dispatch(AccountActions.getTokenBalance(this.state.owner, erc20Address))
  }

  _updateToken(e) {
    e.preventDefault();
    this.setState({ token: e.target.value })
  }

  _updateOwner(e) {
    e.preventDefault();
    this.setState({ owner: e.target.value })
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
    if(this.refs.newTokenSale) {
      const state = Store.getState();
      this.setState({ account: state.account, owner: state.account.address });
      const deployedAddress = state.account.deployedAddress;
      if(deployedAddress) {
        this.props.history.push(`/token-sale/${deployedAddress}`)
        Store.dispatch(AccountActions.resetDeployedContract())
      }
    }
  }
}

export default withRouter(NewTokenSale)
