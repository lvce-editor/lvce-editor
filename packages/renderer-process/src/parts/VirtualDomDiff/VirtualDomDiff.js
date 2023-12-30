import { renderInternal } from '../VirtualDom/VirtualDom.js'
import * as VirtualDomElementProp from '../VirtualDomElementProp/VirtualDomElementProp.js'

const insert = ($Node, diffItem, eventMap) => {
  renderInternal($Node, diffItem.nodes, eventMap)
}

export const renderDiff = ($Root, diff, eventMap = {}) => {
  const iter = document.createNodeIterator($Root, NodeFilter.SHOW_ALL)
  let i = 0
  let $Node = iter.nextNode()
  console.log({ diff, eventMap })
  for (let diffIndex = 0; diffIndex < diff.length; diffIndex++) {
    const diffItem = diff[diffIndex]
    while (i <= diffItem.index) {
      $Node = iter.nextNode()
      i++
    }
    // console.log({ $Node, index:df  })
    switch (diffItem.type) {
      case 'updateProp':
        VirtualDomElementProp.setProp($Node, diffItem.key, diffItem.value, eventMap)
        break
      case 'insert':
        insert($Node, diffItem, eventMap)
        break
      default:
        break
    }
  }
}
