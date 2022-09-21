import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

const patchMountElements = ($Root, patch) => {
  VirtualDom.renderInternal($Root, patch.newDom)
}

const patchAttributeRemove = ($Root, patch) => {
  const $Child = $Root.children[patch.index]
  $Child.removeAttribute(patch.key)
}

const patchAttributeSet = ($Root, patch) => {
  const $Child = $Root.children[patch.index]
  $Child.setAttribute(patch.key, patch.value)
}

export const patch = ($Root, patches) => {
  for (const patch of patches) {
    switch (patch.operation) {
      case VirtualDomDiffType.ElementsAdd:
        patchMountElements($Root, patch)
        break
      case VirtualDomDiffType.AttributeRemove:
        patchAttributeRemove($Root, patch)
        break
      case VirtualDomDiffType.AttributeSet:
        patchAttributeSet($Root, patch)
        break
      default:
        break
    }
  }
}
