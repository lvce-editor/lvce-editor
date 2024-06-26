const RE_CHARACTERS = /^[a-zA-Z\.\-]+$/

// @ts-ignore
export const compareString = (a, b) => {
  return a.localeCompare(b)
}

/**
 *
 * @param {string} a
 * @param {string} b
 * @returns boolean
 */
// @ts-ignore
export const compareStringNumeric = (a, b) => {
  if (RE_CHARACTERS.test(a) && RE_CHARACTERS.test(b)) {
    return a < b ? -1 : 1
  }
  return a.localeCompare(b, 'en', { numeric: true })
}
