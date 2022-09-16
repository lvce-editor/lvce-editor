import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ElementTagMap from '../ElementTagMap/ElementTagMap.js'

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
  const tag = ElementTagMap.getElementTag(type)
  const $Element = document.createElement(tag)
  setProps($Element, props)
  return $Element
}

export const render = (element) => {
  switch (element.type) {
    case VirtualDomElements.Text:
      return renderDomTextNode(element)
    default:
      return renderDomElement(element)
  }
}
