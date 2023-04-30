import * as Viewlet from '../Viewlet/Viewlet.js'

const getUid = (editor) => {
  return editor.uid
}

const getUids = (editors) => {
  return editors.map(getUid)
}

export const closeAllEditors = (state) => {
  const ids = getUids(state.editors)
  const uid = state.uid
  const commands = [['Viewlet.send', uid, 'dispose'], ...ids.flatMap(Viewlet.disposeFunctional)]
  const newEditors = []
  const newFocusedIndex = -1
  const newSelectedIndex = -1
  const newTabsUid = -1
  return {
    newState: {
      ...state,
      editors: newEditors,
      focusedIndex: newFocusedIndex,
      selectedIndex: newSelectedIndex,
      tabsUid: newTabsUid,
    },
    commands,
  }
}
