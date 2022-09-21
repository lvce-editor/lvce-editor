import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'

const patchProps = (changes, i, oldProps, newProps) => {
  for (const key in newProps) {
    const next = newProps[key]
    const prev = oldProps[key]
    if (next !== prev) {
      return changes.push({
        index: i,
        operation: VirtualDomDiffType.AttributeSet,
        key,
        value: next,
      })
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      changes.push({
        index: i,
        operation: VirtualDomDiffType.AttributeRemove,
        key,
      })
    }
  }
}

const unMountChildren = (changes, commonLength, oldLength, oldDom) => {
  if (commonLength === 0) {
    changes.push({
      index: commonLength,
      operation: VirtualDomDiffType.ElementRemoveAll,
    })
  } else {
    let total = 0
    for (let i = commonLength; i > 0; i--) {
      const node = oldDom[i]
      total -= node.childCount
      total++
      if (total < 0) {
        total += node.childCount
        break
      }
    }
    changes.push({
      index: commonLength,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: total,
    })
  }
}

const mountChildren = (changes, newDom, commonLength, count) => {
  changes.push({
    operation: VirtualDomDiffType.ElementsAdd,
    newDom: newDom.slice(commonLength, commonLength + count),
  })
}

export const diff = (oldDom, newDom) => {
  const changes = []
  const oldLength = oldDom.length
  const newLength = newDom.length
  const commonLength = Math.min(oldLength, newLength)
  // let oldIndex = 0
  // let newIndex = 0
  for (let i = 0; i < commonLength; i++) {
    const oldNode = oldDom[i]
    const newNode = newDom[i]
    // if (oldNode.childCount !== newNode.childCount) {
    //   // TODO diff children
    // }
    // oldIndex += oldNode.childCount
    // newIndex += newNode.childCount
    patchProps(changes, i, oldNode.props, newNode.props)
  }
  if (oldLength > newLength) {
    unMountChildren(changes, commonLength, oldLength, oldDom)
  } else if (newLength > oldLength) {
    mountChildren(changes, newDom, commonLength, newLength - oldLength)
  }
  return changes
}
