import React from 'react';
import Accounts from './Account.react'
import TokenSale from './TokenSale.react'
import TokenPurchase from './TokenPurchase.react'
import Transaction from './Transaction.react'
import TransactionsList from './TransactionsList.react'
import DeployContractForm from './DeployContractForm.react'

import ERC20Actions from '../actions/erc20s'
import AccountActions from '../actions/accounts'
import TokenSaleActions from '../actions/tokensales'
import TokenPurchaseActions from '../actions/tokenpurchases'
import TransactionActions from '../actions/transactions'

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = { accounts: [], tokenSale: null, tokenPurchase: null, transactions: [], currentTransaction: null }
    this.updateAccount = this.updateAccount.bind(this)
    this.addTransaction = this.addTransaction.bind(this)
  }

  componentWillMount() {
    AccountActions.findAll().then(accounts => {
      this.setState({accounts: accounts})
      accounts.forEach(account => {
        this.updateAccount(account.address)
      })
    })
  }

  updateAccount(address) {
    AccountActions.getBalance(address).then(balance => {
      let accounts = this.state.accounts;
      accounts.forEach(account => {
        if(account.address === address) account.balance = balance
      })
      this.setState({ accounts: accounts });
    })
  }

  async showAccountTokens(owner, erc20) {
    const tokens = await ERC20Actions.getBalance(owner, erc20)
    let accounts = this.state.accounts
    accounts[0].tokens = tokens
    this.setState({ account: accounts })
  }

  addTransaction(transactionHash) {
    let transactions = this.state.transactions;
    transactions.push(transactionHash);
    this.setState({ transactions: transactions });
  }

  showTransaction(transactionHash) {
    TransactionActions.getData(transactionHash).then(transaction =>
      this.setState({ currentTransaction: transaction })
    );
  }

  async publishTokenSale(erc20Address, seller, amount, price) {
    const tokenSale = await TokenSaleActions.publish(erc20Address, seller, amount, price, this.updateAccount, this.addTransaction)
    this.setState({ tokenSale: tokenSale });
  }

  async applyTokenSale(tokenSaleAddress, buyer) {
    const tokenSale = await TokenSaleActions.apply(tokenSaleAddress, buyer, this.updateAccount, this.addTransaction)
    this.setState({ tokenSale: tokenSale });
  }

  async publishTokenPurchase(erc20Address, buyer, amount, price) {
    let tokenPurchase = await TokenPurchaseActions.publish(erc20Address, buyer, amount, price, this.updateAccount, this.addTransaction)
    this.setState({ tokenPurchase: tokenPurchase });
  }

  async applyTokenPurchase(tokenPurchaseAddress, seller) {
    let tokenPurchase = await TokenPurchaseActions.apply(tokenPurchaseAddress, seller, this.updateAccount, this.addTransaction)
    this.setState({ tokenPurchase: tokenPurchase });
  }

  render() {
    return (
      <div>
        <div id="errors"/>
        <div className="row">
          <div className="col-sm-4">
            <Accounts accounts={this.state.accounts}/>
          </div>
          <div className="col-sm-8">
            {this._buildContractForm()}
          </div>
        </div>
        <div className="row">
          <TransactionsList transactions={this.state.transactions} showTransaction={transaction => this.showTransaction(transaction)}/>
          <Transaction transaction={this.state.currentTransaction}/>
        </div>
      </div>
    );
  }

  _buildContractForm() {
    if(this.state.tokenSale)
      return <TokenSale tokenSale={this.state.tokenSale} apply={(contract, buyer) => this.applyTokenSale(contract, buyer)}/>
    else if(this.state.tokenPurchase)
      return <TokenPurchase tokenPurchase={this.state.tokenPurchase} apply={(contract, seller) => this.applyTokenPurchase(contract, seller)}/>
    else
      return <DeployContractForm coinbase={this.state.accounts[0]}
              showAccountTokens={(owner, erc20) => this.showAccountTokens(owner, erc20)}
              publishTokenSale={(erc20, seller, amount, price) => this.publishTokenSale(erc20, seller, amount, price)}
              publishTokenPurchase={(erc20, seller, amount, price) => this.publishTokenPurchase(erc20, seller, amount, price)}/>
  }
}
