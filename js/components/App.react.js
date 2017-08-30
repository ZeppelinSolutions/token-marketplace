import React from 'react'
import Store from '../store'
import Navbar from './Navbar.react'
import SearchActions from '../actions/search'
import NetworkActions from '../actions/network'
import BuySellPage from './buy-sell/BuySellPage.react'
import TokenSalePage from './token-sale/TokenSalePage.react'
import TokenPurchasePage from './token-purchase/TokenPurchasePage.react'
import { withRouter, Switch, Route } from 'react-router-dom'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null, connected: null, couldAccessAccount: null, searching: false }
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
        <Navbar searchContract={address => this._searchContract(address)} />
        {this.state.searching ?
          <div className="container">
            <h5>Searching...</h5>
            <div className="progress">
              <div className="indeterminate"></div>
            </div>
          </div> :
          <div className="container">
            <div id="errors">{this.state.error ? this.state.error.message : ''}</div>
            <Switch>
              <Route path="/" exact component={BuySellPage}/>
              <Route path="/token-sale/:address" component={TokenSalePage}/>
              <Route path="/token-purchase/:address" component={TokenPurchasePage}/>
            </Switch>
          </div>}
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

  _searchContract(address) {
    if(address.length > 40) {
      Store.dispatch(SearchActions.searchContract(address))
    }
  }

  _onChange() {
    if(this.refs.app) {
      const state = Store.getState()
      this.setState({
        error: state.error,
        connected: state.network.connected,
        couldAccessAccount: state.network.couldAccessAccount,
        searching: state.search.searching
      })
      if(state.search.found) {
        state.search.tokenSale ?
          this.props.history.push(`/token-sale/${state.search.address}`) :
          this.props.history.push(`/token-purchase/${state.search.address}`)
      }
    }
  }
}

export default withRouter(App);
