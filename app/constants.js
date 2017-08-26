import $ from 'jquery'

export const GAS = 1000000;                                                  // amount of gas to use for the transaction
export const LOCALHOST_PROVIDER = "http://localhost:8545"                    // default localhost provider for Web3
export const MYTOKEN_INITIAL_AMOUNT = 1000;                                  // default amount of tokens created initially
export const MY_TOKEN_ADDRESS = "0xad13f9da729a960a2724e7a34c9ab03eedd6959e" // MyToken at Ropsten

export const showError = error => {
  console.error(error);
  $("#errors").text(error);
};
