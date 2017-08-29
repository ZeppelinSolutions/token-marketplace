import React from 'react';
import TokenSaleForm from './TokenSaleForm.react'
import Transaction from '../transactions/Transaction.react'
import TransactionsList from '../transactions/TransactionsList.react'

const TokenSalePage = ({ match }) => (
  <div className="row">
    <TokenSaleForm tokenSaleAddress={match.params.address}/>
    <TransactionsList/>
    <Transaction/>
  </div>
)

export default TokenSalePage
