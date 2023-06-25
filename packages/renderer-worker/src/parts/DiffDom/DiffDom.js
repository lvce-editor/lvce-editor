import * as DiffDomType from '../DiffDomType/DiffDomType.js'
import * as GetTotalChildCount from '../GetTotalChildCount/GetTotalChildCount.js'

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

const diffProps = (patches, a, b, index) => {
  const aProps = a.props
  const bProps = b.props
  for (const propA in aProps) {
    if (propA in bProps) {
      if (aProps[propA] !== bProps[propA]) {
        patches.push({ type: DiffDomType.UpdateProp, key: propA, value: bProps[propA], index })
      }
    }
  }
}

const diffDomInternal = (patches, oldDom, oldStartIndex, oldEndIndex, newDom, newStartIndex, newEndIndex) => {
  let i = oldStartIndex
  let j = newStartIndex
  while (i < oldEndIndex && j < newEndIndex) {
    const a = oldDom[i]
    const b = newDom[j]
    const newIndex = newDom.indexOf(a)
    if (a === b) {
      // console.log('same', a)
    } else {
      if (a.type === b.type) {
        diffProps(patches, a, b, i)
        if (a.childCount !== b.childCount) {
          const oldTotal = GetTotalChildCount.getTotalChildCount(oldDom, i)
          const newTotal = GetTotalChildCount.getTotalChildCount(newDom, j)
          if (a.childCount === 0) {
            patches.push({
              index: i,
              type: DiffDomType.Insert,
              nodes: newDom.slice(j + 1, j + newTotal + 1),
            })
            j += newTotal
          } else if (b.childCount === 0) {
            patches.push({
              type: DiffDomType.Remove,
              nodes: [i + 1],
            })
            i += oldTotal
          } else {
            diffDomInternal(patches, oldDom, i, i + oldTotal, newDom, j, j + newTotal)
            i += oldTotal
            j += newTotal
          }
        }
      } else {
        // console.log({ a, b })
        // replace a with b
        const totalChildCount = GetTotalChildCount.getTotalChildCount(newDom, j)
        const oldTotal = GetTotalChildCount.getTotalChildCount(oldDom, i)
        patches.push({
          index: i,
          type: DiffDomType.Replace,
          nodes: [newDom.slice(j, j + totalChildCount + 1)],
        })
        i += oldTotal
        j += totalChildCount
      }
    }
    i++
    j++
  }
  if (j < newEndIndex) {
    patches.push({
      index: i,
      type: DiffDomType.Insert,
      nodes: newDom.slice(j),
    })
  }
  if (i < oldEndIndex) {
    const toRemove = []
    while (i < oldEndIndex) {
      toRemove.push(i)
      i += oldDom[i].childCount
      i++
    }
    patches.push({
      type: DiffDomType.Remove,
      nodes: toRemove,
    })
  }
  return patches
}

export const diffDom = (oldDom, newDom) => {
  const lengthA = oldDom.length
  const lengthB = newDom.length
  const patches = []
  diffDomInternal(patches, oldDom, 0, lengthA, newDom, 0, lengthB)
  return patches
}
