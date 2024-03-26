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
  const aProps = a
  const bProps = b
  for (const propA in aProps) {
    if (propA in bProps) {
      if (propA === 'childCount' || propA === 'type') {
        continue
      }
      if (aProps[propA] !== bProps[propA]) {
        patches.push({
          type: DiffDomType.UpdateProp,
          key: propA,
          value: bProps[propA],
          index,
        })
      }
    } else {
      patches.push({ type: DiffDomType.RemoveProp, key: propA, index })
    }
  }
}

const diffDomInternal = (patches, oldNodeMap, oldDom, oldStartIndex, oldEndIndex, newNodeMap, newDom, newStartIndex, newEndIndex) => {
  let i = oldStartIndex
  let j = newStartIndex
  while (i < oldEndIndex && j < newEndIndex) {
    const a = oldDom[i]
    const b = newDom[j]
    if (a === b) {
    } else if (a.type === b.type) {
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
          diffDomInternal(patches, oldNodeMap, oldDom, i + 1, i + oldTotal + 1, newNodeMap, newDom, j + 1, j + newTotal + 1)
          i += oldTotal
          j += newTotal
        }
      }
    } else if (a.key in newNodeMap) {
      const totalChildCount = GetTotalChildCount.getTotalChildCount(newDom, j)
      patches.push({
        index: i,
        type: DiffDomType.Insert,
        nodes: newDom.slice(j, j + totalChildCount + 1),
      })
      j += totalChildCount + 1
    } else {
      // console.log({ a, b })
      // replace a with b
      const totalChildCount = GetTotalChildCount.getTotalChildCount(newDom, j)
      const oldTotal = GetTotalChildCount.getTotalChildCount(oldDom, i)
      patches.push({
        index: i,
        type: DiffDomType.Replace,
        nodes: newDom.slice(j, j + totalChildCount + 1),
      })
      i += oldTotal
      j += totalChildCount
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

const createNodeMap = (nodes) => {
  const nodeMap = Object.create(null)
  for (const node of nodes) {
    if (node.key) {
      nodeMap[node.key] = node
    }
  }
  return nodeMap
}

export const diffDom = (oldDom, newDom) => {
  const lengthA = oldDom.length
  const lengthB = newDom.length
  const patches = []
  const oldNodeMap = createNodeMap(oldDom)
  const newNodeMap = createNodeMap(newDom)
  diffDomInternal(patches, oldNodeMap, oldDom, 0, lengthA, newNodeMap, newDom, 0, lengthB)
  return patches
}
