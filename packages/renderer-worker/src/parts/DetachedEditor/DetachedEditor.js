import * as Command from '../Command/Command.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

export const openNewWithEditorInput = async (editorInput, editorUid, isDirty) => {
  const windowId = await GetWindowId.getWindowId()
  const payload = { editorInput, workspaceUri: Workspace.getWorkspaceUri(), isDirty }
  const instance = ViewletStates.getInstance(editorUid)
  if (instance?.moduleId === ViewletModuleId.EditorText) {
    payload.text = await EditorWorker.invoke('Editor.getText', editorUid)
    payload.selections = Array.from(await EditorWorker.invoke('Editor.getSelections2', editorUid))
  }
  const destinationWindowId = await SharedProcess.invoke('ElectronWindow.openNewWithEditorInput', windowId, payload)
  if (payload.text !== undefined && payload.text !== (await EditorWorker.invoke('Editor.getText', editorUid))) {
    await SharedProcess.invoke('ElectronWindow.close', destinationWindowId)
    throw new Error('The source editor changed during transfer; its tab has been retained')
  }
}

export const openTransferredEditor = async (href) => {
  const token = new URL(href).searchParams.get('editorTransfer')
  const windowId = await GetWindowId.getWindowId()
  try {
    const payload = await SharedProcess.invoke('ElectronWindow.takeEditorTransfer', windowId, token)
    await Command.execute('Main.openInput', { editorInput: payload.editorInput, focus: true })
    const main = ViewletStates.getInstance(ViewletModuleId.Main)
    const state = await MainAreaWorker.invoke('MainArea.getComponentState', main.state.uid)
    const group = state.layout.groups.find((candidate) => candidate.id === state.layout.activeGroupId)
    const tab = group?.tabs.find((candidate) => candidate.id === group.activeTabId)
    if (!tab || !['loaded', 'binary'].includes(tab.loadingState)) {
      throw new Error(tab?.errorMessage || 'Could not open the detached editor')
    }
    if (payload.text !== undefined) {
      const currentText = await EditorWorker.invoke('Editor.getText', tab.editorUid)
      if (payload.isDirty || currentText !== payload.text) {
        await Viewlet.executeViewletCommand(tab.editorUid, 'setText', payload.text)
      }
      if (payload.selections.length) {
        await Viewlet.executeViewletCommand(tab.editorUid, 'setSelections', new Uint32Array(payload.selections))
      }
      if ((await EditorWorker.invoke('Editor.getText', tab.editorUid)) !== payload.text) {
        throw new Error('Could not restore the detached editor text')
      }
    }
    await SharedProcess.invoke('ElectronWindow.completeEditorTransfer', windowId, token)
  } catch (error) {
    await SharedProcess.invoke('ElectronWindow.completeEditorTransfer', windowId, token, String(error))
    throw error
  }
}
