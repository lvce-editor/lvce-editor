import * as ElementTagMap from '../ElementTagMap/ElementTagMap.js'
import * as VirtualDomElementProps from '../VirtualDomElementProps/VirtualDomElementProps.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const renderDomTextNode = (element) => {
  return document.createTextNode(element.props.text)
}

const renderDomElement = (element, events) => {
  const { type, props } = element
  const tag = ElementTagMap.getElementTag(type)
  const $Element = document.createElement(tag)
  VirtualDomElementProps.setProps($Element, props, events)
  return $Element
}

export const render = (element, events) => {
  switch (element.type) {
    case VirtualDomElements.Text:
      return renderDomTextNode(element)
    default:
      return renderDomElement(element, events)
  }
}
