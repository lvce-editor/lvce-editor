import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
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

  const $ViewletTree = document.createElement('div')
  $ViewletTree.className = 'SourceControlItems'
  $ViewletTree.onclick = ViewletSourceControlEvents.handleClick

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet SourceControl'
  $Viewlet.tabIndex = 0
  $Viewlet.append($ViewSourceControlInput, $ViewletTree)
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
