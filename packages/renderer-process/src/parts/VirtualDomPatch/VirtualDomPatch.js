import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

const patchMountElements = ($Root, patch) => {
  VirtualDom.renderInternal($Root, patch.newDom)
}

const patchAttributeRemove = ($Node, patch) => {
  $Node.removeAttribute(patch.key)
}

const patchAttributeSet = ($Node, patch) => {
  $Node.setAttribute(patch.key, patch.value)
}

export const patch = ($Root, patches) => {
  const iter = document.createNodeIterator($Root, NodeFilter.SHOW_ALL)
  let $Node
  let i = -1
  for (const patch of patches) {
    do {
      $Node = iter.nextNode()
    } while (i++ < patch.index)
    switch (patch.operation) {
      case VirtualDomDiffType.ElementsAdd:
        patchMountElements($Node, patch)
        break
      case VirtualDomDiffType.AttributeRemove:
        patchAttributeRemove($Node, patch)
        break
      case VirtualDomDiffType.AttributeSet:
        patchAttributeSet($Node, patch)
        break
      default:
        break
    }
    // console.log('after', $Node.innerHTML, patch)
  }
}
