import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as ViewletMainEvents from './ViewletMainEvents.js'

// TODO Main should not be bound to Editor -> Lazy load Editor
export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Main'
  $Viewlet.className = 'Viewlet Main'
  // @ts-ignore
  $Viewlet.role = AriaRoles.Main
  return {
    $Viewlet,
    $Main: $Viewlet,
    $DragOverlay: undefined,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.ondrop = ViewletMainEvents.handleDrop
  $Viewlet.ondragover = ViewletMainEvents.handleDragOver
  $Viewlet.ondragleave = ViewletMainEvents.handleDragLeave
}

export const dispose = (state) => {
  state.$MainTabs.remove()
}

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

export const openViewlet = (state, tabLabel, tabTitle, oldActiveIndex, background = false) => {
  // await Viewlet.load(id)
  // const instance = Viewlet.state.instances[id]
  // // TODO race condition: what if tab has already been closed?
  // Viewlet.focus(id)
}

export const appendViewlet = (state, childName, $Child) => {
  // await Viewlet.load(id)
  // const instance = Viewlet.state.instances[id]
  // // TODO race condition: what if tab has already been closed?
  // Viewlet.focus(id)
}

// TODO when there is not enough space available, only show tab close button
// for focused tab (that's how chrome and firefox do it)

export const highlightDragOver = (state) => {
  // const { $MainTabs } = state
  // $MainTabs.classList.add('DragOver')
}

export const stopHighlightDragOver = (state) => {
  // const { $MainTabs } = state
  // $MainTabs.classList.remove('DragOver')
}

const create$DragOverlay = () => {
  const $Overlay = document.createElement('div')
  $Overlay.className = 'DragOverlay'
  return $Overlay
}

export const showDragOverlay = (state, x, y, width, height) => {
  const hasOverlay = state.$DragOverlay
  if (!hasOverlay) {
    state.$DragOverlay = create$DragOverlay()
  }
  const { $DragOverlay } = state
  SetBounds.setBounds($DragOverlay, x, y, width, height)
  if (!hasOverlay) {
    document.body.append($DragOverlay)
  }
}

export const hideDragOverlay = (state) => {
  if (!state.$DragOverlay) {
    return
  }
  state.$DragOverlay.remove()
  state.$DragOverlay = undefined
}

export const appendContent = (state, $Child) => {
  const { $Viewlet } = state
  $Viewlet.append($Child)
}

export const appendTabs = (state, $Child) => {
  const { $Viewlet } = state
  console.log({ $Child })
  $Viewlet.append($Child)
}
