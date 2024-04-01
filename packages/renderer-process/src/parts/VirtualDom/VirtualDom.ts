import * as Assert from '../Assert/Assert.ts'
import * as ClearNode from '../ClearNode/ClearNode.ts'
import * as VirtualDomElement from '../VirtualDomElement/VirtualDomElement.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
/**
 *
 * @param {any[]} elements
 * @returns
 */
export const renderInternal = ($Parent, elements, eventMap) => {
  const max = elements.length - 1
  let stack = []
  for (let i = max; i >= 0; i--) {
    const element = elements[i]
    const $Element = VirtualDomElement.render(element, eventMap)
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

export const renderInto = ($Parent, dom, eventMap = {}) => {
  Assert.array(dom)
  ClearNode.clearNode($Parent)
  renderInternal($Parent, dom, eventMap)
}

export const renderIncremental = ($Parent, dom) => {
  if ($Parent.textContent === '') {
    renderInternal($Parent, dom)
    return
  }
  // TODO
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
