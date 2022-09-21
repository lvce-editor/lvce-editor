import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'
import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const patchProps = (changes, i, oldProps, newProps) => {
  for (const key in newProps) {
    const next = newProps[key]
    const prev = oldProps[key]
    if (next !== prev) {
      return changes.push({
        path: i,
        operation: VirtualDomDiffType.AttributeSet,
        key,
        value: next,
      })
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      changes.push({
        path: i,
        operation: VirtualDomDiffType.AttributeRemove,
        key,
      })
    }
  }
}

const unMountChildren = (changes, count) => {
  changes.push({
    operation: VirtualDomDiffType.ElementRemove,
    count,
  })
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
    unMountChildren(changes, oldLength - newLength)
  } else {
    mountChildren(changes, newDom, commonLength, newLength - oldLength)
  }
  return changes
}
