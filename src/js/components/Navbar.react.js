import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => (
  <nav>
    <div className="nav-wrapper container">
      <Link to="/" className="brand-logo">Token Marketplace</Link>
    </div>
  </nav>
)

export default Navbar
