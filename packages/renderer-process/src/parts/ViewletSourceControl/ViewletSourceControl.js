import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as Logger from '../Logger/Logger.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletSourceControlEvents from './ViewletSourceControlEvents.js'

const create$ItemFile = (item) => {
  const $FileIcon = document.createElement('div')
  $FileIcon.className = `FileIcon${item.icon}`

  const $LabelDetail = document.createElement('span')
  $LabelDetail.className = 'LabelDetail'
  $LabelDetail.textContent = item.detail

  const $Label = document.createElement('div')
  $Label.className = 'Label'
  $Label.textContent = item.label
  $Label.append($LabelDetail)

  const $Item = document.createElement('div')
  $Item.className = 'TreeItem'
  $Item.role = AriaRoles.TreeItem
  $Item.ariaPosInSet = item.posInSet
  $Item.ariaSetSize = item.setSize
  $Item.title = item.file
  $Item.append($FileIcon, $Label)

  if (item.decorationIcon) {
    const $DecorationIcon = document.createElement('img')
    $DecorationIcon.className = 'DecorationIcon'
    $DecorationIcon.src = item.decorationIcon
    $DecorationIcon.title = item.decorationIconTitle
    $Item.append($DecorationIcon)
  }
  if (item.decorationStrikeThrough) {
    $Label.classList.add('StrikeThrough')
  }

  // TODO use same virtual list as for explorer
  return $Item
}

const create$ItemDirectory = (item) => {
  console.log('is directory')
  console.log({ item })
  const $Icon = document.createElement('div')
  $Icon.className = 'Chevron'
  $Icon.append(MaskIcon.create(item.icon))

  const $Label = document.createElement('div')
  $Label.className = 'Label'
  $Label.textContent = item.label

  const $Badge = document.createElement('div')
  $Badge.className = 'SourceControlBadge'
  $Badge.textContent = item.badgeCount

  const $Item = document.createElement('div')
  $Item.className = 'TreeItem'
  $Item.role = AriaRoles.TreeItem
  $Item.ariaExpanded = item.type === 'directory-expanded' ? AriaBoolean.True : AriaBoolean.False
  $Item.ariaPosInSet = item.posInSet
  $Item.ariaSetSize = item.setSize
  $Item.append($Icon, $Label, $Badge)

  return $Item
}

const create$Item = (item) => {
  switch (item.type) {
    case 'file':
      return create$ItemFile(item)
    case 'directory':
    case 'directory-expanded':
      return create$ItemDirectory(item)
    default:
      return undefined
  }
}

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

  $ViewSourceControlInput.onfocus = ViewletSourceControlEvents.handleFocus
  $ViewSourceControlInput.oninput = ViewletSourceControlEvents.handleInput

  $ViewletTree.onclick = ViewletSourceControlEvents.handleClick
  $ViewletTree.oncontextmenu = ViewletSourceControlEvents.handleContextMenu
  $ViewletTree.onmouseover = ViewletSourceControlEvents.handleMouseOver
  $ViewletTree.onmouseout = ViewletSourceControlEvents.handleMouseOut
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
  const $Button = IconButton.create$Button(button.label, button.icon)
  $Button.className = 'SourceControlButton'
  return $Button
}

const isLabel = ($Element) => {
  return $Element.className === 'Label'
}

const findLabel = ($Children) => {
  for (const $Child of $Children) {
    if (isLabel($Child)) {
      return $Child
    }
  }
  return undefined
}

const isSourceControlButton = ($Element) => {
  return $Element.className === 'SourceControlButton'
}

const removeItemButtons = ($Label) => {
  let $Node = $Label
  while ($Node) {
    const $Next = $Node.nextElementSibling
    if (isSourceControlButton($Node)) {
      $Node.remove()
    }
    $Node = $Next
  }
}

export const setItemButtons = (state, oldIndex, index, buttons) => {
  Assert.number(index)
  Assert.array(buttons)
  const { $ViewletTree } = state
  if (oldIndex !== -1) {
    const $OldItem = $ViewletTree.children[oldIndex]
    if ($OldItem) {
      const $OldLabel = findLabel($OldItem.children)
      removeItemButtons($OldLabel)
    }
  }
  if (index === -1) {
    return
  }
  const $Item = $ViewletTree.children[index]
  if (!$Item) {
    Logger.warn(`no source control item found at index ${index}`)
    return
  }
  const $Label = findLabel($Item.children)
  if (!$Label) {
    return
  }
  removeItemButtons($Label)
  // TODO handle icon loading error?
  $Label.after(...buttons.map(create$Button))
}
