import React from 'react'
import { Link } from 'react-router-dom'

export default class Account extends React.Component {
  constructor(props){
    super(props)
    this.state = { account: this.props.account }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ account: nextProps.account })
  }

  render() {
    const account = this.state.account
    const tokensBalance = account.tokensBalance || {}
    return (
      <div ref="account" className={`account-details col ${this.props.col}`}>
        <div className="card">
          <div className="card-content">
            <h3 className="title">Your Account</h3>
            <div className="row no-margin">
            { !account ? 'Loading...' :
              <div>
                <div className="input-field col s6">
                  <label className="active">Address</label>
                  <p className="labeled">{account.address}</p>
                </div>
                <div className="input-field col s3">
                  <label className="active">ETH Balance</label>
                  <p className="labeled">{account.etherBalance.toString()}</p>
                </div>
                <div className="input-field col s3">
                  <label className="active">{tokensBalance.symbol || 'Tokens'} Balance</label>
                  <p className="labeled">{(tokensBalance.amount || '...').toString()}</p>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
