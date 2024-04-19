import { renderInternal } from '../VirtualDom/VirtualDom.ts'
import * as VirtualDomElementProp from '../VirtualDomElementProp/VirtualDomElementProp.ts'

const insert = ($Node, diffItem, eventMap) => {
  renderInternal($Node, diffItem.nodes, eventMap)
}

export const renderDiff = ($Root, diff, eventMap = {}) => {
  const iter1 = document.createNodeIterator($Root, NodeFilter.SHOW_ALL)
  const list = []
  let $Node1
  while (($Node1 = iter1.nextNode())) {
    // @ts-expect-error
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
        VirtualDomElementProp.setProp($Node as HTMLElement, diffItem.key, diffItem.value, eventMap)
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
      for (const index of diffItem.nodes) {
        toRemove.push(list[index + 1])
      }
    }
  }
  for (const $Node of toRemove) {
    // @ts-expect-error
    $Node.remove()
  }
}
