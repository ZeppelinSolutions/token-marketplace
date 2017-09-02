import $ from 'jquery'
import React from 'react'
import Store from '../../store'
import TransactionActions from "../../actions/transactions"

export default class TransactionsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { transactions: [] }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TransactionActions.getTransactions())
    $('.collapsible').collapsible();
  }

  render() {
    return (
      <div ref="transactionsList" className={"transactions-list col " + this.props.col}>
        <h4 className="subtitle">Transactions List</h4>
        <ul className="collapsible" data-collapsible="accordion">
          {this._buildTransactionsList()}
        </ul>
      </div>
    );
  }

  _buildTransactionsList() {
    return this.state.transactions.map(transaction =>
      <li key={transaction.hash}>
        <div className="collapsible-header active">{transaction.hash}</div>
        <div className="collapsible-body">
          <p><b>Hash:</b> <span id="hash">{transaction.hash}</span></p>
          <p><b>Nonce:</b> <span id="nonce">{transaction.nonce}</span></p>
          <p><b>Gas usage:</b> <span id="gas-usage">{transaction.gas}</span></p>
          <p><b>Block Number:</b> <span id="block-number">{transaction.blockNumber}</span></p>
          <p><b>Block Hash:</b> <span id="block-hash">{transaction.blockHash}</span></p>
          <p><b>Tx Index:</b> <span id="transaction-index">{transaction.transactionIndex}</span></p>
          <p><b>From:</b> <span id="from">{transaction.from}</span></p>
          <p><b>To:</b> <span id="to">{transaction.to}</span></p>
          <p><b>Value:</b> <span id="value">{transaction.value}</span></p>
        </div>
      </li>
    )
  }

  _onChange() {
    const state = Store.getState();
    if(this.refs.transactionsList && state.transactions !== this.state.transactions) {
      this.setState({ transactions: state.transactions });
    }
  }
}
