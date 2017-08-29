import React from 'react';

export default class Transaction extends React.Component {
  constructor(props){
    super(props)
    this.state = { transaction: this.props.transaction }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ transaction: nextProps.transaction })
  }

  render() {
    const transaction = this.state.transaction || {};
    return (
      <div className="col-sm-6">
        <h3>Transaction Information</h3>
        <pre id="transaction-info">
          <p><b>Hash:</b> <span id="hash">{transaction.hash}</span></p>
          <p><b>Nonce:</b> <span id="nonce">{transaction.nonce}</span></p>
          <p><b>Gas usage:</b> <span id="gas-usage">{transaction.blockHash}</span></p>
          <p><b>Block Number:</b> <span id="block-number">{transaction.blockNumber}</span></p>
          <p><b>Block Hash:</b> <span id="block-hash">{transaction.gas}</span></p>
          <p><b>Tx Index:</b> <span id="transaction-index">{transaction.transactionIndex}</span></p>
          <p><b>From:</b> <span id="from">{transaction.from}</span></p>
          <p><b>To:</b> <span id="to">{transaction.to}</span></p>
          <p><b>Value:</b> <span id="value">{transaction.value}</span></p>
        </pre>
      </div>
    );
  }
}
