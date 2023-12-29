import { renderInternal } from '../VirtualDom/VirtualDom.js'
import * as VirtualDomElementProp from '../VirtualDomElementProp/VirtualDomElementProp.js'

const insert = ($Node, diffItem) => {
  renderInternal($Node, diffItem.nodes)
}

export const renderDiff = ($Root, diff) => {
  const iter = document.createNodeIterator($Root, NodeFilter.SHOW_ALL)
  let i = 0
  let $Node = iter.nextNode()
  console.log({ diff })
  for (let diffIndex = 0; diffIndex < diff.length; diffIndex++) {
    const diffItem = diff[diffIndex]
    while (i <= diffItem.index) {
      $Node = iter.nextNode()
      i++
    }
    switch (diffItem.type) {
      case 'updateProp':
        VirtualDomElementProp.setProp($Node, diffItem.key, diffItem.value)
        break
      case 'insert':
        insert($Node, diffItem)
        break
      default:
        break
    }
  }
}
