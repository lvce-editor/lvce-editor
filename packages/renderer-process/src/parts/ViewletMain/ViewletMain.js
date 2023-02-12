import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as EditorGroup from '../EditorGroup/EditorGroup.js'
import * as Tab from '../Tab/Tab.js'
import * as ViewletMainEvents from './ViewletMainEvents.js'

const create$MainTabs = () => {
  const $MainTabs = document.createElement('div')
  $MainTabs.className = 'MainTabs'
  // @ts-ignore
  $MainTabs.role = AriaRoles.TabList
  $MainTabs.onmousedown = ViewletMainEvents.handleTabsMouseDown
  $MainTabs.oncontextmenu = ViewletMainEvents.handleTabsContextMenu
  // TODO race condition: what if tab has already been closed?
  return $MainTabs
}

// TODO Main should not be bound to Editor -> Lazy load Editor
export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Main'
  $Viewlet.className = 'Viewlet Main'
  $Viewlet.ondrop = ViewletMainEvents.handleDrop
  $Viewlet.ondragover = ViewletMainEvents.handleDragOver
  // @ts-ignore
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
  }
}

export const dispose = (state) => {
  state.$MainContent.remove()
  state.$MainContent = undefined
  state.$MainTabs.remove()
  state.$MainTabs = undefined
}

export const replaceEditor = (state, id, uri, languageId) => {
  EditorGroup.replaceOne(state.editorGroup, id, uri, languageId)
}

export const addEditor = (state, id, uri, languageId) => {
  EditorGroup.addOne(state.editorGroup, id, uri, languageId)
}

// TODO there are 3 cases
// 1. no editor group and no editor
// 2. editor group exists and new editor should be added
// 3. editor group exists and editor should be replaced
export const openEditor = async (state, id, uri, languageId) => {
  state.editorGroup = EditorGroup.create()
  state.activeEditorState = EditorGroup.addOne(state.editorGroup, id, uri, languageId)
}

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

export const openViewlet = (state, tabLabel, tabTitle, oldActiveIndex, background = false) => {
  const $Tab = Tab.create(tabLabel, tabTitle, background)

  if (oldActiveIndex !== -1 && state.$MainTabs) {
    const $OldTab = state.$MainTabs.children[oldActiveIndex]
    if ($OldTab) {
      $OldTab.ariaSelected = AriaBoolean.False
    }
  }

  if (!state.$MainTabs) {
    state.$MainTabs = create$MainTabs()
    state.$Main.append(state.$MainTabs)
  }

  state.$MainTabs.append($Tab)

  // await Viewlet.load(id)
  // const instance = Viewlet.state.instances[id]
  // // TODO race condition: what if tab has already been closed?
  // Viewlet.mount(state.$MainContent, instance.state)
  // Viewlet.focus(id)
  // Layout.state.$Main.append(state.$MainTabs, state.$MainContent)
}

const create$MainContent = () => {
  const $MainContent = document.createElement('div')
  $MainContent.id = 'MainContent'
  return $MainContent
}

export const appendViewlet = (state, childName, $Child) => {
  if (!state.$MainContent) {
    state.$MainContent = create$MainContent()
    state.$Main.append(state.$MainContent)
  }
  // TODO should bring back old optimization of reusing existing editor dom nodes if possible
  while (state.$MainContent.firstChild) {
    state.$MainContent.firstChild.remove()
  }
  state.$MainContent.append($Child)

  // await Viewlet.load(id)
  // const instance = Viewlet.state.instances[id]
  // // TODO race condition: what if tab has already been closed?
  // Viewlet.mount(state.$MainContent, instance.state)
  // Viewlet.focus(id)
  // Layout.state.$Main.append(state.$MainTabs, state.$MainContent)
}

// TODO when there is not enough space available, only show tab close button
// for focused tab (that's how chrome and firefox do it)
export const openAnotherTab = async (state, tabLabel, tabTitle, unFocusIndex) => {
  const $Tab = Tab.create(tabLabel, tabTitle, false)
  state.$MainTabs.children[unFocusIndex].ariaSelected = AriaBoolean.False
  state.$MainTabs.append($Tab)
}

export const closeOneTab = (state, closeIndex, focusIndex) => {
  state.$MainTabs.children[closeIndex].remove()
  state.$MainTabs.children[focusIndex].ariaSelected = AriaBoolean.True
}

export const closeOneTabOnly = (state, closeIndex) => {
  state.$MainTabs.children[closeIndex].remove()
}

export const focusAnotherTab = (state, unFocusIndex, focusIndex) => {
  state.$MainTabs.children[unFocusIndex].ariaSelected = AriaBoolean.False
  state.$MainTabs.children[focusIndex].ariaSelected = AriaBoolean.True
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
