import React from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends React.Component {
  constructor(props){
    super(props)
    this._searchContract = this._searchContract.bind(this)
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">Token Marketplace</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li className="input-field">
              <input className="search-contract" placeholder="Search contract..." onChange={this._searchContract} />
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  _searchContract(e) {
    e.preventDefault()
    const searchingAddress = e.target.value;
    this.props.searchContract(searchingAddress);
  }
}
