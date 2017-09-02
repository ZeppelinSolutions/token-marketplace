import $ from 'jquery'
import React from 'react'
import Store from '../../store'
import Modal from '../Modal.react'
import TokenSaleActions from '../../actions/tokensales'

export default class TokenSaleForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { buyerAddress: '', tokenSale: {}, tokenSaleAddress: this.props.tokenSaleAddress }
    this._handleSubmit = this._handleSubmit.bind(this)
    this._updateBuyerAddress = this._updateBuyerAddress.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenSaleActions.getTokenSale(this.state.tokenSaleAddress))
  }

  render() {
    const tokenSale = this.state.tokenSale;
    const loading = tokenSale === null || (typeof tokenSale.closed === 'undefined')
    return (
      <div ref="tokenSaleForm" className={"col " + this.props.col}>
        <form onSubmit={this._handleSubmit}>
          <div className="row valign-wrapper">
            <div className="col s10 valign"><h3>Apply token sale</h3></div>
            <div className="col s2 valign">{tokenSale.closed ? <span className="chip red">Closed</span> : <span className="chip green">Opened</span>}</div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <label htmlFor="contract-address" className={tokenSale.address ? 'active' : ''}>Token Sale (address)</label>
              <input value={tokenSale.address} type="text" id="contract-address" disabled required/>
            </div>
            <div className="input-field col s6">
              <label htmlFor="seller-address" className={tokenSale.seller ? 'active' : ''}>Seller (address)</label>
              <input value={tokenSale.seller} type="text" id="seller-address" disabled/>
            </div>
            <div className="input-field col s6">
              <label htmlFor="amount" className={tokenSale.amount ? 'active' : ''}>Amount (tokens)</label>
              <input value={tokenSale.amount} type="number" id="amount" disabled/>
            </div>
            <div className="input-field col s6">
              <label htmlFor="price" className={tokenSale.price ? 'active' : ''}>Price (wei)</label>
              <input value={tokenSale.price} type="text" id="price" disabled/>
            </div>
            <div className="input-field col s12">
              <label htmlFor="buyer-address">You (address)</label>
              <input value={this.state.buyerAddress} type="text" onChange={this._updateBuyerAddress} id="buyer-address" required/>
            </div>
          </div>
          <div className="input-field row">
            <div className="col s1 offset-s10">
              <button disabled={tokenSale.closed} className="btn btn-primary">Apply</button>
            </div>
          </div>
        </form>
        <Modal open={loading} progressBar message={'...loading token sale data...'}/>
      </div>
    )
  }

  _handleSubmit(e) {
    e.preventDefault()
    Store.dispatch(TokenSaleActions.apply(this.state.tokenSale.address, this.state.buyerAddress))
  }

  _updateBuyerAddress(e) {
    e.preventDefault()
    this.setState({ buyerAddress: e.target.value })
  }

  _onChange() {
    const state = Store.getState();
    if(this.refs.tokenSaleForm && state.tokenSale !== this.state.tokenSale) {
      this.setState({ tokenSale: state.tokenSale });
    }
  }
}
