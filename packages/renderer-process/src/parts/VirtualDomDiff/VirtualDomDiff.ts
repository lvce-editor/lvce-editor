import { renderInternal } from '../VirtualDom/VirtualDom.ts'
import * as VirtualDomElementProp from '../VirtualDomElementProp/VirtualDomElementProp.js'

const insert = ($Node, diffItem, eventMap) => {
  renderInternal($Node, diffItem.nodes, eventMap)
}

export const renderDiff = ($Root, diff, eventMap = {}) => {
  const iter1 = document.createNodeIterator($Root, NodeFilter.SHOW_ALL)
  const list = []
  let $Node1
  while (($Node1 = iter1.nextNode())) {
    list.push($Node1)
  }
  const iter = document.createNodeIterator($Root, NodeFilter.SHOW_ALL)
  let i = 0
  let $Node = iter.nextNode()
  for (let diffIndex = 0; diffIndex < diff.length; diffIndex++) {
    const diffItem = diff[diffIndex]
    while (i <= diffItem.index) {
      $Node = iter.nextNode()
      i++
    }
    switch (diffItem.type) {
      case 'updateProp':
        // @ts-ignore
        VirtualDomElementProp.setProp($Node, diffItem.key, diffItem.value, eventMap)
        break
      case 'insert':
        insert($Node, diffItem, eventMap)
        break
      default:
        break
    }
  }
  /**
   * @type {any}
   */
  const toRemove = []
  for (const diffItem of diff) {
    if (diffItem.type === 'remove') {
      console.log({ list, nodes: diffItem.nodes })
      for (const index of diffItem.nodes) {
        toRemove.push(list[index + 1])
      }
    }
  }
  for (const $Node of toRemove) {
    $Node.remove()
  }
}
