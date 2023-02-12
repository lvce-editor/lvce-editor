import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as Event from '../Event/Event.js'

// TODO windows
const getFileName = (uri) => {
  return uri.slice(uri.lastIndexOf('/') + 1)
}

const handleEditorTabsContextMenu = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  RendererWorker.send(/* editorTabsHandleContextMenu */ 'Main.handleTabContextMenu', /* x */ clientX, /* y */ clientY)
}

/**
 * @param {MouseEvent} event
 */
const handleMouseDown = (event) => {
  event.preventDefault()
  const $Target = event.target
  // TODO if middle click -> close tab
  // else if tab is not focused -> focus tab
  // else noop
  switch (event.button) {
    case MouseEventType.LeftClick:
      break
    case MouseEventType.MiddleClick:
      RendererWorker.send(/* Main.closeEditor */ 'Main.closeFocusedEditor')
      break
    default:
      break
  }
}

export const create = () => {
  const $EditorTabs = document.createElement('ul')
  $EditorTabs.className = 'EditorTabs'
  $EditorTabs.oncontextmenu = handleEditorTabsContextMenu
  $EditorTabs.onmousedown = handleMouseDown
  return $EditorTabs
}

const create$Tab = () => {
  const $Tab = document.createElement('li')
  // @ts-ignore
  $Tab.role = AriaRoles.Tab
  $Tab.className = 'EditorTab'
  $Tab.ariaSelected = AriaBoolean.True
  $Tab.tabIndex = 0
  // Set aria-description to empty string so that screen readers don't read title as well
  // More details https://github.com/microsoft/vscode/issues/95378
  $Tab.setAttribute(DomAttributeType.AriaDescription, '')
  const $TabLabel = document.createElement('span')
  return $Tab
}

const render$Tab = ($Tab, id, uri, languageId) => {
  const fileName = getFileName(uri)
  $Tab.textContent = fileName
  $Tab.title = uri
  $Tab.dataset.languageId = languageId
  $Tab.dataset.fileName = fileName
}

// const render$TabsLess = ($Tabs, tabs) => {
//   for (let i = 0; i < $Tabs.children.length; i++) {
//     render$Tab($Tabs.children[i], tabs[i])
//   }
//   const fragment = document.createDocumentFragment()
//   for (let i = $Tabs.children.length; i < tabs.length; i++) {
//     const $Tab = create$Tab()
//     render$Tab($Tab, tabs[i])
//     fragment.append($Tab)
//   }
//   $Tabs.append(fragment)
// }

// const render$TabsEqual = ($Tabs, tabs) => {
//   for (let i = 0; i < tabs.length; i++) {
//     render$Tab($Tabs.children[i], tabs[i])
//   }
// }

// const render$TabsMore = ($Tabs, tabs) => {
//   for (let i = 0; i < tabs.length; i++) {
//     render$Tab($Tabs.children[i], tabs[i])
//   }
//   const diff = $Tabs.children.length - tabs.length
//   for (let i = 0; i < diff; i++) {
//     $Tabs.lastChild.remove()
//   }
// }

// const render$Tabs = ($Tabs, tabs) => {
//   if ($Tabs.children.length < tabs.length) {
//     render$TabsLess($Tabs, tabs)
//   } else if ($Tabs.children.length === tabs.length) {
//     render$TabsEqual($Tabs, tabs)
//   } else {
//     render$TabsMore($Tabs, tabs)
//   }
// }

// export const setTabs = (state, tabs) => {
//   render$Tabs(state.$EditorTabs, tabs)
// }

export const addOne = ($EditorTabs, id, uri, languageId) => {
  const $EditorTab = create$Tab()
  render$Tab($EditorTab, id, uri, languageId)
  $EditorTabs.append($EditorTab)
}

// TODO should pass index as well
export const replaceOne = ($EditorTabs, id, uri, languageId) => {
  render$Tab($EditorTabs.firstChild, id, uri, languageId)
}

export const removeOne = ($EditorTabs, index) => {
  $EditorTabs.firstChild.remove()
  // const $EditorTab = $EditorTabs.children[index]
  // $EditorTab.remove()
}
