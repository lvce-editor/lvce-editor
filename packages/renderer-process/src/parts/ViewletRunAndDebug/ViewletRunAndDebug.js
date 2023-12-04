import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletDebugEvents from './ViewletRunAndDebugEvents.js'
import * as VirtualDomElementProp from '../VirtualDomElementProp/VirtualDomElementProp.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet RunAndDebug'
  $Viewlet.tabIndex = 0
  $Viewlet.onpointerdown = ViewletDebugEvents.handlePointerDown

  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const setPatches = (state, diff) => {
  const { $Viewlet } = state
  const iter = document.createNodeIterator($Viewlet, NodeFilter.SHOW_ALL)
  let i = 0
  let node = iter.nextNode()
  for (let diffIndex = 0; diffIndex < diff.length; diffIndex++) {
    const diffItem = diff[diffIndex]
    while (i <= diffItem.index) {
      node = iter.nextNode()
      i++
    }
    switch (diffItem.type) {
      case 'updateProp':
        VirtualDomElementProp.setProp(node, diffItem.key, diffItem.value)
        break
      default:
        break
    }
  }
}
