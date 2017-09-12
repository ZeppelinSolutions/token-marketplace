import React from 'react'
import Store from '../../store'
import TokenSaleActions from '../../actions/tokensales'

export default class TokenSaleFulfill extends React.Component {
  constructor(props){
    super(props)
    this.state = { fulfiller: this.props.fulfiller, tokenSale: this.props.tokenSale }
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tokenSale: nextProps.tokenSale, fulfiller: nextProps.fulfiller })
  }

  render() {
    const fulfiller = this.state.fulfiller
    const tokenSale = this.state.tokenSale
    const closed = tokenSale.closed
    const notEnoughEther = fulfiller.balance < tokenSale.balance
    return (
      <div ref="tokenSaleFulfill" className={"col " + this.props.col}>
        <form className="card" onSubmit={this._handleSubmit}>
          <div className="card-content">
            <h3 className="title">Fulfill contract</h3>
            <div className="row">{this._buildFulfillDescription(closed, notEnoughEther)}</div>
          </div>
          <div className="card-action">
            <button disabled={closed || notEnoughEther} className="btn btn-primary">Fulfill</button>
          </div>
        </form>
      </div>
    );
  }

  _buildFulfillDescription(closed, notEnoughEther) {
    const fulfiller = this.state.fulfiller;
    if(closed) return <div className="col s12"><p>You cannot fulfilled this token sale contract since it is already closed.</p></div>
    return notEnoughEther ?
      <div className="col s12">
        <p>You don't have enough ether balance in your account ({fulfiller.address}) to fulfill this contract.</p>
      </div> :
      <div className="col s12">
        <p>If you fulfill this token sale contract, then one transaction will be performed:</p>
        <p>You will be requested to sign an ether transaction from your account ({fulfiller.address}) to the token sale contract, in order to receive the given amount of tokens in return.</p>
      </div>
  }

  _handleSubmit(e) {
    e.preventDefault();
    Store.dispatch(TokenSaleActions.fulfill(this.state.tokenSale.address, this.state.fulfiller.address))
  }
}
