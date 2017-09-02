import React from 'react';
import Store from '../../store'
import { withRouter } from 'react-router'
import BuySellForm from './BuySellForm.react'
import TransactionsList from "../transactions/TransactionsList.react"

class BuySellPage extends React.Component {
  componentDidMount() {
    Store.subscribe(() => this._onChange());
  }

  render() {
    return (
      <div ref="buySellPage" className="row">
        <BuySellForm col="s12" action={this.props.match.params.action}/>
        <TransactionsList col="s12"/>
      </div>
    );
  }

  _onChange() {
    if(this.refs.buySellPage) {
      const deployedAddress = Store.getState().account.deployedAddress;
      if(deployedAddress) this.props.history.push(`/publish/${this.props.match.params.action}/${deployedAddress}`)
    }
  }
}

export default withRouter(BuySellPage)
