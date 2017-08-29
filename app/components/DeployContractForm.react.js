import React from 'react';
import ERC20List from './ERC20List.react'

export default class DeployContractForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenAddress: '', ownerAddress: '', amount: 0, price: 0 }
    this.buy = this.buy.bind(this)
    this.sell = this.sell.bind(this)
    this.selectERC20 = this.selectERC20.bind(this)
    this._updateToken = this._updateToken.bind(this)
    this._updateOwner = this._updateOwner.bind(this)
    this._updatePrice = this._updatePrice.bind(this)
    this._updateAmount = this._updateAmount.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ownerAddress: nextProps.coinbase.address })
  }

  sell(e) {
    e.preventDefault()
    const state = this.state
    this.props.publishTokenSale(state.tokenAddress, state.ownerAddress, state.amount, state.price)
  }

  buy(e) {
    e.preventDefault()
    const state = this.state
    this.props.publishTokenPurchase(state.tokenAddress, state.ownerAddress, state.amount, state.price)
  }

  selectERC20(erc20Address) {
    this.setState({ tokenAddress: erc20Address })
    this.props.showAccountTokens(this.state.ownerAddress, erc20Address)
  }

  render() {
    return (
      <form id="publish-contract">
        <h3>Sell/Buy some tokens</h3>
        <ERC20List selectERC20={this.selectERC20}/>
        <div className="form-group row">
          <label htmlFor="token-address" className="col-sm-3 col-form-label">Token (address)</label>
          <div className="col-sm-9"><input onChange={this._updateToken} value={this.state.tokenAddress} className="form-control" id="token-address" required/></div>
        </div>
        <div className="form-group row">
          <label htmlFor="owner-address" className="col-sm-3 col-form-label">You (address)</label>
          <div className="col-sm-9"><input onChange={this._updateOwner} value={this.state.ownerAddress} className="form-control" id="owner-address" required/></div>
        </div>
        <div className="form-group row">
          <label htmlFor="amount" className="col-sm-3 col-form-label">Amount (tokens)</label>
          <div className="col-sm-4"><input onChange={this._updateAmount} type="number" className="form-control" id="amount" required/></div>
        </div>
        <div className="form-group row">
          <label htmlFor="price" className="col-sm-3 col-form-label">Price (wei)</label>
          <div className="col-sm-4"><input onChange={this._updatePrice} type="number" className="form-control" id="price" required/></div>
        </div>
        <button id="sell" className="btn btn-primary" onClick={this.sell}>Sell</button>
        <button id="buy" className="btn btn-secondary" onClick={this.buy}>Buy</button>
      </form>
    );
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
}
