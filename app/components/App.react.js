import React from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <div id="errors"/>
        <div className="row">
          <div className="col-sm-6">
            <h3>Accounts</h3>
            <div id="mytoken-address"><b>MyToken Address</b></div>
            <pre id="accounts"/>
          </div>
          <div className="col-sm-6">
            <div className="col-sm-12">
              <h3>TokenSale Contracts</h3>
              <pre id="token-sale-contracts"/>
            </div>
            <div className="col-sm-12">
              <h3>TokenPurchase Contracts</h3>
              <pre id="token-purchase-contracts"/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="col-sm-12">
              <h3>Create token sale contract</h3>
              <div className="form-group row">
                <label htmlFor="tokensale-token-address" className="col-sm-3 col-form-label">Token (address)</label>
                <div className="col-sm-9"><input className="form-control" id="tokensale-token-address" value="0xad13f9da729a960a2724e7a34c9ab03eedd6959e" required/></div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokensale-seller-address" className="col-sm-3 col-form-label">Seller (address)</label>
                <div className="col-sm-9"><input className="form-control" id="tokensale-seller-address" required/></div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokensale-amount" className="col-sm-3 col-form-label">Amount (token)</label>
                <div className="col-sm-4"><input type="number" className="form-control" id="tokensale-amount" required/></div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokensale-price" className="col-sm-3 col-form-label">Price (wei)</label>
                <div className="col-sm-4"><input type="number" className="form-control" id="tokensale-price" required/></div>
              </div>
              <button id="sell" className="btn btn-primary">Sell</button>
            </div>
            <div className="col-sm-12">
              <h3>Apply token sale contract</h3>
              <div className="form-group row">
                <label htmlFor="tokensale-contract-address" className="col-sm-3 col-form-label">Contract (address)</label>
                <div className="col-sm-9"><input className="form-control" id="tokensale-contract-address" required/></div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokensale-buyer-address" className="col-sm-3 col-form-label">Buyer (address)</label>
                <div className="col-sm-9"><input className="form-control" id="tokensale-buyer-address" required/></div>
              </div>
              <button id="apply-sell" className="btn btn-primary">Apply</button>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="col-sm-12">
              <h3>Create token purchase contract</h3>
              <div className="form-group row">
                <label htmlFor="tokenpurchase-token-address" className="col-sm-3 col-form-label">Token (address)</label>
                <div className="col-sm-9"><input className="form-control" id="tokenpurchase-token-address" value="0xad13f9da729a960a2724e7a34c9ab03eedd6959e" required/></div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokenpurchase-buyer-address" className="col-sm-3 col-form-label">Buyer (address)</label>
                <div className="col-sm-9"><input className="form-control" id="tokenpurchase-buyer-address" required/></div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokenpurchase-amount" className="col-sm-3 col-form-label">Amount (token)</label>
                <div className="col-sm-4"><input type="number" className="form-control" id="tokenpurchase-amount" required/></div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokenpurchase-price" className="col-sm-3 col-form-label">Price (wei)</label>
                <div className="col-sm-4"><input type="number" className="form-control" id="tokenpurchase-price" required/></div>
              </div>
              <button id="buy" className="btn btn-primary">Buy</button>
            </div>
            <div className="col-sm-12">
              <h3>Apply token purchase</h3>
              <div className="form-group row">
                <label htmlFor="tokenpurchase-contract-address" className="col-sm-3 col-form-label">Contract (address)</label>
                <div className="col-sm-9"><input className="form-control" id="tokenpurchase-contract-address" required/></div>
              </div>
              <div className="form-group row">
                <label htmlFor="tokenpurchase-seller-address" className="col-sm-3 col-form-label">Seller (address)</label>
                <div className="col-sm-9"><input className="form-control" id="tokenpurchase-seller-address" required/></div>
              </div>
              <button id="apply-buy" className="btn btn-primary">Apply</button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <h3>Transactions List</h3>
            <pre id="transactions-list"/>
          </div>
          <div className="col-sm-6">
            <h3>Transaction Information</h3>
            <pre id="transaction-info">
              <p><b>Hash:</b> <span id="hash"/></p>
              <p><b>Nonce:</b> <span id="nonce"/></p>
              <p><b>Gas usage:</b> <span id="gas-usage"/></p>
              <p><b>Block Number:</b> <span id="block-number"/></p>
              <p><b>Block Hash:</b> <span id="block-hash"/></p>
              <p><b>Tx Index:</b> <span id="transaction-index"/></p>
              <p><b>From:</b> <span id="from"/></p>
              <p><b>To:</b> <span id="to"/></p>
              <p><b>Value:</b> <span id="value"/></p>
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
