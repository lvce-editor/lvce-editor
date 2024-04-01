import * as Assert from '../Assert/Assert.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletSourceControlEvents from './ViewletSourceControlEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet SourceControl'
  $Viewlet.tabIndex = 0
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.Click]: ViewletSourceControlEvents.handleClick,
    [DomEventType.ContextMenu]: ViewletSourceControlEvents.handleContextMenu,
    [DomEventType.MouseOver]: ViewletSourceControlEvents.handleMouseOver,
    [DomEventType.MouseOut]: ViewletSourceControlEvents.handleMouseOut,
  })
  $Viewlet.addEventListener(DomEventType.Input, ViewletSourceControlEvents.handleInput, {
    capture: true,
  })
  $Viewlet.addEventListener(DomEventType.Focus, ViewletSourceControlEvents.handleFocus, {
    capture: true,
  })
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletSourceControlEvents.handleWheel, {
    passive: true,
  })
}

export const dispose = () => {}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const setError = (state, error) => {
  Assert.object(state)
  Assert.string(error)
  const $Error = document.createElement('div')
  $Error.className = 'Error'
  $Error.textContent = error
  const { $ViewletTree } = state
  $ViewletTree.append($Error)
}

export const setInputValue = (state, value) => {
  // const { $ViewSourceControlInput } = state
  // $ViewSourceControlInput.value = value
}

export const focus = (state) => {
  const { $Viewlet } = state
  $Viewlet.querySelector('input').focus()
}
