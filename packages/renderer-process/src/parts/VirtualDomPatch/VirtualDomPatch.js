import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

const patchMountElements = ($Root, patch) => {
  VirtualDom.renderInternal($Root, patch.newDom)
}

const patchAttributeRemove = ($Node, patch) => {
  $Node.removeAttribute(patch.key)
}

const patchAttributeSet = ($Node, patch) => {
  if (patch.key === 'text') {
    $Node.nodeValue = patch.value
  } else {
    $Node[patch.key] = patch.value
  }
}

const patchElementsRemove = ($Node, patch) => {
  const $Parent = $Node.parentNode
  const $NewChildren = [...$Parent.children].slice(0, patch.keepCount)
  $Parent.replaceChildren(...$NewChildren)
}

export const patch = ($Root, patches) => {
  const iter = document.createNodeIterator($Root, NodeFilter.SHOW_ALL)
  let $Node
  let i = 0
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
      case VirtualDomDiffType.ElementsRemove:
        patchElementsRemove($Node, patch)
        break
      default:
        throw new Error(`unsupported patch type ${patch.operation}`)
    }
    // console.log('after', $Node.innerHTML, patch)
  }
}
