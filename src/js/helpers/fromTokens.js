import BigNumber from 'bignumber.js'

export default function fromTokens(tokens, decimals) {
  const divider = new BigNumber(10).toPower(decimals)
  return tokens.div(divider)
}
