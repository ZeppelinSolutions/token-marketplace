import React from 'react';

export default class DeployContractForm extends React.Component {
  constructor(props){
    super(props)
    this.selectERC20 = this.selectERC20.bind(this)
  }

  selectERC20(e) {
    e.preventDefault()
    this.props.selectERC20(e.target.id)
  }

  render() {
    return (
      <div className="row erc20-list">
        <a className="btn btn-floating option tooltipped" id="0xad13f9da729a960a2724e7a34c9ab03eedd6959e" data-position="bottom" data-delay="50" data-tooltip="MyToken" onClick={this.selectERC20}>MTK</a>
        <a className="btn btn-floating option tooltipped" id="0xa0969323ce4d1826ddeaa451c4c1f0c9c67d3762" data-position="bottom" data-delay="50" data-tooltip="Banana Coin" onClick={this.selectERC20}>BAC</a>
        <a className="btn btn-floating option tooltipped" id="0xb5de0b4cbf397209e4badafa7f31aec57518cebc" data-position="bottom" data-delay="50" data-tooltip="Whatever" onClick={this.selectERC20}>WTV</a>
        <a className="btn btn-floating option tooltipped" id="0x1cd78C8BD5E021ABB1D8561a077263Bc8eb54481" data-position="bottom" data-delay="50" data-tooltip="SampleToken" onClick={this.selectERC20}>SAT</a>
        <a className="btn btn-floating option tooltipped" id="0xa9d40a03C8713361ff31C903CCf3ad5b6Dd3e84b" data-position="bottom" data-delay="50" data-tooltip="Plutons" onClick={this.selectERC20}>PLU</a>
        <a className="btn btn-floating option tooltipped" id="0x16D870178154623c3A6147F473478AEb6a37D006" data-position="bottom" data-delay="50" data-tooltip="BucharestJS" onClick={this.selectERC20}>BJS</a>
      </div>
    );
  }
}
