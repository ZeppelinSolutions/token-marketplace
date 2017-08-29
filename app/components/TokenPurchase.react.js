import React from 'react';

export default class TokenPurchase extends React.Component {
  constructor(props){
    super(props)
    this.state = { sellerAddress: '', tokenPurchase: this.props.tokenPurchase }
    this.handleSubmit = this.handleSubmit.bind(this)
    this._updateSellerAddress = this._updateSellerAddress.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tokenPurchase: nextProps.tokenPurchase })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.apply(this.state.tokenPurchase.address, this.state.sellerAddress)
  }

  render() {
    const tokenPurchase = this.state.tokenPurchase;
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Apply token purchase</h3>
        <div>
          <p className="address"><span>{tokenPurchase.address}</span></p>
          <p className="tokens">Tokens <span>{tokenPurchase.amount}</span></p>
          <p className="price">Wei <span>{tokenPurchase.price}</span></p>
          <p className="opened">Opened <span>{tokenPurchase.closed}</span></p>
        </div>
        <div className="form-group row">
          <label htmlFor="contract-address" className="col-sm-3 col-form-label">Token Purchase (address)</label>
          <div className="col-sm-9"><input value={tokenPurchase.address} className="form-control" id="contract-address" disabled required/></div>
        </div>
        <div className="form-group row">
          <label htmlFor="seller-address" className="col-sm-3 col-form-label">You (address)</label>
          <div className="col-sm-9"><input value={this.state.sellerAddress} onChange={this._updateSellerAddress} className="form-control" id="seller-address" required/></div>
        </div>
        <button id="apply" className="btn btn-primary">Apply</button>
      </form>
    );
  }

  _updateSellerAddress(e) {
    e.preventDefault()
    this.setState({ sellerAddress: e.target.value })
  }
}
