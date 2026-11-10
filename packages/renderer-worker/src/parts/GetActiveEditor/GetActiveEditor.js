import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as Command from '../Command/Command.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getActiveEditor = () => {
  return ViewletStates.getState(ViewletModuleId.EditorText)
}

export const getActiveEditorId = (applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText, applicationId)
  if (!instance) {
    return -1
  }
  return instance.state.id
}

export const getDiagnosticsWithInvoke = async (invoke, applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText, applicationId)
  if (!instance) {
    return []
  }
  return invoke('Editor.getDiagnostics', instance.state.id)
}

export const getDiagnostics = async (applicationId) => {
  return getDiagnosticsWithInvoke(EditorWorker.invoke, applicationId)
}

export const getTextDocumentWithInvoke = async (invoke, applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText, applicationId)
  if (!instance) {
    return undefined
  }
  const { id, uri } = instance.state
  const text = await invoke('Editor.getText', id)
  return {
    text,
    uri,
  }
}

export const getTextDocumentWithScroll = async (applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText, applicationId)
  if (!instance) {
    return undefined
  }
  const { id, uri, deltaY, finalDeltaY, height } = instance.state
  const text = await EditorWorker.invoke('Editor.getText', id)
  return {
    text,
    uri,
    scrollTop: deltaY,
    scrollHeight: finalDeltaY,
    viewportHeight: height,
  }
}

export const getTextDocument = async (applicationId) => {
  return getTextDocumentWithInvoke(EditorWorker.invoke, applicationId)
}

export const getOpenTextDocumentWithInvoke = async (invoke, uri, applicationId) => {
  if (applicationId !== undefined && (!applicationId || !ApplicationRegistry.isOpen(applicationId))) {
    return undefined
  }
  // Inspect local editor metadata first. Searching a closed file must not
  // transfer the contents of every open editor across the worker boundary.
  for (const instance of ViewletStates.getValues()) {
    const { state: metadata, moduleId } = instance
    const { id, uid, uri: candidateUri } = metadata
    if (
      (moduleId !== ViewletModuleId.EditorText && moduleId !== 'EditorText') ||
      candidateUri !== uri ||
      ApplicationRegistry.getOwner(uid) !== applicationId
    ) {
      continue
    }
    const state = await invoke('Editor.getComponentState', id)
    const { uri: editorUri, applicationId: owner, lines, modified } = state || {}
    if (editorUri === uri && owner === applicationId && Array.isArray(lines)) {
      return { id, uri, text: lines.join('\n'), modified: modified === true }
    }
  }
  return undefined
}

export const getOpenTextDocument = (uri, applicationId) => {
  return getOpenTextDocumentWithInvoke(EditorWorker.invoke, uri, applicationId)
}

export const applyOpenTextDocumentEditWithInvoke = async (invoke, execute, uri, expectedText, text, applicationId) => {
  const document = await getOpenTextDocumentWithInvoke(invoke, uri, applicationId)
  if (!document) {
    return false
  }
  await invoke('Editor.compareAndSetText', document.id, uri, expectedText, text, applicationId)
  await invoke('Editor.save', document.id, true)
  await execute('Viewlet.executeViewletCommand', document.id, 'renderPending')
  const state = await invoke('Editor.getComponentState', document.id)
  const { modified, uri: savedUri, applicationId: owner } = state || {}
  if (savedUri !== uri || owner !== applicationId) {
    throw new Error(`The editor closed before the edit to ${uri} could be confirmed.`)
  }
  if (modified) {
    throw new Error(`Failed to save ${uri}. The edited contents remain open in the editor.`)
  }
  return true
}

export const applyOpenTextDocumentEdit = (uri, expectedText, text, applicationId) => {
  return applyOpenTextDocumentEditWithInvoke(EditorWorker.invoke, Command.execute, uri, expectedText, text, applicationId)
}

export const getSelectionsWithInvoke = async (invoke, applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText, applicationId)
  if (!instance) {
    return []
  }
  const selections = await invoke('Editor.getSelections2', instance.state.id)
  return [...selections]
}

export const getSelections = async (applicationId) => {
  return getSelectionsWithInvoke(EditorWorker.invoke, applicationId)
}

