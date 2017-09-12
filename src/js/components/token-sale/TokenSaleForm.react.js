import React from 'react';
import Store from '../../store'
import ERC20List from '../ERC20List.react'
import AccountActions from '../../actions/accounts'
import TokenSaleActions from '../../actions/tokensales'

export default class TokenSaleForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { account: {}, token: '', amount: 0, price: 0 }
    this._selectERC20 = this._selectERC20.bind(this)
    this._updateToken = this._updateToken.bind(this)
    this._updatePrice = this._updatePrice.bind(this)
    this._updateAmount = this._updateAmount.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ account: nextProps.account })
  }

  render() {
    return (
      <div ref="tokenSaleForm" className="row">
        <div className="col s12">
          <form className="card" onSubmit={this._handleSubmit}>
            <div className="card-content">
              <h3 className="title">Sell tokens</h3>
              <p>Please enter a token address manually or select the token you want to sell</p>
              <div className="row">
                <div className="input-field col s6">
                  <label className={this.state.token ? 'active' : ''}>Token</label>
                  <input onChange={this._updateToken} type="text" value={this.state.token} required/>
                </div>
                <ERC20List selectERC20={this._selectERC20} col="s6"/>
              </div>
              <div className="row">
                <div className="input-field col s3">
                  <label>Amount of tokens you want to sell</label>
                  <input onChange={this._updateAmount} type="number" required/>
                </div>
                <div className="input-field col s3">
                  <label>WEI price per token</label>
                  <input onChange={this._updatePrice} type="number" required/>
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
    Store.dispatch(TokenSaleActions.create(state.token, state.account.address, state.amount, state.price))
  }

  _selectERC20(erc20Address) {
    this.setState({ token: erc20Address })
    Store.dispatch(AccountActions.getTokenBalance(this.state.account.address, erc20Address))
  }

  _updateToken(e) {
    e.preventDefault();
    this.setState({ token: e.target.value })
  }

  _updatePrice(e) {
    e.preventDefault();
    this.setState({ price: e.target.value })
  }

  _updateAmount(e) {
    e.preventDefault();
    this.setState({ amount: e.target.value })
  }
}
