export const getKeyBindingString = (key, altKey, ctrlKey, shiftKey, metaKey) => {
  let string = ''
  if (ctrlKey) {
    string += 'ctrl+'
  }
  if (altKey) {
    string += 'alt+'
  }
  if (shiftKey) {
    string += 'shift+'
  }
  string += key
  return string
}
