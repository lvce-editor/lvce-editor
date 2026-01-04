import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

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

export const executeFileReferenceProvider = (id, languageId, assetDir, platform) => {
  return ExtensionHostShared.executeProviders({
    event: `onReferences:${languageId}`,
    method: ExtensionHostCommandType.ReferenceExecuteFileReferenceProvider,
    params: [id],
    noProviderFoundMessage: 'no reference providers found',
    combineResults,
    noProviderFoundResult: [],
    assetDir,
    platform,
  })
}
