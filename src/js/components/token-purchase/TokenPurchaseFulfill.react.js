import React from 'react'
import Store from '../../store'
import TokenPurchaseActions from '../../actions/tokenpurchases'

export default class TokenPurchaseFulfill extends React.Component {
  constructor(props){
    super(props)
    this.state = { account: this.props.account, tokenPurchase: this.props.tokenPurchase }
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ account: nextProps.account, tokenPurchase: nextProps.tokenPurchase })
  }

  render() {
    return (
      <div ref="tokenPurchaseFulfill" className={"col " + this.props.col}>
        <form className="card" onSubmit={this._handleSubmit}>
          <div className="card-content">
            <h3 className="title">Fulfill contract</h3>
            <div className="row">{this._buildFulfillDescription()}</div>
          </div>
          <div className="card-action">
            <button disabled={this._notEnoughTokens()} className="btn btn-primary">Fulfill</button>
          </div>
        </form>
      </div>
    );
  }

  _buildFulfillDescription() {
    const account = this.state.account;
    const tokenPurchase = this.state.tokenPurchase;
    return this._notEnoughTokens() ?
      <div className="col s12">
        <p>You don't have enough {tokenPurchase.tokenSymbol} balance in your account ({account.address}) to fulfill this contract.</p>
      </div> :
      <div className="col s12">
        <p><b>If you fulfill this token purchase contract, then two transactions will be performed:</b></p>
        <p>1. Firstly, you will be requested to sign a token approval to the token purchase contract.</p>
        <p>2. Then, you will claim the ether balance of the token purchase contract to be transfer to your account ({account.address}).</p>
      </div>
  }

  _notEnoughTokens() {
    const account = this.state.account || {}
    const tokenPurchase = this.state.tokenPurchase || {}
    if(!account.tokensBalance || !account.tokensBalance.amount || !tokenPurchase.amount) return false
    return account.tokensBalance.amount.lessThan(tokenPurchase.amount)
  }

  _handleSubmit(e) {
    e.preventDefault();
    Store.dispatch(TokenPurchaseActions.fulfill(this.state.tokenPurchase.address, this.state.account.address))
  }
}
