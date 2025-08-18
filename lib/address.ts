export type AddressDisplay = "standard" | "compact"

export const formatAddress = (
  address: string,
  { display = "standard" }: { display?: AddressDisplay } = {},
) => {
  if (display === "compact") {
    return address.startsWith("0x") ? address.slice(2, 8) : address.slice(0, 6)
  }

  return truncateAddress(address)
}

function truncateText(str: string, maxLength = 50): string {
  if (!str || str.length <= maxLength) {
    return str
  }
  return `${str.substring(0, maxLength)}...`
}

const truncateAddress = (
  address: string,
  {
    before = 6,
    after = 4,
  }: {
    before?: number
    after?: number
  } = {},
) => {
  if (address.length <= before) {
    return address
  }

  return (
    truncateText(address, before) +
    address.substring(address.length - after, address.length)
  )
}