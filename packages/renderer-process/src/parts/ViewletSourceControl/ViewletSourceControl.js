import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as Logger from '../Logger/Logger.js'
import * as ViewletSourceControlEvents from './ViewletSourceControlEvents.js'

const create$Item = (item) => {
  const $Icon = document.createElement('div')
  $Icon.className = `Icon${item.icon}`

  const $Label = document.createElement('div')
  $Label.className = 'Label'
  $Label.textContent = item.label

  const $Item = document.createElement('div')
  $Item.className = 'TreeItem'
  $Item.role = AriaRoles.TreeItem
  $Item.ariaPosInSet = item.posInSet
  $Item.ariaSetSize = item.setSize
  $Item.title = item.file
  $Item.append($Icon, $Label)
  // TODO use same virtual list as for explorer
  return $Item
}

const getPlaceHolderText = () => {
  return `Message (${KeyBindings.lookupKeyBinding(
    'scm.acceptInput'
  )} to commit on 'master'`
}

export const create = () => {
  const $ViewSourceControlInput = InputBox.create()
  $ViewSourceControlInput.placeholder = getPlaceHolderText()
  $ViewSourceControlInput.onfocus = ViewletSourceControlEvents.handleFocus
  $ViewSourceControlInput.ariaLabel = 'Source Control Input'

  const $SourceControlHeader = document.createElement('div')
  $SourceControlHeader.className = 'SourceControlHeader'
  $SourceControlHeader.append($ViewSourceControlInput)

  const $ViewletTree = document.createElement('div')
  $ViewletTree.className = 'SourceControlItems'
  $ViewletTree.onclick = ViewletSourceControlEvents.handleClick
  $ViewletTree.oncontextmenu = ViewletSourceControlEvents.handleContextMenu
  $ViewletTree.onmouseover = ViewletSourceControlEvents.handleMouseOver

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

export const dispose = () => {}

export const setChangedFiles = (state, workingTree) => {
  Assert.object(state)
  Assert.array(workingTree)
  const $$Entries = workingTree.map(create$Item)
  const { $ViewletTree } = state
  $ViewletTree.replaceChildren(...$$Entries)
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

const create$Button = (button) => {
  const $Button = document.createElement('img')
  $Button.className = 'SourceControlButton'
  $Button.role = 'button'
  $Button.src = button.icon
  $Button.ariaLabel = button.label
  $Button.tabIndex = 0
  return $Button
}

export const setItemButtons = (state, index, buttons) => {
  Assert.number(index)
  Assert.array(buttons)
  const { $ViewletTree } = state
  if (index === -1) {
    return
  }
  const $Item = $ViewletTree.children[index]
  if ($Item.children[2]) {
    return
  }
  if (!$Item) {
    Logger.warn(`no source control item found at index ${index}`)
    return
  }
  // TODO handle icon loading error?
  $Item.append(...buttons.map(create$Button))
}
