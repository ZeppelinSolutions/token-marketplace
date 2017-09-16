pragma solidity ^0.4.11;

import './TokenPurchase.sol';
import './DetailedERC20.sol';

contract TokenPurchaseFactory {
  function TokenPurchaseFactory() {
  }

  event TokenPurchaseCreated(address tokenPurchaseAddress);

  function createTokenPurchase(DetailedERC20 _token, uint256 _amount) external returns (address) {
    require(_amount > 0);

    TokenPurchase tokenPurchase = new TokenPurchase(_token, _amount);
    tokenPurchase.transferOwnership(msg.sender);
    TokenPurchaseCreated(tokenPurchase);

    return tokenPurchase;
  }
}
