import React from 'react'
import Store from '../store'
import SearchActions from '../actions/search'
import { withRouter, Link } from 'react-router-dom'

class Navbar extends React.Component {
  constructor(props){
    super(props)
    this.state = { address: '' }
    this._searchContract = this._searchContract.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">Token Marketplace</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li className="input-field">
              <input className="search-contract" placeholder="Search contract..." value={this.state.address} onChange={this._searchContract} />
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  _searchContract(e) {
    e.preventDefault()
    const address = e.target.value;
    this.setState({ address: address })
    if(address.length > 40) Store.dispatch(SearchActions.searchContract(address))
  }

  _onChange() {
    const state = Store.getState()
    if(state.search.found) {
      state.search.tokenSale ?
        this.props.history.push(`/token-sale/${state.search.tokenSale}`) :
        this.props.history.push(`/token-purchase/${state.search.tokenPurchase}`)
      this.setState({ address: '' })
      Store.dispatch(SearchActions.resetSearch())
    }
  }
}

export default withRouter(Navbar)
