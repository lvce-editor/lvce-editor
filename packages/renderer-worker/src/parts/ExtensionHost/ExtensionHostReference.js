import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0]
}

export const executeReferenceProvider = async (editor, offset) => {
  const result = await ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnReferences,
    method: 'ExtensionHostReferences.executeReferenceProvider',
    args: [offset],
    noProviderFoundMessage: 'no reference providers found',
    combineResults,
    noProviderFoundResult: [],
  })
  Assert.array(result)
  console.log({ result })
  return result
}
