import React from 'react';
import { Link } from 'react-router-dom'

export default class Home extends React.Component {
  render() {
    return (
      <div className="buy-sell-question row center">
        <h3>Would you like to buy or sell tokens?</h3>
        <div className="row">
          <Link to="/publish/buy" className="btn-large btn-primary buy-button" id="buy">Buy</Link>
          <Link to="/publish/sell" className="btn-large btn-primary" id="sell">Sell</Link>
        </div>
      </div>
    )
  }
}
