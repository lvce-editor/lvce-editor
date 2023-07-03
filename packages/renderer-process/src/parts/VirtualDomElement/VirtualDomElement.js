import * as ElementTagMap from '../ElementTagMap/ElementTagMap.js'
import * as VirtualDomElementProps from '../VirtualDomElementProps/VirtualDomElementProps.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const renderDomTextNode = (element) => {
  return document.createTextNode(element.text)
}

const renderDomElement = (element) => {
  const tag = ElementTagMap.getElementTag(element.type)
  const $Element = document.createElement(tag)
  VirtualDomElementProps.setProps($Element, element)
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
