import React from 'react'
import Store from '../../store'
import TransactionActions from "../../actions/transactions"
import Transaction from "./Transaction.react";

export default class TransactionsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { transactions: [] }
    this._showTransaction = this._showTransaction.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TransactionActions.getTransactions())
  }

  render() {
    return (
      <div ref="transactionsList" className="col-sm-6">
        <h3>Transactions List</h3>
        <pre id="transactions-list">{this._buildTransactionsList()}</pre>
      </div>
    );
  }

  _buildTransactionsList() {
    return this.state.transactions.map(transaction =>
      <p key={transaction}>
        <a href="#" className="transaction" id={transaction} onClick={this._showTransaction}>{transaction}</a>
      </p>
    )
  }

  _showTransaction(e) {
    e.preventDefault()
    const transaction = e.target.id
    Store.dispatch(TransactionActions.getData(transaction))
  }

  _onChange() {
    const state = Store.getState();
    if(this.refs.transactionsList && state.transactions.list !== this.state.transactions) {
      this.setState({ transactions: state.transactions.list });
    }
  }
}
