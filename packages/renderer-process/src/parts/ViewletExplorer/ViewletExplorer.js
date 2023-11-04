import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as FileIcon from '../FileIcon/FileIcon.js'
import * as Focus from '../Focus/Focus.js' // TODO focus is never needed at start -> use command.execute which lazy-loads focus module
import * as InputBox from '../InputBox/InputBox.js'
import * as Label from '../Label/Label.js'
import * as ViewletExplorerEvents from './ViewletExplorerEvents.js'

const activeId = 'TreeItemActive'
const focusClassName = 'FocusOutline'
const defaultIndent = 1

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Explorer'
  $Viewlet.tabIndex = 0
  $Viewlet.role = AriaRoles.Tree
  $Viewlet.ariaLabel = 'Files Explorer'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  // TODO use the other mouse events that capture automatically
  $Viewlet.addEventListener(DomEventType.MouseEnter, ViewletExplorerEvents.handleMouseEnter, DomEventOptions.Capture)
  $Viewlet.addEventListener(DomEventType.MouseLeave, ViewletExplorerEvents.handleMouseLeave, DomEventOptions.Capture)
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletExplorerEvents.handleWheel, DomEventOptions.Passive)
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.Blur]: ViewletExplorerEvents.handleBlur,
    [DomEventType.Click]: ViewletExplorerEvents.handleClick,
    [DomEventType.ContextMenu]: ViewletExplorerEvents.handleContextMenu,
    [DomEventType.DragOver]: ViewletExplorerEvents.handleDragOver,
    [DomEventType.DragStart]: ViewletExplorerEvents.handleDragStart,
    [DomEventType.Drop]: ViewletExplorerEvents.handleDrop,
    [DomEventType.Focus]: ViewletExplorerEvents.handleFocus,
    [DomEventType.PointerDown]: ViewletExplorerEvents.handlePointerDown,
  })
}

const create$Row = () => {
  const $Row = document.createElement('div')
  $Row.role = AriaRoles.TreeItem
  $Row.className = 'TreeItem'
  $Row.draggable = true
  const $Label = Label.create('')
  const $Icon = FileIcon.create('')
  $Row.append($Icon, $Label)
  return $Row
}

// TODO rename to renderDirent
const render$Row = ($Row, rowInfo) => {
  const $Icon = $Row.childNodes[0]
  const $LabelText = $Row.childNodes[1].childNodes[0]
  FileIcon.setIcon($Icon, rowInfo.icon)
  $LabelText.data = rowInfo.name
  $Row.title = rowInfo.path
  $Row.ariaSetSize = `${rowInfo.setSize}`
  // TODO bug with windows narrator
  // windows narrator reads heading level 1
  $Row.ariaLevel = `${rowInfo.depth}`
  $Row.ariaPosInSet = `${rowInfo.posInSet}`
  $Row.style.paddingLeft = `${rowInfo.depth * defaultIndent}rem`
  $Row.ariaLabel = rowInfo.name
  $Row.ariaDescription = ''
  switch (rowInfo.type) {
    // TODO decide on directory vs folder
    case DirentType.Directory:
      $Row.ariaExpanded = AriaBoolean.False
      break
    case DirentType.DirectoryExpanding:
      $Row.ariaExpanded = AriaBoolean.True // TODO tree should be aria-busy then
      break
    case DirentType.DirectoryExpanded:
      $Row.ariaExpanded = AriaBoolean.True
      break
    case DirentType.File:
      $Row.ariaExpanded = undefined
      break
    default:
      break
  }
}

