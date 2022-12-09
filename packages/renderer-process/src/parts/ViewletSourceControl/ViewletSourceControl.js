import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as ViewletSourceControlEvents from './ViewletSourceControlEvents.js'

const getFileName = (file) => {
  return file.slice(file.lastIndexOf('/') + 1)
}

const create$Item = (item) => {
  const $Item = document.createElement('div')
  $Item.role = AriaRoles.TreeItem
  $Item.className = 'TreeItem'
  $Item.textContent = getFileName(item.file)
  $Item.title = `${item.file}`
  // TODO use same virtual list as for explorer
  $Item.style.position = 'relative'
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
  $ViewletTree.append(...$$Entries)
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
