import * as VirtualDomElement from '../VirtualDomElement/VirtualDomElement.js'
import * as VirtualDomElementProps from '../VirtualDomElementProps/VirtualDomElementProps.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

/**
 *
 * @param {any[]} elements
 * @returns
 */
export const renderInternal = ($Parent, elements) => {
  const max = elements.length - 1
  let stack = []
  for (let i = max; i >= 0; i--) {
    const element = elements[i]
    const $Element = VirtualDomElement.render(element)
    if (element.childCount > 0) {
      // @ts-ignore
      $Element.append(...stack.slice(0, element.childCount))
      stack = stack.slice(element.childCount)
    }
    stack.unshift($Element)
  }
  $Parent.append(...stack)
}

const isEqualNodeName = ($Node, node) => {
  if ($Node.nodeName === 'BUTTON' && node.type === VirtualDomElements.Button) {
    return true
  }

  return false
}

export const renderInto = ($Parent, dom) => {
  $Parent.textContent = ''
  renderInternal($Parent, dom)
}

export const renderIncremental = ($Parent, dom) => {
  if ($Parent.textContent === '') {
    renderInternal($Parent, dom)
    return
  }
  // TODO
  console.log({ dom })
  const oldCount = $Parent.children.length
  let $Node = $Parent
  for (let i = 0; i < dom.length; i++) {
    const node = dom[i]
    if (!$Node) {
      $Parent.append
    }
    console.log({ $Node, node })
    console.log($Node.nodeValue, node.text)

    if ($Node.nodeValue !== node.props.text && node.props.text) {
      $Node.nodeValue = node.props.text
    }
    if ($Node.title !== node.props.title && node.props.title) {
      $Node.title = node.props.title
    }
  }
  // const newCount = dom
  // const $Root = render(dom)
  // $Parent.replaceChildren(...$Root.children)
}

/**
 *
 * @param {any[]} elements
 * @returns
 */
export const render = (elements) => {
  const $Root = document.createElement('div')
  renderInternal($Root, elements)
  return $Root
}

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
        VirtualDomElementProps.setProp($Node, diffItem.key, diffItem.value)
        break
      case 'insert':
        insert($Node, diffItem)
        break
      default:
        break
    }
  }
}
