import * as Assert from '../Assert/Assert.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as Focus from '../Focus/Focus.js' // TODO focus is never needed at start -> use command.execute which lazy-loads focus module
import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletExplorerEvents from './ViewletExplorerEvents.js'

export const name = 'Explorer'

const activeId = 'TreeItemActive'
const focusClassName = 'FocusOutline'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Explorer'
  $Viewlet.tabIndex = 0
  // @ts-ignore
  $Viewlet.role = 'tree'
  $Viewlet.ariaLabel = 'Files Explorer'
  $Viewlet.onmousedown = ViewletExplorerEvents.handleMouseDown
  $Viewlet.oncontextmenu = ViewletExplorerEvents.handleContextMenu
  // TODO use the other mouse events that capture automatically
  $Viewlet.addEventListener(
    'mouseenter',
    ViewletExplorerEvents.handleMouseEnter,
    { capture: true }
  )
  $Viewlet.addEventListener(
    'mouseleave',
    ViewletExplorerEvents.handleMouseLeave,
    { capture: true }
  )
  $Viewlet.addEventListener('wheel', ViewletExplorerEvents.handleWheel, {
    passive: true,
  })
  $Viewlet.onblur = ViewletExplorerEvents.handleBlur
  $Viewlet.ondragover = ViewletExplorerEvents.handleDragOver
  $Viewlet.ondragstart = ViewletExplorerEvents.handleDragStart
  $Viewlet.ondrop = ViewletExplorerEvents.handleDrop
  $Viewlet.onfocus = ViewletExplorerEvents.handleFocus
  return {
    $Viewlet,
  }
}

const create$Row = () => {
  const $Row = document.createElement('div')
  // @ts-ignore
  $Row.role = 'treeitem'
  $Row.className = 'TreeItem'
  $Row.draggable = true
  const $LabelText = document.createTextNode('')
  const $Label = document.createElement('div')
  $Label.className = 'Label'
  $Label.append($LabelText)
  const $Icon = document.createElement('i')
  $Row.append($Icon, $Label)
  return $Row
}

// TODO rename to renderDirent
const render$Row = ($Row, rowInfo) => {
  const $Icon = $Row.childNodes[0]
  const $LabelText = $Row.childNodes[1].childNodes[0]
  $Icon.className = `Icon${rowInfo.icon}`
  $LabelText.data = rowInfo.name
  $Row.title = rowInfo.path
  $Row.ariaSetSize = `${rowInfo.setSize}`
  // TODO bug with windows narrator
  // windows narrator reads heading level 1
  $Row.ariaLevel = `${rowInfo.depth}`
  $Row.ariaPosInSet = `${rowInfo.posInSet}`
  $Row.ariaLabel = rowInfo.name
  $Row.ariaDescription = ''
  switch (rowInfo.type) {
    // TODO decide on directory vs folder
    case DirentType.Directory:
      $Row.ariaExpanded = 'false'
      break
    case DirentType.DirectoryExpanding:
      $Row.ariaExpanded = 'true' // TODO tree should be aria-busy then
      break
    case DirentType.DirectoryExpanded:
      $Row.ariaExpanded = 'true'
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
  state.$Viewlet.textContent = message
}

export const updateDirents = (state, dirents) => {
  Assert.object(state)
  Assert.array(dirents)
  render$Rows(state.$Viewlet, dirents)
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
      $Viewlet.removeAttribute('aria-activedescendant')
      break
    case -1:
      if (focused) {
        $Viewlet.classList.add(focusClassName)
        $Viewlet.removeAttribute('aria-activedescendant')
      }
      break
    default:
      if (newIndex >= 0) {
        const $Dirent = $Viewlet.children[newIndex]
        $Dirent.id = activeId
        $Viewlet.setAttribute('aria-activedescendant', activeId)
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

export const showEditBox = (state, index, name) => {
  const { $Viewlet } = state
  const $InputBox = InputBox.create()
  $InputBox.value = name
  $InputBox.oninput = ViewletExplorerEvents.handleEditingInput
  const $Dirent = $Viewlet.children[index]
  const $Label = $Dirent.children[1]
  $Label.replaceWith($InputBox)
  $InputBox.select()
  $InputBox.setSelectionRange(0, name.length)
  $InputBox.focus()
  Focus.setFocus('ExplorerEditBox')
}

export const hideEditBox = (state, index, dirent) => {
  Assert.object(state)
  Assert.number(index)
  Assert.object(dirent)
  const { $Viewlet } = state
  const $OldRow = $Viewlet.children[index]
  const $Dirent = create$Row()
  render$Row($Dirent, dirent)
  $OldRow.replaceWith($Dirent)
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
