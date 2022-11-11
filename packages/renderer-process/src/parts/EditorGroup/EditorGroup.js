import * as Editor from '../Editor/Editor.js'
import * as EditorHelper from '../Editor/EditorHelper.js'
import * as EditorTabs from '../EditorTab/EditorTab.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleEditorTabsContextMenu = (event) => {
  event.preventDefault()
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* editorTabsHandleContextMenu */ 'Main.handleTabContextMenu',
    /* x */ x,
    /* y */ y
  )
}

export const create = () => {
  const $EditorTabs = EditorTabs.create()

  const $Editors = document.createElement('div')
  $Editors.className = 'Editors'

  // TODO create should not have side effect of mounting
  // TODO this causes 2 times layout (when also calling add after)
  // TODO
  // Layout.state.$Main.append($EditorTabs, $Editors)
  return {
    $EditorTabs,
    $Editors,
  }
}

export const addOne = (state, id, uri, languageId) => {
  EditorTabs.addOne(state.$EditorTabs, id, uri, languageId)
  // const $Editor = EditorController.create(id)
  // const $EditorTab = EditorTabsController.create(id, uri, languageId)
  // TODO should call addOne as well
  const editorState = Editor.create()
  EditorHelper.setState(id, editorState)
  Editor.mount(editorState, state.$Editors)
  return editorState
}

export const replaceOne = (state, id, uri, languageId) => {
  EditorTabs.addOne(state.$EditorTabs, id, uri, languageId)
}

// TODO remove single tab
export const removeOne = (state, index) => {
  // EditorTabs.removeOne(state.$EditorTabs, index)
  // Editor.removeOne(state.$Editors, index)
  state.$Editors.remove()
  state.$EditorTabs.remove()
}
