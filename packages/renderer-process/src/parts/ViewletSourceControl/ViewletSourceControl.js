import * as Assert from '../Assert/Assert.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletSourceControlEvents from './ViewletSourceControlEvents.js'

const getPlaceHolderText = () => {
  return `Message (${KeyBindings.lookupKeyBinding('scm.acceptInput')} to commit on 'master'`
}

export const create = () => {
  const $ViewSourceControlInput = InputBox.create()
  $ViewSourceControlInput.placeholder = getPlaceHolderText()
  $ViewSourceControlInput.ariaLabel = 'Source Control Input'

  const $SourceControlHeader = document.createElement('div')
  $SourceControlHeader.className = 'SourceControlHeader'
  $SourceControlHeader.append($ViewSourceControlInput)

  const $ViewletTree = document.createElement('div')
  $ViewletTree.className = 'SourceControlItems'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet SourceControl'
  $Viewlet.tabIndex = 0
  $Viewlet.append($SourceControlHeader, $ViewletTree)
  return {
    $Viewlet,
    $ViewletTree,
    $ViewSourceControlInput,
  }
}

export const attachEvents = (state) => {
  const { $ViewletTree, $ViewSourceControlInput } = state
  AttachEvents.attachEvents($ViewSourceControlInput, {
    [DomEventType.Focus]: ViewletSourceControlEvents.handleFocus,
    [DomEventType.Input]: ViewletSourceControlEvents.handleInput,
  })
  AttachEvents.attachEvents($ViewletTree, {
    [DomEventType.Click]: ViewletSourceControlEvents.handleClick,
    [DomEventType.ContextMenu]: ViewletSourceControlEvents.handleContextMenu,
    [DomEventType.MouseOver]: ViewletSourceControlEvents.handleMouseOver,
    [DomEventType.MouseOut]: ViewletSourceControlEvents.handleMouseOut,
  })
}

export const dispose = () => {}

export const setItemsDom = (state, dom) => {
  const { $ViewletTree } = state
  VirtualDom.renderInto($ViewletTree, dom)
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
  const { $ViewSourceControlInput } = state
  $ViewSourceControlInput.value = value
}

export const focus = (state) => {
  const { $ViewSourceControlInput } = state
  $ViewSourceControlInput.focus()
}
