import React from 'react'
import Store from '../../store'
import TokenSaleActions from "../../actions/tokensales"
import { withRouter, Link } from 'react-router-dom'

class NewTokenSaleLink extends React.Component {
  constructor(props){
    super(props)
    this._handleShow = this._handleShow.bind(this)
    this._handleSellBuy = this._handleSellBuy.bind(this)
  }

  render() {
    return (
      <div className={"col " + this.props.col}>
        <h3>Congrats!</h3>
        <br/>
        <h6>You have deployed a new token sale contract. Please click <a onClick={this._handleShow}>here</a> to check your contract details</h6>
        <h6><a onClick={this._handleSellBuy}>I would like to sell more tokens :)</a></h6>
        <hr/>
      </div>
    );
  }

  _handleShow(e) {
    e.preventDefault()
    this.props.history.push(`/token-sale/${this.props.tokenSale.address}`)
    Store.dispatch(TokenSaleActions.resetDeployedContract())
  }

  _handleSellBuy(e) {
    e.preventDefault()
    Store.dispatch(TokenPurchaseActions.resetDeployedContract())
    this.props.history.push(`/`)
  }
}

export default withRouter(NewTokenSaleLink)
