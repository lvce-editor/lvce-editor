import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js' // TODO focus is never needed at start -> use command.execute which lazy-loads focus module
import * as InputBox from '../InputBox/InputBox.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
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
  $Viewlet.onclick = ViewletExplorerEvents.handleClick
  $Viewlet.oncontextmenu = ViewletExplorerEvents.handleContextMenu
  // TODO use the other mouse events that capture automatically
  $Viewlet.addEventListener(DomEventType.MouseEnter, ViewletExplorerEvents.handleMouseEnter, DomEventOptions.Capture)
  $Viewlet.addEventListener(DomEventType.MouseLeave, ViewletExplorerEvents.handleMouseLeave, DomEventOptions.Capture)
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletExplorerEvents.handleWheel, DomEventOptions.Passive)
  $Viewlet.onblur = ViewletExplorerEvents.handleBlur
  $Viewlet.ondragover = ViewletExplorerEvents.handleDragOver
  $Viewlet.ondragstart = ViewletExplorerEvents.handleDragStart
  $Viewlet.ondrop = ViewletExplorerEvents.handleDrop
  $Viewlet.onfocus = ViewletExplorerEvents.handleFocus
  $Viewlet.onpointerdown = ViewletExplorerEvents.handlePointerDown
}

export const handleError = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  const { $Viewlet } = state
  $Viewlet.textContent = message
}

export const setDom = (state, dom) => {
  Assert.object(state)
  Assert.array(dom)
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom.slice(1))
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

export const replaceEditBox = (state, index, dirent) => {
  Assert.object(state)
  Assert.number(index)
  const { $Viewlet } = state
  const $OldRow = $Viewlet.children[index]
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
