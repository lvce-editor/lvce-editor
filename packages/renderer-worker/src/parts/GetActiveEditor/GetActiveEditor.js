import * as Command from '../Command/Command.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getActiveEditor = () => {
  return ViewletStates.getState(ViewletModuleId.EditorText)
}

export const getActiveEditorId = () => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return -1
  }
  return instance.state.id
}

export const getDiagnosticsWithInvoke = async (invoke) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return []
  }
  return invoke('Editor.getDiagnostics', instance.state.id)
}

export const getDiagnostics = async () => {
  return getDiagnosticsWithInvoke(EditorWorker.invoke)
}

export const getSelectionsWithInvoke = async (invoke) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return []
  }
  const selections = await invoke('Editor.getSelections2', instance.state.id)
  return [...selections]
}

export const getSelections = async () => {
  return getSelectionsWithInvoke(EditorWorker.invoke)
}

export const getVisibleLineRangeWithInvoke = async (invoke) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return undefined
  }
  return invoke('Editor.getVisibleLineRange', instance.state.id)
}

export const getVisibleLineRange = async () => {
  return getVisibleLineRangeWithInvoke(EditorWorker.invoke)
}

export const getOpenEditorUrisWithInvoke = async (invoke) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.Main)
  if (!instance) {
    return []
  }
  const savedState = await invoke('MainArea.saveState', instance.state.uid)
  return savedState.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.uri).filter((uri) => typeof uri === 'string'))
}

export const getOpenEditorUris = () => {
  return getOpenEditorUrisWithInvoke(MainAreaWorker.invoke)
}

export const updateDiagnosticsWithCommand = async (executeCommand) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return
  }
  await executeCommand('Viewlet.executeViewletCommand', instance.state.id, 'updateDiagnostics')
}

export const updateDiagnostics = async () => {
  await updateDiagnosticsWithCommand(Command.execute)
}

export const setSelectionsWithCommand = async (executeCommand, selections) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return
  }
  await executeCommand('Viewlet.executeViewletCommand', instance.state.id, 'setSelections', new Uint32Array(selections))
}

export const setSelections = async (selections) => {
  await setSelectionsWithCommand(Command.execute, selections)
}

export const updateAllDiagnosticsWithCommand = async (invoke) => {
  await invoke('Editor.updateDiagnosticsAll')
}

export const updateAllDiagnostics = async () => {
  await updateAllDiagnosticsWithCommand(EditorWorker.invoke)
}
