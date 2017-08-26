import $ from 'jquery'
import Network from './network'
import { showError } from "./constants"

const Accounts = {
  update(erc20) {
    $('#accounts').html("");
    Network.eth().getAccounts(function(error, accounts) {
      if(error) return showError(error)
      accounts.forEach(async function(account) {
        await Accounts.updateAccount(account, erc20);
      })
    });
  },

  updateAccount(account, erc20) {
    Network.eth().getBalance(account, async function(error, balance) {
      if(error) return showError(error)
      let tokens = await erc20.balanceOf(account);
      $('#accounts').append(`<p><a href="#" class="select-seller">sell</a> <a href="#" class="select-buyer">buy</a> <span class="address">${account}</span> | <span class="balance">ETH ${balance}</span> | <span class="balance">Tokens ${tokens}</span></p>`)
    });
  },
}

export default Accounts
