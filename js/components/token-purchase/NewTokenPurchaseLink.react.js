import React from 'react'
import Store from '../../store'
import TokenPurchaseActions from "../../actions/tokenpurchases"
import { withRouter, Link } from 'react-router-dom'

class NewTokenPurchaseLink extends React.Component {
  constructor(props){
    super(props)
    this._handleClick = this._handleClick.bind(this)
  }

  render() {
    return (
      <div className={"col " + this.props.col}>
        <h3>Congrats!</h3>
        <br/>
        <h6>You have deployed a new token purchase contract</h6>
        <h6>Please click <a onClick={this._handleClick}>here</a> to check your contract details</h6>
        <hr/>
      </div>
    );
  }

  _handleClick(e) {
    e.preventDefault()
    this.props.history.push(`/token-purchase/${this.props.tokenPurchase.address}`)
    Store.dispatch(TokenPurchaseActions.resetDeployedContract())
  }
}

export default withRouter(NewTokenPurchaseLink)
