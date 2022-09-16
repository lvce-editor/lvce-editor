import * as VirtualDomElement from '../VirtualDomElement/VirtualDomElement.js'

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
  renderInternal($Root, elements)
  return $Root
}
