pragma solidity ^0.4.11;

import './TokenSale.sol';
import './DetailedERC20.sol';

contract TokenSaleFactory {
  function TokenSaleFactory() {
  }

  event TokenSaleCreated(address tokenSaleAddress);

  function createTokenSale(DetailedERC20 _token, uint256 _price) external returns (address) {
    require(_price > 0);

    TokenSale tokenSale = new TokenSale(_token, _price);
    tokenSale.transferOwnership(msg.sender);
    TokenSaleCreated(tokenSale);

    return tokenSale;
  }
}
