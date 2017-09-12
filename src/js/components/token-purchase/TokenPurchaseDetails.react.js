import React from 'react'
import { Link } from 'react-router-dom'

export default class TokenPurchaseDetails extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenPurchase: this.props.tokenPurchase, loading: this.props.loading }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tokenPurchase: nextProps.tokenPurchase, loading: nextProps.loading })
  }

  render() {
    const tokenPurchase = this.state.tokenPurchase;
    const status = tokenPurchase.opened ? 'open' : 'closed'
    return (
      <div ref="tokenPurchaseDetails" className={"col " + this.props.col}>
        {this.state.loading ? 'Loading...' :
        <div className="card">
          <div className="card-content">
            <div className="row valign-wrapper">
              <div className="col s10 valign"><h3 className="title">{tokenPurchase.tokenSymbol} token purchase</h3></div>
              <div className="col s2 valign"><span className={`chip ${status}-chip`}>{status}</span></div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <label className="active">Token Purchase</label>
                <p className="labeled">{tokenPurchase.address}</p>
              </div>
              <div className="input-field col s6">
                <label className="active">Buyer</label>
                <p className="labeled">{tokenPurchase.buyer}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Requested amount of tokens</label>
                <p className="labeled">{tokenPurchase.amount}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Wei you will get</label>
                <p className="labeled">{tokenPurchase.price}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Token Name</label>
                <p className="labeled">{tokenPurchase.tokenName}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Token Symbol</label>
                <p className="labeled">{tokenPurchase.tokenSymbol}</p>
              </div>
              <div className="input-field col s12">
                <label className="active">Sharing Link</label>
                <p className="labeled">
                  <Link to={`/token-purchase/${tokenPurchase.address}`}>{window.location.origin}/token-purchase/{tokenPurchase.address}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
