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
        type: VirtualDomDiffType.AttributeSet,
        key,
        value: next,
      })
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      changes.push({
        path: 0,
        type: VirtualDomDiffType.AttributeRemove,
        key,
      })
    }
  }
}

export const diff = (oldDom, newDom) => {
  const changes = []
  const length = oldDom.length
  for (let i = 0; i < length; i++) {
    const oldNode = oldDom[i]
    const newNode = newDom[i]
    patchProps(changes, oldNode.props, newNode.props)
  }
  return changes
}
