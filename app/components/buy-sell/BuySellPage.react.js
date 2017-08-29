import React from 'react';
import BuySellForm from './BuySellForm.react'
import Transaction from '../transactions/Transaction.react'
import TransactionsList from "../transactions/TransactionsList.react"

export default class BuySellPage extends React.Component {
  render() {
    return (
      <div className="row">
        <BuySellForm col="s12"/>
        <TransactionsList col="s6"/>
        <Transaction col="s6"/>
      </div>
    );
  }
}
