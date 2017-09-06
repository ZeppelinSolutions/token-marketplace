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
  }

  render() {
    const tokenPurchase = this.state.tokenPurchase;
    const loading = tokenPurchase === null || (typeof tokenPurchase.opened === 'undefined')
    return (
      <div ref="tokenPurchaseForm" className={"col " + this.props.col}>
        <form className="card" onSubmit={this._handleSubmit}>
          <div className="card-content">
            <div className="row valign-wrapper">
              <div className="col s10 valign"><h3 className="title">Apply token purchase</h3></div>
              <div className="col s2 valign">{tokenPurchase.opened ? <span className="chip opened-chip">Opened</span> : <span className="chip closed-chip">Closed</span> }</div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <label className="active">Token Purchase (address)</label>
                <p className="labeled">{tokenPurchase.address}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Amount (tokens)</label>
                <p className="labeled">{tokenPurchase.amount}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Price (wei)</label>
                <p className="labeled">{tokenPurchase.price}</p>
              </div>
              <div className="input-field col s6">
                <label className="active">Buyer (address)</label>
                <p className="labeled">{tokenPurchase.buyer}</p>
              </div>
              <div className="input-field col s6">
                <label htmlFor="buyer-address">You (address)</label>
                <input value={this.state.sellerAddress} type="text" onChange={this._updateSellerAddress} id="seller-address" required/>
              </div>
            </div>
          </div>
          <div className="card-action">
            <div className="row">
              <div className="col s1 offset-s10">
                <button disabled={!tokenPurchase.opened} className="btn btn-primary">Apply</button>
              </div>
            </div>
          </div>
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
