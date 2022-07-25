import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

const combineResults = (results) => {
  return results[0]
}

export const executeReferenceProvider = async (editor, offset) => {
  const result = await ExtensionHostShared.executeProviders({
    event: `onReferences:${editor.languageId}`,
    method: 'ExtensionHostReferences.executeReferenceProvider',
    params: [editor.id, offset],
    noProviderFoundMessage: 'no reference providers found',
    noProviderFoundResult: [],
    combineResults,
  })
  Assert.array(result)
  console.log({ result })
  return result
}
