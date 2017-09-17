import contract from 'truffle-contract';
import Network from "./network"

const provider = Network.provider();

const MyToken = contract(require('../../build/contracts/MyToken.json'));
MyToken.setProvider(provider);

const ERC20 = contract(require('../../build/contracts/DetailedERC20.json'));
ERC20.setProvider(provider);

const TokenSale = contract(require('../../build/contracts/TokenSale.json'));
TokenSale.setProvider(provider);

const TokenSaleFactory = contract(require('../../build/contracts/TokenSaleFactory.json'));
TokenSaleFactory.setProvider(provider);

const TokenPurchase = contract(require('../../build/contracts/TokenPurchase.json'));
TokenPurchase.setProvider(provider);

const TokenPurchaseFactory = contract(require('../../build/contracts/TokenPurchaseFactory.json'));
TokenPurchaseFactory.setProvider(provider);

export {
  MyToken,
  ERC20,
  TokenSale,
  TokenSaleFactory,
  TokenPurchase,
  TokenPurchaseFactory,
}
