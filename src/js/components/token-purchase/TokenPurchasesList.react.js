import React from 'react'
import Store from '../../store'
import { Link } from 'react-router-dom'
import TokenPurchaseActions from '../../actions/tokenpurchases'
import contractStatusToString from '../../helpers/contractStatusToString'

export default class TokenPurchasesList extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenPurchases: [] }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenPurchaseActions.findAll())
  }

  render() {
    return (
      <div ref="tokenPurchasesList" className={"col " + this.props.col}>
        <div className="card">
          <div className="card-content">
            <h3 className="title">Token Purchases</h3>
            { this.state.tokenPurchases.length === 0 ? <em>Loading...</em> : <ul className="collection">{this._buildList()}</ul>}
          </div>
        </div>
      </div>
    )
  }

  _buildList() {
    return this.state.tokenPurchases.map(tokenPurchase => {
      const status = contractStatusToString(tokenPurchase)
      return (
        <li className="collection-item" key={tokenPurchase.address}>
          <div className="row">
            <div className="col s10">
              <Link className="truncate" to={`/token-purchase/${tokenPurchase.address}`}>
                <b>{tokenPurchase.tokenSymbol} {tokenPurchase.amount.toString()} - ETH {tokenPurchase.price.toString()}</b> @ {tokenPurchase.address}
              </Link>
            </div>
            <div className="col s2">
              <span className={`chip secondary-content ${status}-chip`}>{status}</span>
            </div>
          </div>
        </li>
      )
    })
  }

  _onChange() {
    if(this.refs.tokenPurchasesList) {
      const state = Store.getState();
      if(state.tokenPurchasesList !== this.state.tokenPurchases) this.setState({ tokenPurchases: state.tokenPurchasesList });
    }
  }
}
