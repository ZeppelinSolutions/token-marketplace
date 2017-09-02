import React from 'react'
import Home from './Home'
import Store from '../store'
import Modal from './Modal.react'
import Navbar from './Navbar.react'
import NetworkActions from '../actions/network'
import BuySellPage from './buy-sell/BuySellPage.react'
import NewTokenSale from "./token-sale/NewTokenSale.react"
import TokenSalePage from './token-sale/TokenSalePage.react'
import NewTokenPurchase from "./token-purchase/NewTokenPurchase.react"
import TokenPurchasePage from './token-purchase/TokenPurchasePage.react'
import { Switch, Route } from 'react-router-dom'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null, connected: null, couldAccessAccount: null, fetching: false }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(NetworkActions.checkConnection())
    Store.dispatch(NetworkActions.checkAccountAccess())
  }

  render() {
    const connected = this.state.connected
    const couldAccessAccount = this.state.couldAccessAccount
    const fetching = connected && couldAccessAccount && this.state.fetching

    return (
      <div ref="app">
        <Navbar/>
        <div className="container">
          <div id="errors">{this.state.error ? this.state.error.message : ''}</div>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/publish/:action" exact component={BuySellPage}/>
            <Route path="/publish/buy/:address" exact component={NewTokenPurchase}/>
            <Route path="/publish/sell/:address" exact component={NewTokenSale}/>
            <Route path="/token-sale/:address" component={TokenSalePage}/>
            <Route path="/token-purchase/:address" component={TokenPurchasePage}/>
          </Switch>
        </div>
        <Modal open={fetching} progressBar message={'...loading...'}/>
        <Modal open={!connected} message={'Please access using MIST or Metamask'}/>
        <Modal open={connected && !couldAccessAccount} message={'Please enable your account'}/>
      </div>
    )
  }

  _onChange() {
    const state = Store.getState()
    if(this.refs.app) this.setState({
      error: state.error,
      fetching: state.fetching,
      connected: state.network.connected,
      couldAccessAccount: state.network.couldAccessAccount
    })
  }
}
