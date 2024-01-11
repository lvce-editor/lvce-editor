/**
 *
 * @param {string} key
 * @param {boolean} altKey
 * @param {boolean} ctrlKey
 * @param {boolean} shiftKey
 * @param {boolean} metaKey
 * @returns {string}
 */
export const getKeyBindingString = (key, altKey, ctrlKey, shiftKey, metaKey) => {
  let string = ''
  if (ctrlKey) {
    string += 'Ctrl+'
  }
  if (altKey) {
    string += 'Alt+'
  }
  if (shiftKey) {
    string += 'Shift+'
  }
  string += key.toUpperCase()
  return string
}
