import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeClosingTagProvider = (editor, offset, openingBrace) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnClosingTag,
    method: ExtensionHostCommandType.ClosingTagExecuteClosingTagProvider,
    args: [offset, openingBrace],
    combineResults,
    noProviderFoundMessage: '',
  })
}
