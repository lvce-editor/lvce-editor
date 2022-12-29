import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ElementTagMap from '../ElementTagMap/ElementTagMap.js'

const renderDomTextNode = (element) => {
  return document.createTextNode(element.props.text)
}

const setProps = ($Element, props) => {
  for (const key in props) {
    switch (key) {
      case 'maskImage':
        $Element.style.maskImage = `url('${props.maskImage}')`
        $Element.style.webkitMaskImage = `url('${props.maskImage}')`
        break
      case 'paddingLeft':
        $Element.style.paddingLeft = `${props.paddingLeft}px`
        break
      case 'width':
        $Element.style.width = `${props.width}px`
        break
      case 'style':
        throw new Error('style property is not supported')
      default:
        $Element[key] = props[key]
    }
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
