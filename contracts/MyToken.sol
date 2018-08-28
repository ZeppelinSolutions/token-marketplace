pragma solidity ^0.4.11;

import './DetailedERC20.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract MyToken is StandardToken, DetailedERC20, Ownable {
  uint256 public constant INITIAL_SUPPLY = 10000;

  function MyToken() {
    decimals = 18;
    symbol = "MTK";
    name = "MyToken";
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}
