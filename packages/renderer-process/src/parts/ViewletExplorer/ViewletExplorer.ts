import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.ts'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletExplorerEvents from './ViewletExplorerEvents.ts'

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

export const handleError = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  const { $Viewlet } = state
  $Viewlet.textContent = message
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
        $Dirent.classList.remove(activeId)
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
        $Dirent.classList.add(activeId)
        $Viewlet.setAttribute(DomAttributeType.AriaActiveDescendant, activeId)
        if (focused) {
          $Dirent.classList.add(focusClassName)
        }
      }
      break
  }
  if (focused) {
    $Viewlet.focus()
    RendererWorker.send('Focus.setFocus', WhenExpression.FocusExplorer)
  }
}

export const focusInput = (state, id) => {
  const $Input = document.getElementById(id)
  if (!$Input) {
    return
  }
  $Input.focus()
  RendererWorker.send('Focus.setFocus', WhenExpression.FocusExplorerEditBox)
}

export const dispose = (state) => {}

export const setDropTargets = (state, oldDropTargets, newDropTargets) => {
  // TODO use virtual dom for this
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

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  RememberFocus.rememberFocus($Viewlet, dom, ViewletExplorerEvents)
}
