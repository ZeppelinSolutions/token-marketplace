import React from 'react'
import Store from '../store'
import Navbar from './Navbar.react'
import BuySellPage from './buy-sell/BuySellPage.react'
import TokenSalePage from './token-sale/TokenSalePage.react'
import TokenPurchasePage from './token-purchase/TokenPurchasePage.react'
import { Switch, Route } from 'react-router-dom'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
  }

  render() {
    const error = this.state.error
    return (
      <div className="container">
        <Navbar/>
        <div id="errors">{error ? error.message : ''}</div>
        <Switch>
          <Route path="/" exact component={BuySellPage}/>
          <Route path="/token-sale/:address" component={TokenSalePage}/>
          <Route path="/token-purchase/:address" component={TokenPurchasePage}/>
        </Switch>
      </div>
    );
  }

  _onChange() {
    const state = Store.getState();
    this.setState({ error: state.error });
  }
}
