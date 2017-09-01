import $ from 'jquery'
import React from 'react'
import Store from '../../store'
import Modal from '../Modal.react'
import TokenPurchaseActions from '../../actions/tokenpurchases'

export default class TokenPurchaseForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { sellerAddress: '', tokenPurchase: {}, tokenPurchaseAddress: this.props.tokenPurchaseAddress }
    this._handleSubmit = this._handleSubmit.bind(this)
    this._updateSellerAddress = this._updateSellerAddress.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenPurchaseActions.getTokenPurchase(this.state.tokenPurchaseAddress))
    $('.chip').material_chip();
  }

  render() {
    const tokenPurchase = this.state.tokenPurchase;
    const loading = tokenPurchase === null || (typeof tokenPurchase.opened === 'undefined')
    return (
      <div ref="tokenPurchaseForm" className={"col " + this.props.col}>
        <form onSubmit={this._handleSubmit}>
          <div className="row valign-wrapper">
            <div className="col s10 valign"><h3>Apply token purchase</h3></div>
            <div className="col s2 valign">{tokenPurchase.opened ? <span className="chip green">Opened</span> : <span className="chip red">Closed</span> }</div>
          </div>
          <div>
            <p className="address">Address <span>{tokenPurchase.address}</span></p>
            <p className="buyer">Buyer <span>{tokenPurchase.buyer}</span></p>
            <p className="tokens">Tokens <span>{tokenPurchase.amount}</span></p>
            <p className="price">Wei <span>{tokenPurchase.price}</span></p>
            <p className="status">Status <span>{tokenPurchase.opened ? 'Opened' : 'Closed'}</span></p>
          </div>
          <div className="input-field">
            <label htmlFor="contract-address" className={tokenPurchase.address ? 'active' : ''}>Token Purchase (address)</label>
            <input value={tokenPurchase.address} type="text" id="contract-address" disabled required/>
          </div>
          <div className="input-field">
            <label htmlFor="seller-address">You (address)</label>
            <input value={this.state.sellerAddress} type="text" onChange={this._updateSellerAddress} id="seller-address" required/>
          </div>
          <button id="apply" disabled={!tokenPurchase.opened} className="btn btn-primary">Apply</button>
        </form>
        <Modal open={loading} progressBar message={'...loading token purchase data...'}/>
      </div>
    );
  }

  _handleSubmit(e) {
    e.preventDefault();
    Store.dispatch(TokenPurchaseActions.apply(this.state.tokenPurchase.address, this.state.sellerAddress))
  }

  _updateSellerAddress(e) {
    e.preventDefault()
    this.setState({ sellerAddress: e.target.value })
  }

  _onChange() {
    const state = Store.getState();
    if(this.refs.tokenPurchaseForm && state.tokenPurchase !== this.state.tokenPurchase) {
      this.setState({ tokenPurchase: state.tokenPurchase });
    }
  }
}
