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
        <form className="card" onSubmit={this._handleSubmit}>
          <div className="card-content">
            <div className="row valign-wrapper">
              <div className="col s10 valign"><h3 className="title">Apply token sale</h3></div>
              <div className="col s2 valign">{tokenSale.closed ? <span className="chip red">Closed</span> : <span className="chip green">Opened</span>}</div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <label className="active">Token Sale (address)</label>
                <p>{tokenSale.address}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Amount (tokens)</label>
                <p>{tokenSale.amount}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Price (wei)</label>
                <p>{tokenSale.price}</p>
              </div>
              <div className="input-field col s6">
                <label className="active">Seller (address)</label>
                <p>{tokenSale.seller}</p>
              </div>
              <div className="input-field col s6">
                <label htmlFor="buyer-address">You (address)</label>
                <input value={this.state.buyerAddress} type="text" onChange={this._updateBuyerAddress} id="buyer-address" required/>
              </div>
            </div>
          </div>
          <div className="card-action">
            <div className="row">
              <div className="col s1 offset-s10">
                <button disabled={tokenSale.closed} className="btn btn-primary">Apply</button>
              </div>
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
