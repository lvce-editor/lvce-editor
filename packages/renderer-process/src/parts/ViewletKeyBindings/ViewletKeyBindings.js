import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletkeyBindingsEvents from './ViewletKeyBindingsEvents.js'

export const name = 'KeyBindings'

export const create = () => {
  const $InputBox = InputBox.create()
  $InputBox.type = 'search'
  $InputBox.placeholder = 'Search Key Bindings' // TODO placeholder string should come from renderer worker
  $InputBox.oninput = ViewletkeyBindingsEvents.handleInput

  const $KeyBindingsHeader = document.createElement('div')
  $KeyBindingsHeader.className = 'KeyBindingsHeader'
  $KeyBindingsHeader.append($InputBox)

  const $KeyBindingsTableWrapper = document.createElement('table')
  $KeyBindingsTableWrapper.className = 'KeyBindingsTableWrapper'
  $KeyBindingsTableWrapper.addEventListener(
    'wheel',
    ViewletkeyBindingsEvents.handleWheel,
    { passive: true }
  )

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'KeyBindings'
  $Viewlet.append($KeyBindingsHeader, $KeyBindingsTableWrapper)

  return {
    $Viewlet,
    $InputBox,
    $KeyBindingsHeader,
    $KeyBindingsTableWrapper,
  }
}

const renderDomTextNode = (element) => {
  return document.createTextNode(element.props.text)
}

const setProps = ($Element, props) => {
  for (const [key, value] of Object.entries(props)) {
    $Element[key] = value
  }
}

const renderDomElement = (element) => {
  const { type, children, props } = element
  const $Element = document.createElement(type)
  setProps($Element, props)
  const $Child = renderDomElementFragment(children)
  $Element.append($Child)
  return $Element
}

const DomFlags = {
  Element: 1,
  TextNode: 2,
}

const renderDom = (element) => {
  switch (element.flags) {
    case DomFlags.TextNode:
      return renderDomTextNode(element)
    case DomFlags.Element:
      return renderDomElement(element)
  }
}

const renderDomElementFragment = (elements) => {
  const $Fragment = document.createDocumentFragment()
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    switch (element.flags) {
      case DomFlags.TextNode:
        $Fragment.append(renderDomTextNode(element))
        break
      case DomFlags.Element:
        $Fragment.append(renderDomElement(element))
        break
    }
  }
  // const $Elements=[]
  // for(const element of elements)
  console.log({ elements })
  // const $Fragment = document.createDocumentFragment()
  // for (const element of elements) {
  //   if (element) {
  //     const $Element = renderDom(element)
  //     $Fragment.append($Element)
  //   }
  // }
  // return $Fragment
}

const replaceChildren = ($Element, $NewChildren) => {
  $Element.replaceChildren($NewChildren)
}

export const setTableDom = (state, dom) => {
  const { $KeyBindingsTableWrapper } = state
  const $Fragment = renderDomElementFragment(dom)
  replaceChildren($KeyBindingsTableWrapper, $Fragment)
}
