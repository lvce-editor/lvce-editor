import * as ElectronDialog from '../ElectronDialog/ElectronDialog.js'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.js'
import * as SavePromptResult from '../SavePromptResult/SavePromptResult.js'

export const prompt = async (message, confirmMessage, title, cancelMessage) => {
  const result = await ElectronDialog.showMessageBox({
    message,
    buttons: [cancelMessage, confirmMessage],
    defaultId: 1,
    type: ElectronMessageBoxType.Question,
    title,
  })
  return result === 1
}

export const promptError = async (message, confirmMessage, title) => {
  const result = await ElectronDialog.showMessageBox({
    message,
    buttons: [confirmMessage],
    defaultId: 0,
    type: ElectronMessageBoxType.Error,
    title,
  })
  return result === 0
}

export const promptSave = async (message, { cancelMessage, discardMessage, saveMessage, title }, showMessageBox = ElectronDialog.showMessageBox) => {
  const result = await showMessageBox({
    buttons: [cancelMessage, discardMessage, saveMessage],
    cancelId: 0,
    defaultId: 2,
    message,
    title,
    type: ElectronMessageBoxType.Question,
  })
  if (result === 2) {
    return SavePromptResult.Save
  }
  if (result === 1) {
    return SavePromptResult.Discard
  }
  return SavePromptResult.Cancel
}
