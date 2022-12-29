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
  let i = 0
  let j = 0
  const patches = []
  while (i < lengthA && j < lengthB) {
    const a = oldDom[i]
    const b = newDom[j]
    const newIndex = newDom.indexOf(a)
    if (a === b) {
      // console.log('same', a)
    } else {
      if (a.type === b.type) {
        const aProps = a.props
        const bProps = b.props
        for (const propA in aProps) {
          if (propA in bProps) {
            if (aProps[propA] !== bProps[propA]) {
              patches.push({ type: 'updateProp', key: propA, value: bProps[propA], index: i })
            }
          }
        }
      } else {
        // insert b
        patches.push({ type: 'insert', nodes: newDom.slice(j, j + b.childCount + 1), index: i })
        j += b.childCount
      }
    }
    i++
    j++
  }
  return patches
}
