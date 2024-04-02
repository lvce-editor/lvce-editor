import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeBraceCompletionProvider = (editor, offset, openingBrace) => {
  Assert.object(editor)
  Assert.number(offset)
  Assert.string(openingBrace)
  return ExtensionHostEditor.execute({
    event: ExtensionHostActivationEvent.OnBraceCompletion,
    method: ExtensionHostCommandType.BraceCompletionExecuteBraceCompletionProvider,
    editor,
    args: [offset, openingBrace],
    noProviderFoundMessage: 'no brace completion providers found',
    noProviderFoundResult: undefined,
    combineResults,
  })
}
