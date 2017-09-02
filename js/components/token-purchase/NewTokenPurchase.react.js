import React from 'react'
import { Link } from 'react-router-dom'

export default class NewTokenPurchase extends React.Component {
  render() {
    return (
      <div className="row">
        <h3>Congrats!</h3>
        <br/>
        <h6>You have deployed a new token purchase contract. Please click <Link to={`/token-purchase/${this.props.match.params.address}`}>here</Link> to check your contract details</h6>
        <h6><Link to="/">I would like to buy more tokens :)</Link></h6>
        <hr/>
      </div>
    );
  }
}
