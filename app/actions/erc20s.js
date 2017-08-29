import { ERC20 } from "../contracts";
import { showError } from "../constants"

const ERC20Actions = {
  async getBalance(owner, erc20Address) {
    try {
      const erc20 = await ERC20.at(erc20Address)
      return await erc20.balanceOf(owner)
    } catch (error) { showError(error) }
  }
};

export default ERC20Actions
