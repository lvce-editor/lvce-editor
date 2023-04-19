import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as ViewletMainEvents from './ViewletMainEvents.js'

// TODO Main should not be bound to Editor -> Lazy load Editor
export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Main'
  $Viewlet.className = 'Viewlet Main'
  $Viewlet.role = AriaRoles.Main

  // const $MainTabs = document.createElement('div')
  // $MainTabs.className = 'MainTabs'
  // $MainTabs.onmousedown = handleTabsMouseDown
  // $MainTabs.oncontextmenu = handleTabsContextMenu
  // // TODO race condition: what if tab has already been closed?
  // $Main.append($MainTabs, $MainContent)

  return {
    $Viewlet,
    $Main: $Viewlet,
    $MainContent: undefined,
    $MainTabs: undefined,
    $DragOverlay: undefined,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.ondrop = ViewletMainEvents.handleDrop
  $Viewlet.ondragover = ViewletMainEvents.handleDragOver
  $Viewlet.ondragend = ViewletMainEvents.handleDragEnd
}

export const dispose = (state) => {}

export const replaceEditor = (state, id, uri, languageId) => {}

export const addEditor = (state, id, uri, languageId) => {}

// TODO there are 3 cases
// 1. no editor group and no editor
// 2. editor group exists and new editor should be added
// 3. editor group exists and editor should be replaced
export const openEditor = async (state, id, uri, languageId) => {}

export const closeAllViewlets = (state) => {
  const { $Main } = state
  while ($Main.firstChild) {
    $Main.firstChild.remove()
  }
  state.$MainTabs = undefined
}

export const closeViewletAndTab = (state, index) => {
  state.$MainTabs.remove()
  state.$MainTabs = undefined
}

export const focus = () => {}

export const highlightDragOver = (state) => {
  const { $MainTabs } = state
  $MainTabs.classList.add('DragOver')
}

export const stopHighlightDragOver = (state) => {
  const { $MainTabs } = state
  $MainTabs.classList.remove('DragOver')
}

const create$DragOverlay = () => {
  const $Overlay = document.createElement('div')
  $Overlay.className = 'DragOverlay'
  return $Overlay
}

export const setDragOverlay = (state, visible, x, y, width, height) => {
  const hasOverlay = state.$DragOverlay
  if (!visible) {
    if (hasOverlay) {
      state.$DragOverlay.remove()
      state.$DragOverlay = undefined
    }
    return
  }
  if (!hasOverlay) {
    state.$DragOverlay = create$DragOverlay()
  }
  const { $DragOverlay } = state
  SetBounds.setBounds($DragOverlay, x, y, width, height)
  if (!hasOverlay) {
    document.body.append($DragOverlay)
  }
}
