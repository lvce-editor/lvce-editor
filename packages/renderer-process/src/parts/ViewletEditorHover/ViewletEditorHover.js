import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as SetInnerHtml from '../SetInnerHtml/SetInnerHtml.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorHover'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
}

export const setHover = (state, sanitzedHtml, documentation) => {
  const { $Viewlet } = state
  const $DisplayString = document.createElement('div')
  $DisplayString.className = 'HoverDisplayString'
  $DisplayString.role = AriaRoles.Code
  SetInnerHtml.setInnerHtml($DisplayString, sanitzedHtml)
  const $Documentation = document.createElement('div')
  $Documentation.className = 'HoverDocumentation'
  $Documentation.textContent = documentation
  $Viewlet.append($DisplayString, $Documentation)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const setBounds = (state, x, y) => {
  const { $Viewlet } = state
  SetBounds.setXAndYTransform($Viewlet, x, -y)
}
