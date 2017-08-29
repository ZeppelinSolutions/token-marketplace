import React from 'react';

export default class TokenSale extends React.Component {
  constructor(props){
    super(props)
    this.state = { buyerAddress: '', tokenSale: this.props.tokenSale }
    this.handleSubmit = this.handleSubmit.bind(this)
    this._updateBuyerAddress = this._updateBuyerAddress.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tokenSale: nextProps.tokenSale })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.apply(this.state.tokenSale.address, this.state.buyerAddress)
  }

  render() {
    const tokenSale = this.state.tokenSale;
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Apply token sale</h3>
        <div>
          <p className="address"><span>{tokenSale.address}</span></p>
          <p className="tokens">Tokens <span>{tokenSale.amount.toString()}</span></p>
          <p className="price">Wei <span>{tokenSale.price.toString()}</span></p>
          <p className="closed">Closed <span>{tokenSale.closed}</span></p>
        </div>
        <div className="form-group row">
          <label htmlFor="contract-address" className="col-sm-3 col-form-label">Token Sale (address)</label>
          <div className="col-sm-9"><input value={tokenSale.address} className="form-control" id="contract-address" disabled required/></div>
        </div>
        <div className="form-group row">
          <label htmlFor="buyer-address" className="col-sm-3 col-form-label">You (address)</label>
          <div className="col-sm-9"><input value={this.state.buyerAddress} onChange={this._updateBuyerAddress} className="form-control" id="buyer-address" required/></div>
        </div>
        <button id="apply" className="btn btn-primary">Apply</button>
      </form>
    );
  }

  _updateBuyerAddress(e) {
    e.preventDefault()
    this.setState({ buyerAddress: e.target.value })
  }
}
