import React from 'react';
import Store from '../store'
import { withRouter } from 'react-router'
import BuySellForm from './buy-sell/BuySellForm.react'
import AccountActions from "../actions/accounts";

class BuySellPage extends React.Component {
  componentDidMount() {
    Store.subscribe(() => this._onChange());
  }

  render() {
    return (
      <div ref="buySellPage" className="row">
        <BuySellForm col="s12" action={this.props.match.params.action}/>
      </div>
    );
  }

  _onChange() {
    if(this.refs.buySellPage) {
      const deployedAddress = Store.getState().account.deployedAddress;
      if(deployedAddress) {
        const type = this.props.match.params.action === 'buy' ? 'purchase' : 'sale'
        this.props.history.push(`/token-${type}/${deployedAddress}`)
        Store.dispatch(AccountActions.resetDeployedContract())
      }
    }
  }
}

export default withRouter(BuySellPage)
