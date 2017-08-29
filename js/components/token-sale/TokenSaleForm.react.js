import React from 'react'
import Store from '../../store'
import TokenSaleActions from '../../actions/tokensales'

export default class TokenSaleForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { buyerAddress: '', tokenSale: null, tokenSaleAddress: this.props.tokenSaleAddress }
    this._handleSubmit = this._handleSubmit.bind(this)
    this._updateBuyerAddress = this._updateBuyerAddress.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenSaleActions.getTokenSale(this.state.tokenSaleAddress))
  }

  render() {
    const tokenSale = this.state.tokenSale;
    return (
      <div ref="tokenSaleForm" className={"col " + this.props.col}>
        {(tokenSale === null) ?
          'Loading...' :
          <form onSubmit={this._handleSubmit}>
            <h3>Apply token sale</h3>
            <div>
              <p className="address">Address <span>{tokenSale.address}</span></p>
              <p className="seller">Seller <span>{tokenSale.seller}</span></p>
              <p className="tokens">Tokens <span>{tokenSale.amount}</span></p>
              <p className="price">Wei <span>{tokenSale.price}</span></p>
              <p className="status">Status <span>{tokenSale.closed ? 'Closed' : 'Opened'}</span></p>
            </div>
            <div className="input-field">
              <label htmlFor="contract-address" className={tokenSale.address ? 'active' : ''}>Token Sale (address)</label>
              <input value={tokenSale.address} type="text" id="contract-address" disabled required/>
            </div>
            <div className="input-field">
              <label htmlFor="buyer-address">You (address)</label>
              <input value={this.state.buyerAddress} type="text" onChange={this._updateBuyerAddress} id="buyer-address" required/>
            </div>
            <button id="apply" className="btn btn-primary">Apply</button>
          </form>
        }
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
