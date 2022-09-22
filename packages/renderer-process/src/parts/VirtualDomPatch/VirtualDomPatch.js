import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDomPatchFunctions from '../VirtualDomPatchFunctions/VirtualDomPatchFunctions.js'

const getFn = (operation) => {
  switch (operation) {
    case VirtualDomDiffType.ElementsAdd:
      return VirtualDomPatchFunctions.elementsAdd
    case VirtualDomDiffType.AttributeRemove:
      return VirtualDomPatchFunctions.attributeRemove
    case VirtualDomDiffType.AttributeSet:
      return VirtualDomPatchFunctions.attributeSet
    case VirtualDomDiffType.ElementsRemove:
      return VirtualDomPatchFunctions.elementsRemove
    case VirtualDomDiffType.ElementIdSetStyle:
      return VirtualDomPatchFunctions.elementIdSetStyle
    case VirtualDomDiffType.AttributeRemoveNth:
      return VirtualDomPatchFunctions.attributeRemoveNth
    case VirtualDomDiffType.SetElementId:
      return VirtualDomPatchFunctions.setElementId
    case VirtualDomDiffType.SetElementIdNth:
      return VirtualDomPatchFunctions.setElementIdNth
    case VirtualDomDiffType.RemoveId:
      return VirtualDomPatchFunctions.removeId
    case VirtualDomDiffType.RemoveIdNth:
      return VirtualDomPatchFunctions.removeIdNth
    case VirtualDomDiffType.SetHeight:
      return VirtualDomPatchFunctions.setHeight
    default:
      throw new Error(`unsupported patch type ${operation}`)
  }
}

export const patchElement = ($Node, patch) => {
  const fn = getFn(patch.operation)
  fn($Node, patch)
}

export const patch = ($Root, patches) => {
  const iter = document.createNodeIterator($Root, NodeFilter.SHOW_ALL)
  let $Node
  let i = 0
  for (const patch of patches) {
    do {
      $Node = iter.nextNode()
    } while (i++ < patch.index)
    patchElement($Node, patch)
    // console.log('after', $Node.innerHTML, patch)
  }
}
