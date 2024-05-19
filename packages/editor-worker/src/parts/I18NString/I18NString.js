const emptyObject = {}

const RE_PLACEHOLDER = /\{(PH\d+)\}/g

/**
 *
 * @param {string} key
 * @param {any} placeholders
 * @returns {string}
 */
export const i18nString = (key, placeholders = emptyObject) => {
  if (placeholders === emptyObject) {
    return key
  }
  const replacer = (match, rest) => {
    return placeholders[rest]
  }
  return key.replaceAll(RE_PLACEHOLDER, replacer)
}
