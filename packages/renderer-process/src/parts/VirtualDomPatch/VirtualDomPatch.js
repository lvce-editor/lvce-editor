import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

const patchMountElements = ($Root, patch) => {
  VirtualDom.renderInternal($Root, patch.newDom)
}

export const patch = ($Root, patches) => {
  for (const patch of patches) {
    switch (patch.operation) {
      case VirtualDomDiffType.ElementsAdd:
        patchMountElements($Root, patch)
        break
      default:
        break
    }
  }
}
