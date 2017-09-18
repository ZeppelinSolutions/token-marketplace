import BigNumber from 'bignumber.js'

export default function toTokens(tokens, decimals) {
  const multiplier = new BigNumber(10).toPower(decimals)
  return new BigNumber(tokens).times(multiplier)
}
