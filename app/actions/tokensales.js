import { GAS, showError } from "../constants"
import { ERC20, TokenSale } from "../contracts"

const TokenSaleActions = {
  async publish(erc20Address, seller, amount, price, updateAccount, addTransaction) {
    console.log(`Selling ${amount} tokens at ${erc20Address} from ${seller} by Wei ${price}`)
    try {
      const erc20 = await ERC20.at(erc20Address)
      const tokenSale = await TokenSale.new(erc20Address, price, { from: seller, gas: GAS })
      addTransaction(tokenSale.transactionHash)

      const response = await erc20.transfer(tokenSale.address, amount, { from: seller, gas: GAS })
      updateAccount(seller)
      addTransaction(response.tx)
      return this._buildTokenSaleResponse(tokenSale)
    } catch(error) { showError(error) }
  },

  async apply(tokenSaleAddress, buyer, updateAccount, addTransaction) {
    try {
      const tokenSale = await TokenSale.at(tokenSaleAddress)
      const erc20Address = await tokenSale.token()
      const erc20 = await ERC20.at(erc20Address)
      const price = await tokenSale.priceInWei()

      console.log(`Buying tokens from ${buyer} by Wei ${price}`)
      const response = await tokenSale.sendTransaction({from: buyer, value: price})
      updateAccount(erc20)
      addTransaction(response.tx)
      return this._buildTokenSaleResponse(tokenSale)
    } catch(error) { showError(error) }
  },

  async _buildTokenSaleResponse(tokenSale) {
    return {
      address: tokenSale.address,
      amount: await tokenSale.amount(),
      price: await tokenSale.priceInWei(),
      closed: await tokenSale.closed(),
    }
  }
}

export default TokenSaleActions
