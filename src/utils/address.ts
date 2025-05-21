export function isNonEmptyString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length > 0;
}

/**
 * Truncates an Ethereum address or ENS name for display
 * @param address Full address or ENS name
 * @returns Truncated address
 */
export function truncateEthAddress(
  address: string,
): string {
  // If it's not an Ethereum address (e.g. it's an ENS name), return it as-is
  if (!address.startsWith("0x") || address.length !== 42) {
    return address;
  }

  const start = address.slice(0, 6); // Always include 0x + 4 chars

  return `${start}...${address.slice(-4)}`;
}