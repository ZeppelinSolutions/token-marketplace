import React from 'react';
import TokenPurchaseForm from './TokenPurchaseForm.react'
import TransactionsList from '../transactions/TransactionsList.react'

const TokenPurchasePage = ({ match }) => (
  <div className="row">
    <TokenPurchaseForm tokenPurchaseAddress={match.params.address} col="s12"/>
    <TransactionsList col="s12"/>
  </div>
)

export default TokenPurchasePage
