import React from 'react';
import { Link } from 'react-router-dom'
import TokenSalesList from './token-sale/TokenSalesList.react'
import TokenPurchasesList from './token-purchase/TokenPurchasesList.react'

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <div className="row buy-sell-question center">
          <h3 className="super-title">Would you like to buy or sell tokens?</h3>
          <div className="row">
            <Link to="/token-purchase" className="btn btn-large btn-primary buy-button" id="buy">Buy</Link>
            <Link to="/token-sale" className="btn btn-large btn-primary" id="sell">Sell</Link>
          </div>
        </div>
        <div className="row contracts-lists">
          <TokenSalesList col="s6"/>
          <TokenPurchasesList col="s6"/>
        </div>
      </div>
    )
  }
}
