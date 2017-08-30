import React from 'react'
import Store from '../store'
import Navbar from './Navbar.react'
import BuySellPage from './buy-sell/BuySellPage.react'
import TokenSalePage from './token-sale/TokenSalePage.react'
import TokenPurchasePage from './token-purchase/TokenPurchasePage.react'
import { Switch, Route } from 'react-router-dom'
import NetworkActions from "../actions/network";

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null, connected: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(NetworkActions.checkConnection())
  }

  render() {
    const connected = this.state.connected
    if(connected === null) return this._loading()
    else if(!connected) return this._askForProvider()
    else return (
      <div>
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
      <div className="container">
        <h3>Please access using MIST or Metamask</h3>
      </div>
    )
  }

  _loading() {
    return (
      <div className="container">
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      </div>
    )
  }

  _onChange() {
    const state = Store.getState()
    this.setState({ error: state.error, connected: state.network.connected })
  }
}
