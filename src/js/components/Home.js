import React from 'react';
import { Link } from 'react-router-dom'

export default class Home extends React.Component {
  render() {
    return (
      <div className="buy-sell-question row center">
        <h3 className="super-title">Would you like to buy or sell tokens?</h3>
        <div className="row">
          <Link to="/buy" className="btn btn-large buy-button" id="buy">Buy</Link>
          <Link to="/sell" className="btn btn-large " id="sell">Sell</Link>
        </div>
      </div>
    )
  }
}
