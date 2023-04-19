import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as Tab from '../Tab/Tab.js'
import * as ViewletMainEvents from './ViewletMainEvents.js'

const create$MainTabs = () => {
  const $MainTabs = document.createElement('div')
  $MainTabs.className = 'MainTabs'
  $MainTabs.role = AriaRoles.TabList
  $MainTabs.onmousedown = ViewletMainEvents.handleTabsMouseDown
  $MainTabs.oncontextmenu = ViewletMainEvents.handleTabsContextMenu
  $MainTabs.ondragstart = ViewletMainEvents.handleDragStart
  // TODO race condition: what if tab has already been closed?
  return $MainTabs
}

// TODO Main should not be bound to Editor -> Lazy load Editor
export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Main'
  $Viewlet.className = 'Viewlet Main'
  $Viewlet.role = AriaRoles.Main

  // const $MainContent = document.createElement('div')
  // $MainContent.id = 'MainContent'

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
  state.$MainContent = undefined
  state.$MainTabs = undefined
}

export const closeViewletAndTab = (state, index) => {
  state.$MainContent.remove()
  state.$MainContent = undefined
  state.$MainTabs.remove()
  state.$MainTabs = undefined
}

export const focus = () => {}

const create$MainContent = () => {
  const $MainContent = document.createElement('div')
  $MainContent.id = 'MainContent'
  return $MainContent
}

// TODO when there is not enough space available, only show tab close button
// for focused tab (that's how chrome and firefox do it)
export const openAnotherTab = async (state, tabLabel, tabTitle, unFocusIndex) => {
  const $Tab = Tab.create(tabLabel, tabTitle, false)
  const { $MainTabs } = state
  $MainTabs.children[unFocusIndex].ariaSelected = AriaBoolean.False
  $MainTabs.append($Tab)
}

export const closeOneTab = (state, closeIndex, focusIndex) => {
  const { $MainTabs } = state
  $MainTabs.children[closeIndex].remove()
  $MainTabs.children[focusIndex].ariaSelected = AriaBoolean.True
}

export const setDirty = (state, index, dirty) => {
  Assert.number(index)
  Assert.boolean(dirty)
  const { $MainTabs } = state
  if (dirty) {
    $MainTabs.children[index].classList.add('Dirty')
  } else {
    $MainTabs.children[index].classList.remove('Dirty')
  }
}

export const closeOneTabOnly = (state, closeIndex) => {
  const { $MainTabs } = state
  $MainTabs.children[closeIndex].remove()
}

export const focusAnotherTab = (state, unFocusIndex, focusIndex) => {
  const { $MainTabs } = state
  $MainTabs.children[unFocusIndex].ariaSelected = AriaBoolean.False
  $MainTabs.children[focusIndex].ariaSelected = AriaBoolean.True
}

export const closeOthers = (state, keepIndex, focusIndex) => {
  for (let i = state.$MainTabs.children.length - 1; i >= 0; i--) {
    const $Tab = state.$MainTabs.children[i]
    if (i === keepIndex) {
      $Tab.ariaSelected = AriaBoolean.True
      $Tab.tabIndex = 0
    } else {
      $Tab.remove()
    }
  }
}

export const closeTabsRight = (state, index) => {
  for (let i = state.$MainTabs.children.length - 1; i > index; i--) {
    const $Tab = state.$MainTabs.children[i]
    $Tab.remove()
  }
  const $Tab = state.$MainTabs.children[index]
  $Tab.ariaSelected = AriaBoolean.True
  $Tab.tabIndex = 0
}

export const closeTabsLeft = (state, index) => {
  for (let i = index - 1; i >= 0; i--) {
    const $Tab = state.$MainTabs.children[i]
    $Tab.remove()
  }
  const $Tab = state.$MainTabs.children[0]
  $Tab.ariaSelected = AriaBoolean.True
  $Tab.tabIndex = 0
}

export const updateTab = (state, index, text) => {
  const { $MainTabs } = state
  const $Tab = $MainTabs.children[index]
  const $TabLabel = $Tab.firstChild
  $Tab.title = text
  $TabLabel.textContent = text
}

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
