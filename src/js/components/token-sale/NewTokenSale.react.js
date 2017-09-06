import React from 'react'
import { Link } from 'react-router-dom'

const NewTokenSaleLink = ({ match }) => (
  <div className="row">
    <div className="col s12">
      <div className="card congrats-card">
        <div className="card-content">
          <span className="card-title">Congrats!</span>
          <p>You have deployed a new token sale contract. Please check your contract details.</p>
          <p>Share your contract with the following link: <Link to={`/token-sale/${match.params.address}`}>{window.location.origin}/token-sale/{match.params.address}</Link></p>
        </div>
        <div className="card-action">
          <Link to={`/token-sale/${match.params.address}`}>Check my contract</Link>
          <Link to="/">Sell some more :)</Link>
        </div>
      </div>
    </div>
  </div>
)

export default NewTokenSaleLink
