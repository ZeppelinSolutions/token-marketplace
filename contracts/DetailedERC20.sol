pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/ERC20.sol';

contract DetailedERC20 is ERC20 {
  string public name;
  string public symbol;
  uint256 public decimals;
}
