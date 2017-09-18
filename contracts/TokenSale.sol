pragma solidity ^0.4.11;

import './DetailedERC20.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract TokenSale is Ownable {
  bool public closed;
  uint256 public priceInWei;
  DetailedERC20 public token;

  event Refund(uint256 amount);
  event TokenPurchased(address buyer, address seller, uint256 price, uint256 amount);

  modifier notClosed() {
    require(!closed);
    _;
  }

  modifier hasSomeTokens() {
    require(amount() > 0);
    _;
  }

  function TokenSale(DetailedERC20 _token, uint256 _price) {
    if (_price < 0) revert();

    token = _token;
    priceInWei = _price;
    closed = false;
  }

  function amount() constant returns(uint256) {
    return token.balanceOf(this);
  }

  function () payable notClosed hasSomeTokens {
    require(msg.value == priceInWei);

    closed = true;

    uint256 _amount = amount();
    address _buyer = msg.sender;
    if(!token.transfer(_buyer, _amount)) revert();
    owner.transfer(priceInWei);
    TokenPurchased(_buyer, owner, priceInWei, _amount);
  }

  function refund() onlyOwner notClosed hasSomeTokens returns(bool) {
    closed = true;

    uint256 _amount = amount();
    if(!token.transfer(owner, _amount)) revert();
    Refund(_amount);
    return true;
  }
}
