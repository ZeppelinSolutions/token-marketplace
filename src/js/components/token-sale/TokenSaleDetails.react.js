import React from 'react'
import Store from '../../store'
import { Link } from 'react-router-dom'
import TokenSaleActions from '../../actions/tokensales'
import contractStatusToString from '../../helpers/contractStatusToString'

export default class TokenSaleDetails extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenSale: this.props.tokenSale }
    this._refund = this._refund.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tokenSale: nextProps.tokenSale, account: nextProps.account })
  }

  render() {
    const account = this.state.account || {}
    const tokenSale = this.state.tokenSale
    const status = contractStatusToString(tokenSale)
    const isOwner = tokenSale.seller === account.address
    return (
      <div ref="tokenSaleDetails" className={"col " + this.props.col}>
        <div className="card">
          <div className="card-content">
            <div className="row valign-wrapper">
              <div className="col s10 valign"><h3 className="title">{tokenSale.tokenSymbol} token sale</h3></div>
              <div className="col s2 valign"><span className={`chip ${status}-chip`}>{status}</span></div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <label className="active">Token Sale</label>
                <p className="labeled">{tokenSale.address}</p>
              </div>
              <div className="input-field col s6">
                <label className="active">Seller</label>
                <p className="labeled">{tokenSale.seller}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Selling amount of tokens</label>
                <p className="labeled">{tokenSale.amount.toString()}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Total Ether you are willing to pay</label>
                <p className="labeled">{tokenSale.price.toString()}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Token Name</label>
                <p className="labeled">{tokenSale.tokenName}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Token Symbol</label>
                <p className="labeled">{tokenSale.tokenSymbol}</p>
              </div>
              <div className="input-field col s12">
                <label className="active">Sharing Link</label>
                <p className="labeled">
                  <Link to={`/token-sale/${tokenSale.address}`}>{window.location.origin}/token-sale/{tokenSale.address}</Link>
                </p>
              </div>
            </div>
          </div>
          { isOwner ?
            <div className="card-action">
              <button className="btn btn-alert" disabled={tokenSale.closed} onClick={this._refund}>Refund</button>
            </div>
            : ''
          }
        </div>
      </div>
    );
  }

  _refund(e) {
    e.preventDefault()
    const tokenSale = this.state.tokenSale;
    Store.dispatch(TokenSaleActions.refund(tokenSale.address, tokenSale.seller))
  }
}
