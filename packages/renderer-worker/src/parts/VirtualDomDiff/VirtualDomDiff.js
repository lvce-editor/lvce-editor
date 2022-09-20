import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'

const isEqualProps = (oldProps, newProps) => {
  for (const key in newProps) {
    const next = newProps[key]
    const prev = oldProps[key]
    if (next !== prev) {
      return false
    }
  }
  for (const key in oldProps) {
  }
  const oldKeys = Object.keys(oldProps)
}

const isEqualElement = (oldNode, newNode) => {
  return oldNode.type === newNode.type
}

const patchChildren = (oldDom, newDom, i, j) => {}

const patchProps = (changes, oldProps, newProps) => {
  for (const key in newProps) {
    const next = newProps[key]
    const prev = oldProps[key]
    if (next !== prev) {
      return changes.push({
        path: 0,
        operation: VirtualDomDiffType.AttributeSet,
        key,
        value: next,
      })
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      changes.push({
        path: 0,
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
  for (let i = 0; i < count; i++) {
    changes.push({
      operation: VirtualDomDiffType.ElementAdd,
      ...newDom[i + commonLength],
    })
  }
}

export const diff = (oldDom, newDom) => {
  const changes = []
  const oldLength = oldDom.length
  const newLength = newDom.length
  const commonLength = Math.min(oldLength, newLength)
  for (let i = 0; i < commonLength; i++) {
    const oldNode = oldDom[i]
    const newNode = newDom[i]
    patchProps(changes, oldNode.props, newNode.props)
  }
  if (oldLength > newLength) {
    unMountChildren(changes, oldLength - newLength)
  } else {
    mountChildren(changes, newDom, commonLength, newLength - oldLength)
  }
  return changes
}
