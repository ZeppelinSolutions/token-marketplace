import React from 'react';

export default class TransactionsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { transactions: this.props.transactions }
  }

  componentWillReceiveProps(nextProps) {
    const transactions = nextProps.transactions
    if(transactions !== this.state.transactions) {
      this.setState({ transactions: transactions })
      if(transactions.length > 0) this._showTransaction(transactions[transactions.length - 1])
    }
  }

  render() {
    return (
      <div className="col-sm-6">
        <h3>Transactions List</h3>
        <pre id="transactions-list">{this._buildTransactionsList()}</pre>
      </div>
    );
  }

  _buildTransactionsList() {
    return this.state.transactions.map(transaction =>
      <p key={transaction}>
        <a href="#" className="transaction" onClick={(transaction) => this._showTransaction(transaction)}>{transaction}</a>
      </p>
    )
  }

  _showTransaction(transaction) {
    this.props.showTransaction(transaction)
  }
}
