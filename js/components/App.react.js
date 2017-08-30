import React from 'react'
import Store from '../store'
import Navbar from './Navbar.react'
import NetworkActions from '../actions/network'
import BuySellPage from './buy-sell/BuySellPage.react'
import TokenSalePage from './token-sale/TokenSalePage.react'
import TokenPurchasePage from './token-purchase/TokenPurchasePage.react'
import { withRouter, Switch, Route } from 'react-router-dom'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null, connected: null, couldAccessAccount: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(NetworkActions.checkConnection())
    Store.dispatch(NetworkActions.checkAccountAccess())
  }

  render() {
    const connected = this.state.connected
    const couldAccessAccount = this.state.couldAccessAccount
    if(connected === null) return this._loading()
    else if(!connected) return this._askForProvider()
    else if(!couldAccessAccount) return this._askToEnableAccount()
    else return (
      <div ref="app">
        <Navbar/>
        <div className="container">
          <div id="errors">{this.state.error ? this.state.error.message : ''}</div>
          <Switch>
            <Route path="/" exact component={BuySellPage}/>
            <Route path="/token-sale/:address" component={TokenSalePage}/>
            <Route path="/token-purchase/:address" component={TokenPurchasePage}/>
          </Switch>
        </div>
      </div>
    )
  }

  _askForProvider() {
    return (
      <div className="container" ref="app">
        <h3>Please access using MIST or Metamask</h3>
      </div>
    )
  }

  _askToEnableAccount() {
    return (
      <div className="container" ref="app">
        <h3>Please enable your account</h3>
      </div>
    )
  }

  _loading() {
    return (
      <div className="container" ref="app">
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      </div>
    )
  }

  _onChange() {
    if(this.refs.app) {
      const state = Store.getState()
      if(state.tokenSale.valid) this.props.history.push(`/token-sale/${state.tokenSale.address}`);
      // TODO: assume that is a token sale - need to check contract type/class
      // if(state.tokenPurchase.valid)  this.props.history.push(`/token-purchase/${state.tokenPurchase.address}`);
      this.setState({ error: state.error, connected: state.network.connected, couldAccessAccount: state.network.couldAccessAccount })
    }
  }
}

export default withRouter(App);