export const getSelectionTextWithInvoke = async (invoke) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText)
  if (!instance) {
    return ''
  }
  const [text, selectionsValue] = await Promise.all([invoke('Editor.getText', instance.state.id), invoke('Editor.getSelections2', instance.state.id)])
  const selections = [...selectionsValue]
  if (selections.length < 4) {
    return ''
  }
  const [startRowIndex, startColumnIndex, endRowIndex, endColumnIndex] = GetSelectionPairs.getSelectionPairs(selections, 0)
  const selectedLines = TextDocument.getSelectionText(
    { lines: text.split('\n') },
    {
      end: { columnIndex: endColumnIndex, rowIndex: endRowIndex },
      start: { columnIndex: startColumnIndex, rowIndex: startRowIndex },
    },
  )
  return JoinLines.joinLines(selectedLines)
}

export const getSelectionText = async () => {
  return getSelectionTextWithInvoke(EditorWorker.invoke)
}

export const getOpenEditorUrisWithInvoke = async (invoke, applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.Main, applicationId)
  if (!instance) {
    return []
  }
  const savedState = await invoke('MainArea.saveState', instance.state.uid)
  return savedState.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.uri).filter((uri) => typeof uri === 'string'))
}

export const getOpenEditorUris = (applicationId) => {
  return getOpenEditorUrisWithInvoke(MainAreaWorker.invoke, applicationId)
}

export const getVisibleEditorUrisWithInvoke = async (invoke, applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.Main, applicationId)
  if (!instance) {
    return []
  }
  const savedState = await invoke('MainArea.saveState', instance.state.uid)
  return savedState.layout.groups.flatMap((group) => {
    const activeTab = group.tabs.find((tab) => tab.id === group.activeTabId)
    return typeof activeTab?.uri === 'string' ? [activeTab.uri] : []
  })
}

export const getVisibleEditorUris = (applicationId) => {
  return getVisibleEditorUrisWithInvoke(MainAreaWorker.invoke, applicationId)
}

export const getActiveUriWithInvoke = async (invoke, applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.Main, applicationId)
  if (!instance) {
    return ''
  }
  const savedState = await invoke('MainArea.saveState', instance.state.uid)
  const { activeGroupId, groups } = savedState.layout
  const group = groups.find((group) => group.id === activeGroupId)
  if (!group) {
    return ''
  }
  const activeTab = group.tabs.find((tab) => tab.id === group.activeTabId)
  return typeof activeTab?.uri === 'string' ? activeTab.uri : ''
}

export const getActiveUri = (applicationId) => {
  return getActiveUriWithInvoke(MainAreaWorker.invoke, applicationId)
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

export const setSelectionsWithCommand = async (executeCommand, selections, applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText, applicationId)
  if (!instance) {
    return
  }
  await executeCommand('Viewlet.executeViewletCommand', instance.state.id, 'setSelections', new Uint32Array(selections))
}

export const setSelections = async (selections, applicationId) => {
  await setSelectionsWithCommand(Command.execute, selections, applicationId)
}

export const updateAllDiagnosticsWithCommand = async (invoke) => {
  await invoke('Editor.updateDiagnosticsAll')
}

export const updateAllDiagnostics = async () => {
  await updateAllDiagnosticsWithCommand(EditorWorker.invoke)
}

// Return both fields from the same synchronous state snapshot.
export const getActiveEditorInfo = (applicationId) => {
  const instance = ViewletStates.getInstance(ViewletModuleId.EditorText, applicationId)
  if (!instance) {
    return undefined
  }
  const { id, uri } = instance.state
  return { id, uri }
}

export const openColorPickerWithCommand = async (executeCommand, editorId, initialColor, applicationId) => {
  if (!Number.isSafeInteger(editorId) || editorId < 0) {
    throw new TypeError('editorId must be a non-negative integer')
  }
  if (initialColor !== undefined && typeof initialColor !== 'string') {
    throw new TypeError('initialColor must be a string')
  }
  const instance = ViewletStates.getByUid(editorId)
  if (
    !instance ||
    (instance.moduleId !== ViewletModuleId.EditorText && instance.moduleId !== 'EditorText') ||
    ApplicationRegistry.getOwner(editorId) !== applicationId
  ) {
    throw new Error(`Editor not found: ${editorId}`)
  }
  await executeCommand('Viewlet.executeViewletCommand', editorId, 'openColorPicker', initialColor)
}

export const openColorPicker = async (editorId, initialColor, applicationId) => {
  await openColorPickerWithCommand(Command.execute, editorId, initialColor, applicationId)
}
