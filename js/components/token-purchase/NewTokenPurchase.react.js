import React from 'react'
import { Link } from 'react-router-dom'

const NewTokenPurchase = ({ match }) => (
  <div className="row">
    <div className="col s12">
      <div className="card congrats-card">
        <div className="card-content">
          <span className="card-title">Congrats!</span>
          <p>You have deployed a new token purchase contract. Please check your contract details.</p>
          <p>Share your contract with the following link: <Link to={`/token-purchase/${match.params.address}`}>/token-sale/{match.params.address}</Link></p>
        </div>
        <div className="card-action">
          <Link to={`/token-purchase/${match.params.address}`}>Check my contract</Link>
          <Link to="/">Buy some more :)</Link>
        </div>
      </div>
    </div>
  </div>
)

export default NewTokenPurchase
