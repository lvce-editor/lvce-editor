const normalizeKey = (key) => {
  if (key === ' ') {
    return 'Space'
  }
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}

export const getKeyBindingIdentifier = (event) => {
  let identifier = ''
  if (event.ctrlKey) {
    identifier += 'ctrl+'
  }
  if (event.shiftKey) {
    identifier += 'shift+'
  }
  if (event.altKey) {
    identifier += 'alt+'
  }
  const key = normalizeKey(event.key)
  identifier += key
  return identifier
}
