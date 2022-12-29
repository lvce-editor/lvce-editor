const isEqualElement = (oldDom, i, newDom, j) => {
  const oldElement = oldDom[i]
  const newElement = newDom[j]
  // TODO compare children?
  if (oldElement === newElement) {
    return true
  }
  if (oldElement.type === newElement.type && oldElement.childCount === newElement.childCount) {
    return true
  }
  return false
}

export const diffDom = (oldDom, newDom) => {
  const lengthA = oldDom.length
  const lengthB = newDom.length
  const min = Math.min(lengthA, lengthB)
  for (let i = 0; i < min; i++) {
    const oldElement = oldDom[i]
    const newElement = newDom[i]
    if (isEqualElement(oldElement, i, newElement, i)) {
    }
  }
  return []
}
