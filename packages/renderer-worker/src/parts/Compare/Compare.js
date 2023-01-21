export const compareString = (a, b) => {
  return a.localeCompare(b)
}

/**
 *
 * @param {string} a
 * @param {string} b
 * @returns boolean
 */
export const compareStringNumeric = (a, b) => {
  return a.localeCompare(b, 'en', { numeric: true })
}
