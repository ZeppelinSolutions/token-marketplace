const MyToken = artifacts.require("./MyToken.sol");
const TokenSaleFactory = artifacts.require("./TokenSaleFactory.sol");
const TokenPurchaseFactory = artifacts.require("./TokenPurchaseFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(MyToken);
  deployer.deploy(TokenSaleFactory);
  deployer.deploy(TokenPurchaseFactory);
};
