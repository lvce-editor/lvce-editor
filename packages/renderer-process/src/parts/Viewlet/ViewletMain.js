import * as EditorGroup from '../EditorGroup/EditorGroup.js'
import * as Layout from '../Layout/Layout.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

const handleDragOver = (event) => {
  event.preventDefault()
  Layout.state.$Main.classList.add('DropTarget')
}

const handleDrop = async (event) => {
  console.log('[main] drop')
  event.preventDefault()
  Layout.state.$Main.classList.remove('DropTarget')
  RendererWorker.send(/* handleDrop */ 'Main.handleDrop')
}

const create$MainTabs = () => {
  const $MainTabs = document.createElement('div')
  $MainTabs.className = 'MainTabs'
  $MainTabs.setAttribute('role', 'tablist')
  $MainTabs.onmousedown = handleTabsMouseDown
  $MainTabs.oncontextmenu = handleTabsContextMenu
  // TODO race condition: what if tab has already been closed?
  return $MainTabs
}

// TODO Main should not be bound to Editor -> Lazy load Editor
export const create = () => {
  const $Main = Layout.state.$Main
  $Main.ondrop = handleDrop
  $Main.ondragover = handleDragOver

  // const $MainContent = document.createElement('div')
  // $MainContent.id = 'MainContent'

  // const $MainTabs = document.createElement('div')
  // $MainTabs.className = 'MainTabs'
  // $MainTabs.setAttribute('role', 'tablist')
  // $MainTabs.onmousedown = handleTabsMouseDown
  // $MainTabs.oncontextmenu = handleTabsContextMenu
  // // TODO race condition: what if tab has already been closed?
  // $Main.append($MainTabs, $MainContent)

  return {
    $Viewlet: $Main,
    $Main,
    $MainContent: undefined,
    $MainTabs: undefined,
  }
}

export const dispose = (state) => {
  console.log(state)
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
  console.log('open editor', id, uri, languageId)
  state.editorGroup = EditorGroup.create()
  state.activeEditorState = EditorGroup.addOne(
    state.editorGroup,
    id,
    uri,
    languageId
  )
}

export const closeAllViewlets = (state) => {
  const $Main = Layout.state.$Main
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

export const focus = () => {
  console.log('todo focus main')
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndex = ($Target) => {
  switch ($Target.className) {
    case 'EditorTabCloseButton':
      return getNodeIndex($Target.parentNode)
    case 'MainTab':
      return getNodeIndex($Target)
    default:
      return -1
  }
}

const handleTabCloseButtonMouseDown = (event, index) => {
  RendererWorker.send(
    /* Main.closeEditor */ 'Main.closeEditor',
    /* index */ index
  )
}

const handleTabMouseDown = (event, index) => {
  switch (event.button) {
    case /* LeftClick */ 0:
      RendererWorker.send(
        /* Main.handleTabClick */ 'Main.handleTabClick',
        /* index */ index
      )
      break
    case /* MiddleClick */ 1:
      RendererWorker.send(
        /* Main.closeEditor */ 'Main.closeEditor',
        /* index */ index
      )
      break
    case /* RightClick */ 2:
      break
    default:
      break
  }
}

const handleTabsMouseDown = (event) => {
  const $Target = event.target
  const index = getIndex($Target)
  console.log({ index })
  if (index === -1) {
    return
  }
  event.preventDefault()
  switch ($Target.className) {
    case 'EditorTabCloseButton':
      handleTabCloseButtonMouseDown(event, index)
      break
    case 'MainTab':
      handleTabMouseDown(event, index)
      break
    default:
      break
  }
}

const handleTabsContextMenu = (event) => {
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  event.preventDefault()
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* Main.handleTabContextMenu */ 'Main.handleTabContextMenu',
    /* index */ index,
    /* x */ x,
    /* y */ y
  )
}

export const openViewlet = (state, id, tabLabel, tabTitle, oldActiveIndex) => {
  const $Tab = document.createElement('div')
  $Tab.className = 'MainTab'
  $Tab.textContent = tabLabel
  $Tab.title = tabTitle
  $Tab.ariaSelected = 'true'
  $Tab.setAttribute('role', 'tab')

  const $TabCloseButton = document.createElement('button')
  $TabCloseButton.className = 'EditorTabCloseButton'
  $TabCloseButton.ariaLabel = 'Close'
  $TabCloseButton.title = ''
  $Tab.append($TabCloseButton)

  if (oldActiveIndex !== -1 && state.$MainTabs) {
    state.$MainTabs.children[oldActiveIndex].ariaSelected = 'false'
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
export const openAnotherTab = async (
  state,
  tabLabel,
  tabTitle,
  unFocusIndex
) => {
  const $Tab = document.createElement('div')
  $Tab.className = 'MainTab'
  $Tab.textContent = tabLabel
  $Tab.title = tabTitle
  $Tab.ariaSelected = 'true'
  $Tab.setAttribute('role', 'tab')
  $Tab.tabIndex = 0
  const $TabCloseButton = document.createElement('button')
  $TabCloseButton.className = 'EditorTabCloseButton'
  $TabCloseButton.ariaLabel = 'Close'
  $Tab.append($TabCloseButton)
  state.$MainTabs.children[unFocusIndex].ariaSelected = 'false'
  state.$MainTabs.append($Tab)
}

export const closeOneTab = (state, closeIndex, focusIndex) => {
  state.$MainTabs.children[closeIndex].remove()
  state.$MainTabs.children[focusIndex].ariaSelected = 'true'
}

export const closeOneTabOnly = (state, closeIndex) => {
  state.$MainTabs.children[closeIndex].remove()
}

export const focusAnotherTab = (state, unFocusIndex, focusIndex) => {
  state.$MainTabs.children[unFocusIndex].ariaSelected = 'false'
  state.$MainTabs.children[focusIndex].ariaSelected = 'true'
}

export const closeOthers = (state, keepIndex, focusIndex) => {
  for (let i = state.$MainTabs.children.length - 1; i >= 0; i--) {
    const $Tab = state.$MainTabs.children[i]
    if (i === keepIndex) {
      $Tab.ariaSelected = 'true'
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
  $Tab.ariaSelected = 'true'
  $Tab.tabIndex = 0
}

export const closeTabsLeft = (state, index) => {
  for (let i = index - 1; i >= 0; i--) {
    const $Tab = state.$MainTabs.children[i]
    $Tab.remove()
  }
  const $Tab = state.$MainTabs.children[0]
  $Tab.ariaSelected = 'true'
  $Tab.tabIndex = 0
}
