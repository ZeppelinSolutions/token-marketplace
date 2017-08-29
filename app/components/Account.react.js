import React from 'react';

export default class Account extends React.Component {
  constructor(props){
    super(props)
    this.state = { accounts: this.props.accounts }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ accounts: nextProps.accounts })
  }

  render() {
    const accountData = (this.state.accounts.length === 0) ? 'Loading...' : this._buildAccountData()
    return (
      <div>
        <h3>Your Coinbase</h3>
        {accountData}
      </div>
    )
  }

  _buildAccountData() {
    const account = this.state.accounts[0]
    const tokens = (typeof account.tokens === 'undefined') ? '...' : account.tokens.toString();
    return (
      <div>
        <p className="address">Address: <span>{account.address}</span></p>
        <p className="address">ETH: <span>{account.balance.toString()}</span></p>
        <p className="address">Tokens: <span>{tokens}</span></p>
      </div>
    )
  }
}
