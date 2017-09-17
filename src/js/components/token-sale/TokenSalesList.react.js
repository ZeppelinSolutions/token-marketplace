import React from 'react'
import Store from '../../store'
import { Link } from 'react-router-dom'
import TokenSaleActions from '../../actions/tokensales'
import contractStatusToString from '../../helpers/contractStatusToString'

export default class TokenSalesList extends React.Component {
  constructor(props){
    super(props)
    this.state = { tokenSales: [] }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenSaleActions.findAll())
  }

  render() {
    return (
      <div ref="tokenSalesList" className={"col " + this.props.col}>
        <div className="card">
          <div className="card-content">
            <h3 className="title">Token Sales</h3>
            { this.state.tokenSales.length === 0 ? <em>Loading...</em> : <ul className="collection">{this._buildList()}</ul>}
          </div>
        </div>
      </div>
    )
  }

  _buildList() {
    return this.state.tokenSales.map(tokenSale => {
      const status = contractStatusToString(tokenSale)
      return (
        <li className="collection-item" key={tokenSale.address}>
          <div className="row">
            <div className="col s10">
              <Link className="truncate" to={`/token-sale/${tokenSale.address}`}>
                <b>{tokenSale.tokenSymbol} {tokenSale.amount.toString()} - ETH {tokenSale.price.toString()} </b> @ {tokenSale.address}
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
    if(this.refs.tokenSalesList) {
      const state = Store.getState();
      if(state.tokenSalesList !== this.state.tokenSales) this.setState({ tokenSales: state.tokenSalesList });
    }
  }
}
