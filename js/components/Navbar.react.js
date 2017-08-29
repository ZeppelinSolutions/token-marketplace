import React from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends React.Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">Token Marketplace</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><Link to="/search" className="nav-link" >Search</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}
