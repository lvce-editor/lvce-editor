export const normalizeKey = (key) => {
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}
