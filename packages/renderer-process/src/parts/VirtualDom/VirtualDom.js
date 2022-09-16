import * as VirtualDomFlags from '../VirtualDomFlags/VirtualDomFlags.js'

const renderDomTextNode = (element) => {
  return document.createTextNode(element.props.text)
}

const setProps = ($Element, props) => {
  for (const [key, value] of Object.entries(props)) {
    $Element[key] = value
  }
}

const renderDomElement = (element) => {
  const { type, props } = element
  const $Element = document.createElement(type)
  setProps($Element, props)
  return $Element
}

const renderElement = (element) => {
  switch (element.flags) {
    case VirtualDomFlags.TextNode:
      return renderDomTextNode(element)
    case VirtualDomFlags.Element:
      return renderDomElement(element)
    default:
      throw new Error('unexpected flags')
  }
}

/**
 *
 * @param {any[]} elements
 * @returns
 */
export const renderInternal2 = ($Parent, elements) => {
  const max = elements.length - 1
  let stack = []
  for (let i = max; i >= 0; i--) {
    const element = elements[i]
    const $Element = renderElement(element)
    if (element.childCount > 0) {
      $Element.append(...stack.slice(0, element.childCount))
      stack = stack.slice(element.childCount)
    }
    stack.unshift($Element)
  }
  $Parent.append(...stack)
}
/**
 *
 * @param {any[]} elements
 * @returns
 */
export const render = (elements) => {
  const $Root = document.createElement('div')
  renderInternal2($Root, elements)
  return $Root
}
