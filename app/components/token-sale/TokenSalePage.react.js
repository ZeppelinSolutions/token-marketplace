import React from 'react';
import TokenSaleForm from './TokenSaleForm.react'
import Transaction from '../transactions/Transaction.react'
import TransactionsList from '../transactions/TransactionsList.react'

const TokenSalePage = ({ match }) => (
  <div className="row">
    <TokenSaleForm tokenSaleAddress={match.params.address} col="s12"/>
    <TransactionsList col="s6"/>
    <Transaction col="s6"/>
  </div>
)

export default TokenSalePage
