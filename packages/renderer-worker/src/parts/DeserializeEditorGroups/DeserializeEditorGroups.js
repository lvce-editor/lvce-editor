import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Id from '../Id/Id.js'
import * as MeasureTabWidth from '../MeasureTabWidth/MeasureTabWidth.js'

const canBeRestored = (editor) => {
  return typeof editor.uri === 'string' && typeof editor.uid === 'number' && FileSystem.canBeRestored(editor.uri)
}

export const deserializeEditorGroups = (savedState, state) => {
  if (!savedState) {
    return []
  }
  // @ts-ignore
  const { groups, activeGroupIndex } = savedState
  const { tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing } = state
  if (!groups || !Array.isArray(groups)) {
    return []
  }
  const restoredGroups = []
  for (const group of groups) {
    if (!group || !group.editors) {
      continue
    }
    const restoredEditors = group.editors.filter(canBeRestored)
    for (const editor of restoredEditors) {
      editor.uid = Id.create()
      const label = editor.label
      editor.tabWidth = MeasureTabWidth.measureTabWidth(label, tabFontWeight, tabFontSize, tabFontFamily, tabLetterSpacing)
    }
    const restoredGroup = {
      ...group,
      tabsUid: Id.create(),
    }
    restoredGroups.push(restoredGroup)
  }
  // TODO check that type is string (else runtime error occurs and page is blank)
  return restoredGroups
}
