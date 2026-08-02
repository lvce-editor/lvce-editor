import * as Command from '../Command/Command.js'
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
