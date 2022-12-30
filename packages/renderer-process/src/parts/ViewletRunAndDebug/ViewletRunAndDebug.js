import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletDebugEvents from './ViewletRunAndDebugEvents.js'
import * as VirtualDomElementProps from '../VirtualDomElementProps/VirtualDomElementProps.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet RunAndDebug'
  $Viewlet.tabIndex = 0
  $Viewlet.onmousedown = ViewletDebugEvents.handleMouseDown

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
        VirtualDomElementProps.setProp(node, diffItem.key, diffItem.value)
        break
      default:
        break
    }
  }
}
