import { findIndex } from '../../shared/findIndex.js'
import * as Focus from '../Focus/Focus.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Assert from '../Assert/Assert.js'

const getFileName = (file) => {
  return file.slice(file.lastIndexOf('/') + 1)
}

const create$Item = (item) => {
  const $Item = document.createElement('li')
  $Item.className = 'TreeItem'
  $Item.textContent = getFileName(item.file)
  $Item.title = `${item.file}`
  // TODO use same virtual list as for explorer
  $Item.style.position = 'relative'
  return $Item
}

const handleFocus = () => {
  Focus.setFocus('sourceControlInput')
}

const handleClick = (event) => {
  const $Target = event.target
  const $Parent = $Target.closest('.ViewletTree')
  const index = findIndex($Parent, $Target)
  // TODO ignore when index === -1
  RendererWorker.send(
    /* viewletCommand */ 2133,
    /* viewletId */ 'Source Control',
    /* type */ 'handleClick',
    /* index */ index
  )
}

const getPlaceHolderText = () => {
  return `Message (${KeyBindings.lookupKeyBinding(
    'scm.acceptInput'
  )} to commit on 'master'`
}

export const create = () => {
  const $ViewSourceControlInput = InputBox.create()
  $ViewSourceControlInput.placeholder = getPlaceHolderText()
  $ViewSourceControlInput.onfocus = handleFocus
  $ViewSourceControlInput.ariaLabel = 'Source Control Input'
  const $ViewletTree = document.createElement('ul')
  $ViewletTree.className = 'ViewletTree'
  $ViewletTree.onclick = handleClick
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
  state.$ViewletTree.append(...$$Entries)
}

export const setError = (state, error) => {
  Assert.object(state)
  Assert.string(error)
  const $Error = document.createElement('div')
  $Error.className = 'Error'
  $Error.textContent = error
  state.$ViewletTree.append($Error)
}

export const setInputValue = (state, value) => {
  const { $ViewSourceControlInput } = state
  $ViewSourceControlInput.value = value
}

export const focus = (state) => {
  state.$ViewSourceControlInput.focus()
}
