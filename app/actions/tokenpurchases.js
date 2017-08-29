import { GAS, showError } from "../constants"
import { ERC20, TokenPurchase } from "../contracts"

const TokenPurchaseActions = {
  async publish(erc20Address, buyer, amount, price, updateAccount, addTransaction) {
    console.log(`Buying ${amount} tokens from ${buyer} by Wei ${price}`);
    try {
      const erc20 = await ERC20.at(erc20Address)
      const tokenPurchase = await TokenPurchase.new(erc20.address, amount, { from: buyer, gas: GAS })
      addTransaction(tokenPurchase.transactionHash);

      const response = await tokenPurchase.sendTransaction({ from: buyer, value: price, gas: GAS })
      addTransaction(response.tx);
      updateAccount(buyer);
      return this._buildTokenPurchaseResponse(tokenPurchase);
    } catch(error) { showError(error) }
  },

  async apply(tokenPurchaseAddress, seller, updateAccount, addTransaction) {
    console.log(`Seller ${seller} applying to purchase ${tokenPurchaseAddress}`);
    try {
      const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
      const erc20Address = await tokenPurchase.token()
      const erc20 = await ERC20.at(erc20Address)
      const amount = await tokenPurchase.amount()
      const approval = await erc20.approve(tokenPurchase.address, amount, { from: seller, gas: GAS })
      addTransaction(approval.tx)

      const response = await tokenPurchase.claim({ from: seller, gas: GAS })
      updateAccount(seller)
      addTransaction(response.tx)
      return this._buildTokenPurchaseResponse(tokenPurchase);
    } catch(error) { showError(error) }
  },

  async _buildTokenPurchaseResponse(tokenPurchase) {
    return {
      address: tokenPurchase.address,
      amount: await tokenPurchase.amount(),
      price: await tokenPurchase.priceInWei(),
      opened: await tokenPurchase.opened(),
    }
  }
}

export default TokenPurchaseActions