const render$RowsLess = ($Rows, rowInfos) => {
  for (let i = 0; i < $Rows.children.length; i++) {
    render$Row($Rows.children[i], rowInfos[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $Rows.children.length; i < rowInfos.length; i++) {
    const $Row = create$Row()
    render$Row($Row, rowInfos[i])
    fragment.append($Row)
  }
  $Rows.append(fragment)
}

const render$RowsEqual = ($Rows, rowInfos) => {
  for (let i = 0; i < rowInfos.length; i++) {
    render$Row($Rows.children[i], rowInfos[i])
  }
}

const render$RowsMore = ($Rows, rowInfos) => {
  for (let i = 0; i < rowInfos.length; i++) {
    render$Row($Rows.children[i], rowInfos[i])
  }
  const diff = $Rows.children.length - rowInfos.length
  for (let i = 0; i < diff; i++) {
    $Rows.lastChild.remove()
  }
}

const render$Rows = ($Rows, rowInfos) => {
  if ($Rows.children.length < rowInfos.length) {
    render$RowsLess($Rows, rowInfos)
  } else if ($Rows.children.length === rowInfos.length) {
    render$RowsEqual($Rows, rowInfos)
  } else {
    render$RowsMore($Rows, rowInfos)
  }
}

export const handleError = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  const { $Viewlet } = state
  $Viewlet.textContent = message
}

export const updateDirents = (state, dirents) => {
  Assert.object(state)
  Assert.array(dirents)
  const { $Viewlet } = state
  render$Rows($Viewlet, dirents)
}

export const setFocusedIndex = (state, oldIndex, newIndex, focused) => {
  Assert.object(state)
  Assert.number(oldIndex)
  Assert.number(newIndex)
  const { $Viewlet } = state
  switch (oldIndex) {
    case -2:
      break
    case -1:
      $Viewlet.classList.remove(focusClassName)
      break
    default:
      const $Dirent = $Viewlet.children[oldIndex]
      if ($Dirent) {
        $Dirent.classList.remove(focusClassName)
        $Dirent.removeAttribute('id')
      }
      break
  }
  switch (newIndex) {
    case -2:
      $Viewlet.classList.remove(focusClassName)
      $Viewlet.removeAttribute(DomAttributeType.AriaActiveDescendant)
      break
    case -1:
      if (focused) {
        $Viewlet.classList.add(focusClassName)
        $Viewlet.removeAttribute(DomAttributeType.AriaActiveDescendant)
      }
      break
    default:
      if (newIndex >= 0) {
        const $Dirent = $Viewlet.children[newIndex]
        if (!$Dirent) {
          break
        }
        $Dirent.id = activeId
        $Viewlet.setAttribute(DomAttributeType.AriaActiveDescendant, activeId)
        if (focused) {
          $Dirent.classList.add(focusClassName)
        }
      }
      break
  }
  if (focused) {
    $Viewlet.focus()
    Focus.setFocus('Explorer')
  }
}

export const dispose = (state) => {}

export const hoverIndex = (state, oldIndex, newIndex) => {
  Assert.object(state)
  Assert.number(oldIndex)
  Assert.number(newIndex)
  if (oldIndex !== -1) {
    const $OldItem = state.$Viewlet.children[oldIndex]
    $OldItem.classList.remove('Hover')
  }
  const $NewItem = state.$Viewlet.children[newIndex]
  $NewItem.classList.add('Hover')
}

export const replaceWithEditBox = (state, index, value) => {
  const { $Viewlet } = state
  const $InputBox = InputBox.create()
  $InputBox.value = value
  $InputBox.oninput = ViewletExplorerEvents.handleEditingInput
  const $Dirent = $Viewlet.children[index]
  if ($Dirent) {
    const $Label = $Dirent.children[1]
    $Label.replaceWith($InputBox)
  } else {
    const $Dirent = document.createElement('div')
    $Dirent.className = 'ExplorerItem'
    $Dirent.append($InputBox)
    $Viewlet.append($Dirent)
  }
  $InputBox.select()
  $InputBox.setSelectionRange(0, value.length)
  $InputBox.focus()
  Focus.setFocus('ExplorerEditBox')
}

export const insertEditBox = (state, index, value) => {
  const { $Viewlet } = state
  const $InputBox = InputBox.create()
  $InputBox.value = value
  $InputBox.oninput = ViewletExplorerEvents.handleEditingInput
  if (index === -1) {
    $Viewlet.append($InputBox)
  } else {
    const $Dirent = $Viewlet.children[index]
    // TODO this should never happen
    if (!$Dirent) {
      throw new Error(`dirent at index ${index} should be defined`)
    }
    $Dirent.before($InputBox)
  }
  $InputBox.select()
  $InputBox.setSelectionRange(0, value.length)
  $InputBox.focus()
  Focus.setFocus('ExplorerEditBox')
}

export const hideEditBox = (state, index) => {
  Assert.object(state)
  Assert.number(index)
  const { $Viewlet } = state
  if (index === -1) {
    const $InputBox = $Viewlet.lastChild
    $InputBox.remove()
    return $InputBox.value
  }
  const $InputBox = $Viewlet.children[index]
  $InputBox.remove()
}

export const setEditingIcon = (state, index, icon) => {
  Assert.object(state)
  Assert.number(index)
  Assert.string(icon)
  const { $Viewlet } = state
  const $Dirent = $Viewlet.children[index]
  const $Icon = $Dirent.children[0]
  $Icon.src = icon
}

export const replaceEditBox = (state, index, dirent) => {
  Assert.object(state)
  Assert.number(index)
  const { $Viewlet } = state
  const $OldRow = $Viewlet.children[index]
  const $Dirent = create$Row()
  $Dirent.id = activeId
  render$Row($Dirent, dirent)
  $OldRow.replaceWith($Dirent)
  $Viewlet.focus()
  Focus.setFocus('Explorer')
}

export const setDropTargets = (state, oldDropTargets, newDropTargets) => {
  const { $Viewlet } = state
  for (const oldIndex of oldDropTargets) {
    if (oldIndex === -1) {
      $Viewlet.classList.remove('DropTarget')
    } else {
      $Viewlet.children[oldIndex].classList.remove('DropTarget')
    }
  }
  for (const newIndex of newDropTargets) {
    if (newIndex === -1) {
      $Viewlet.classList.add('DropTarget')
    } else {
      $Viewlet.children[newIndex].classList.add('DropTarget')
    }
  }
}
