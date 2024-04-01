import * as VirtualDomElementProp from '../VirtualDomElementProp/VirtualDomElementProp.ts'
export * as Events from './ViewletRunAndDebugEvents.ts'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet RunAndDebug'
  $Viewlet.tabIndex = 0
  return {
    $Viewlet,
  }
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
        // @ts-ignore
        VirtualDomElementProp.setProp(node, diffItem.key, diffItem.value)
        break
      default:
        break
    }
  }
}
