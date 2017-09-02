import React from 'react'
import { Link } from 'react-router-dom'

export default class NewTokenSaleLink extends React.Component {
  render() {
    return (
      <div className="row">
        <h3>Congrats!</h3>
        <br/>
        <h6>You have deployed a new token sale contract. Please click <Link to={`/token-sale/${this.props.match.params.address}`}>here</Link> to check your contract details</h6>
        <h6><Link to="/">I would like to sell more tokens :)</Link></h6>
        <hr/>
      </div>
    );
  }
}
