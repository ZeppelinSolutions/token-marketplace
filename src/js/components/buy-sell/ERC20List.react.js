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
      <div className="row">
        <a className="col s2" id="0xad13f9da729a960a2724e7a34c9ab03eedd6959e" onClick={this.selectERC20}>MyToken</a>
        <a className="col s2" id="0xa0969323ce4d1826ddeaa451c4c1f0c9c67d3762" onClick={this.selectERC20}>Banana Coin</a>
        <a className="col s2" id="0xb5de0b4cbf397209e4badafa7f31aec57518cebc" onClick={this.selectERC20}>Whatever</a>
        <a className="col s2" id="0x1cd78C8BD5E021ABB1D8561a077263Bc8eb54481" onClick={this.selectERC20}>SampleToken</a>
        <a className="col s2" id="0xa9d40a03C8713361ff31C903CCf3ad5b6Dd3e84b" onClick={this.selectERC20}>Plutons</a>
        <a className="col s2" id="0x16D870178154623c3A6147F473478AEb6a37D006" onClick={this.selectERC20}>BucharestJS</a>
      </div>
    );
  }
}
