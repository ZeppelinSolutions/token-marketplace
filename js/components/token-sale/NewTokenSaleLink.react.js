import React from 'react'
import Store from '../../store'
import TokenSaleActions from "../../actions/tokensales"
import { withRouter, Link } from 'react-router-dom'

class NewTokenSaleLink extends React.Component {
  constructor(props){
    super(props)
    this._handleClick = this._handleClick.bind(this)
  }

  render() {
    return (
      <div className={"col " + this.props.col}>
        <h3>Congrats!</h3>
        <br/>
        <h6>You have deployed a new token sale contract</h6>
        <h6>Please click <a onClick={this._handleClick}>here</a> to check your contract details</h6>
        <hr/>
      </div>
    );
  }

  _handleClick(e) {
    e.preventDefault()
    this.props.history.push(`/token-sale/${this.props.tokenSale.address}`)
    Store.dispatch(TokenSaleActions.resetDeployedContract())
  }
}

export default withRouter(NewTokenSaleLink)
