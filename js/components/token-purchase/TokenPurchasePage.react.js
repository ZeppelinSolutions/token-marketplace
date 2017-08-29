import React from 'react';
import TokenPurchaseForm from './TokenPurchaseForm.react'
import Transaction from '../transactions/Transaction.react'
import TransactionsList from '../transactions/TransactionsList.react'

const TokenPurchasePage = ({ match }) => (
  <div className="row">
    <TokenPurchaseForm tokenPurchaseAddress={match.params.address} col="s12"/>
    <TransactionsList col="s6"/>
    <Transaction col="s6"/>
  </div>
)

export default TokenPurchasePage
