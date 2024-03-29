const defaultCompare = (a, b) => {
  return a.localeCompare(b)
}

export const sort = (array, compare = defaultCompare) => {
  return [...array].sort(compare)
}

export const isEqual = (a, b) => {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
