pragma solidity ^0.4.11;

import './DetailedERC20.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract TokenPurchase is Ownable {
  bool public closed;
  bool public canReceiveEther;
  uint256 public amount;
  DetailedERC20 public token;

  event Refund(uint256 price);
  event TokenSold(address buyer, address seller, uint256 price, uint256 amount);

  modifier notClosed() {
    require(!closed);
    _;
  }

  modifier canNotReceiveEther() {
    require(!canReceiveEther);
    _;
  }

  function TokenPurchase(DetailedERC20 _token, uint256 _amount) {
    if(_amount <= 0) return;

    token = _token;
    amount = _amount;
    closed = true;
    canReceiveEther = true;
  }

  function priceInWei() constant returns(uint) {
    return this.balance;
  }

  function () payable onlyOwner {
    require(msg.value > 0);
    require(closed);
    require(canReceiveEther);

    closed = false;
    canReceiveEther = false;
  }

  function claim() notClosed canNotReceiveEther returns(bool) {
    address _seller = msg.sender;
    uint256 _allowedTokens = token.allowance(_seller, address(this));
    require(_allowedTokens >= amount);

    closed = true;

    if(!token.transferFrom(_seller, owner, amount)) revert();
    uint256 _priceInWei = priceInWei();
    _seller.transfer(_priceInWei);
    TokenSold(owner, _seller, _priceInWei, amount);
    return true;
  }

  function refund() onlyOwner notClosed canNotReceiveEther returns(bool) {
    closed = true;

    uint256 _priceInWei = priceInWei();
    owner.transfer(_priceInWei);
    Refund(_priceInWei);
    return true;
  }
}
