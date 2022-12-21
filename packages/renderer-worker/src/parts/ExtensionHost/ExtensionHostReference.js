import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'

const combineResults = (results) => {
  return results[0]
}

export const executeReferenceProvider = async (editor, offset) => {
  const result = await ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnReferences,
    method: ExtensionHostCommandType.ReferenceExecuteReferenceProvider,
    args: [offset],
    noProviderFoundMessage: 'no reference providers found',
    combineResults,
    noProviderFoundResult: [],
  })
  Assert.array(result)
  return result
}
