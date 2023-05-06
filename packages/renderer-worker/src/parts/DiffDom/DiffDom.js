import * as DiffDomType from '../DiffDomType/DiffDomType.js'

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

const isSameTypeAndKey = (a, b) => {
  return a.type === b.type && a.props.key === b.props.key
}

const patchProps = (patches, a, b, i) => {
  const aProps = a.props
  const bProps = b.props
  for (const propA in aProps) {
    if (propA in bProps) {
      if (aProps[propA] !== bProps[propA]) {
        patches.push({ type: DiffDomType.UpdateProp, key: propA, value: bProps[propA], index: i })
      }
    }
  }
}

let i = 0
let j = 0
let h = 0

const diffDomInternal = (oldDom, newDom, patches, lengthA, lengthB) => {
  if (lengthA === 0 && lengthB === 0) {
    return []
  }
  if (h++ > 10) {
    throw new Error('endless loop')
  }
  console.log({ oldDom, newDom, i, lengthA, j, lengthB })
  let endA = i + lengthA - 1
  let endB = j + lengthB - 1
  // if()
  // i++
  // j++

  const min = Math.min(lengthA, lengthB)
  // 1. sync from start
  while (i <= endA && j <= endB) {
    // i++
    // j++
    console.log('sync start')
    const a = oldDom[i]
    const b = newDom[j]
    if (isSameTypeAndKey(a, b)) {
      patchProps(patches, a, b, i)
      i++
      j++
      diffDomInternal(oldDom, newDom, patches, a.childCount, b.childCount)
      continue
    } else {
      break
    }
    i++
    j++
    console.log({ i, j })
  }
  // 2. sync from end
  while (i <= endA && j <= endB) {
    const a = oldDom[endA]
    const b = newDom[endB]
    if (isSameTypeAndKey(a, b)) {
      patchProps(patches, a, b, i)
    } else {
      break
    }
    endA--
    endB--
  }
  console.log({ i, j, endA, endB })
  // 3. common sub sequence + mount
  if (i > endA) {
    if (j <= endB) {
      patches.push({
        type: DiffDomType.Insert,
        nodes: newDom.slice(j, endB + 1),
      })
    }
  }
  // 4. common sub sequence + unmount
  else if (j > endB) {
    if (i <= endA) {
      const toRemove = []
      while (i <= endA) {
        toRemove.push(i)
        i += oldDom[i].childCount
        i++
      }
      patches.push({
        type: DiffDomType.Remove,
        nodes: toRemove,
      })
    }
  }

  // 5. unknown sequence
  else {
    const startA = i
    const startB = j
    // 5.1 build key:index map for newChildren
    const map = Object.create(null)
    for (j = startB; j < endB; j++) {
      const b = newDom[j]
      const key = b.props.key
      if (key) {
        map[key] = j
      }
      j += b.childCount
    }
    console.log({ map })
    // 5.2 loop through old children left to be patched and try to patch
    // matching nodes & remove nodes that are no longer present
    let patched = 0
    const toBePatched = endB - startB + 1
    const newIndexToOldIndexMap = new Uint32Array(toBePatched)
    console.log({ newIndexToOldIndexMap, startA, endA })
    for (i = startA; i <= endA; i++) {
      console.log({ patched, toBePatched })
      if (patched >= toBePatched) {
        continue
      }
      const a = oldDom[i]
      i += a.childCount
      console.log({ a })
      const newIndex = map[a.props.key]
      console.log({ newIndex, i })
      if (newIndex === undefined) {
        patches.push({
          type: DiffDomType.Remove,
          nodes: [i],
        })
      } else {
        newIndexToOldIndexMap[newIndex - startB] = i + 1
        patched++
      }
    }
    // 5.3 move and mount
    // generate longest stable subsequence only when nodes have moved
    console.log({ toBePatched, newIndexToOldIndexMap })
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = startB + i
      const nextChild = newDom[nextIndex]
      if (newIndexToOldIndexMap[i] === 0) {
        patches.push({
          type: DiffDomType.Insert,
          nodes: [nextChild],
        })
      }
    }
    console.log({ map })
  }
  // if (j <= endB) {
  //   patches.push({
  //     type: DiffDomType.Insert,
  //     nodes: newDom.slice(j, endB + 1),
  //   })
  // }
  return patches
}

export const diffDom = (oldDom, newDom) => {
  i = 0
  j = 0
  h = 0
  return diffDomInternal(oldDom, newDom, [], oldDom.length, newDom.length)
}
