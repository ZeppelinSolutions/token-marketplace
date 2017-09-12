import React from 'react'
import Store from '../../store'
import TokenPurchaseActions from '../../actions/tokenpurchases'

export default class TokenPurchaseFulfill extends React.Component {
  constructor(props){
    super(props)
    this.state = { fulfiller: this.props.fulfiller, tokenPurchase: this.props.tokenPurchase }
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ fulfiller: nextProps.fulfiller, tokenPurchase: nextProps.tokenPurchase })
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
            <button disabled={this._canBeFulfilled()} className="btn btn-primary">Fulfill</button>
          </div>
        </form>
      </div>
    );
  }

  _buildFulfillDescription() {
    const fulfiller = this.state.fulfiller;
    const tokenPurchase = this.state.tokenPurchase;
    if(this._isPurchaseClosed())
      return <div className="col s12"><p>You cannot fulfilled this token purchase contract since it is already closed.</p></div>
    if(this._notEnoughTokens())
      return <div className="col s12"><p>You don't have enough {tokenPurchase.tokenSymbol} balance in your account ({fulfiller.address}) to fulfill this contract.</p></div>
    return (
      <div className="col s12">
        <p>If you fulfill this token purchase contract, then two transactions will be performed:</p>
        <p>1. Firstly, you will be requested to sign a token approval to the token purchase contract.</p>
        <p>2. Then, you will claim the ether balance of the token purchase contract to be transfer to your account ({fulfiller.address}).</p>
      </div>
    )
  }

  _canBeFulfilled() {
    return this._isPurchaseClosed() || this._notEnoughTokens()
  }

  _notEnoughTokens() {
    return this.state.fulfiller.tokens < this.state.tokenPurchase.amount
  }

  _isPurchaseClosed() {
    return !this.state.tokenPurchase.opened
  }

  _handleSubmit(e) {
    e.preventDefault();
    Store.dispatch(TokenPurchaseActions.fulfill(this.state.tokenPurchase.address, this.state.fulfiller.address))
  }
}
