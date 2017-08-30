import React from 'react'
import Store from '../store'
import TokenSaleActions from '../actions/tokensales'
import TokenPurchaseActions from '../actions/tokenpurchases'
import { Link } from 'react-router-dom'

export default class Navbar extends React.Component {
  constructor(props){
    super(props)
    this.state = { searchingAddress: '' }
    this._searchContract = this._searchContract.bind(this)
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">Token Marketplace</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li className="input-field">
              <input className="search-contract" placeholder="Search contract..." onChange={this._searchContract} value={this.state.searchingAddress}/>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  _searchContract(e) {
    e.preventDefault()
    const searchingAddress = e.target.value;
    if(searchingAddress.length > 40) {
      this.setState({ searchingAddress: searchingAddress })
      Store.dispatch(TokenSaleActions.validate(searchingAddress))
      Store.dispatch(TokenPurchaseActions.validate(searchingAddress))
    }
  }
}
