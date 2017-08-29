import $ from 'jquery'

export const GAS = 1000000;                                                  // amount of gas to use for the transaction
export const LOCALHOST_PROVIDER = "http://localhost:8545"                    // default localhost provider for Web3

export const showError = error => {
  console.error(error);
  $("#errors").text(error);
};
