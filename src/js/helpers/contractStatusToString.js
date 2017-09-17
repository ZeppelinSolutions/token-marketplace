export default function contractStatusToString(contract) {
  if(!contract) return ''
  if(contract.refunded) return 'refunded'
  if(contract.closed) return 'closed'
  return 'open'
}
