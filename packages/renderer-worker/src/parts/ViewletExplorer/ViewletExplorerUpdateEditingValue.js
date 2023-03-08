import * as ValidateFileName from '../ValidateFileName/ValidateFileName.js'

export const updateEditingValue = (state, value) => {
  const { content, severity } = ValidateFileName.validateFileName(value)
  console.log({ content, severity })
  return {
    ...state,
    editingValue: value,
    editingMessageSeverity: severity,
    editingMessage: content,
  }
}
