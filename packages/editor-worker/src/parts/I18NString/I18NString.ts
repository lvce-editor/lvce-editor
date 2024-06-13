const emptyObject = {}

const RE_PLACEHOLDER = /\{(PH\d+)\}/g

/**
 *
 * @param {string} key
 * @param {any} placeholders
 * @returns {string}
 */
// @ts-ignore
export const i18nString = (key, placeholders = emptyObject) => {
  if (placeholders === emptyObject) {
    return key
  }
  // @ts-ignore
  const replacer = (match, rest) => {
    // @ts-ignore
    return placeholders[rest]
  }
  return key.replaceAll(RE_PLACEHOLDER, replacer)
}
