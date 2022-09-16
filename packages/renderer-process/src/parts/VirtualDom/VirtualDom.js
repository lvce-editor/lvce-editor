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
export const renderInternal = ($Parent, elements, startIndex) => {
  let i = startIndex
  const element = elements[i]
  for (let i = 0; i < elements.length; i++) {
    const element1 = elements[i]
    const $Element1 = renderElement(element1)
    for (let j = 0; j < element1.childCount; j++) {
      i++
      const element2 = elements[i]
      const $Element2 = renderElement(element2)
      $Element1.append($Element2)
      for (let l = 0; l < element2.childCount; l++) {
        i++
        const element3 = elements[i]
        const $Element3 = renderElement(element3)
        $Element2.append($Element3)
        for (let m = 0; m < element3.childCount; m++) {
          i++
          const element4 = elements[i]
          const $Element4 = renderElement(element4)
          $Element3.append($Element4)
          for (let n = 0; n < element4.childCount; n++) {
            i++
            const element5 = elements[i]
            const $Element5 = renderElement(element5)
            $Element4.append($Element5)
            for (let o = 0; o < element5.childCount; o++) {
              i++
              const element6 = elements[i]
              const $Element6 = renderElement(element6)
              $Element5.append($Element6)
            }
          }
        }
      }
    }
    $Parent.append($Element1)
  }
  return i
}
/**
 *
 * @param {any[]} elements
 * @returns
 */
export const render = (elements) => {
  const $Root = document.createElement('div')
  renderInternal($Root, elements, 0)
  return $Root
}
