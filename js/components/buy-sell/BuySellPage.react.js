import React from 'react';
import Store from '../../store'
import BuySellForm from './BuySellForm.react'
import Transaction from '../transactions/Transaction.react'
import TransactionsList from "../transactions/TransactionsList.react"
import NewTokenSaleLink from "../token-sale/NewTokenSaleLink.react";
import NewTokenPurchaseLink from "../token-purchase/NewTokenPurchaseLink.react";

export default class BuySellPage extends React.Component {
  constructor(props){
    super(props)
    this.state = { deployed: false }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange());
  }

  render() {
    return (
      <div className="row">
        {this.state.deployed ? this._buildContractLink() : <BuySellForm col="s12"/>}
        <TransactionsList col="s6"/>
        <Transaction col="s6"/>
      </div>
    );
  }

  _onChange() {
    const state = Store.getState();
    this.setState({ deployed: state.account.deployed, tokenSale: state.tokenSale, tokenPurchase: state.tokenPurchase })
  }

  _buildContractLink() {
    return this.state.tokenSale ?
      <NewTokenSaleLink contract={this.state.tokenSale}/> :
      <NewTokenPurchaseLink contract={this.state.tokenPurchase}/>
  }
}
