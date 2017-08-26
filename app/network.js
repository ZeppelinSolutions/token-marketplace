import Web3 from 'web3';
import { LOCALHOST_PROVIDER } from 'constants'

const Network = {
  web3() {
    return new Web3(this.provider())
  },

  eth() {
    return this.web3().eth;
  },

  provider() {
    if(typeof web3 !== 'undefined') return web3.currentProvider
    return new Web3.providers.HttpProvider(LOCALHOST_PROVIDER)
  }
}

export default Network