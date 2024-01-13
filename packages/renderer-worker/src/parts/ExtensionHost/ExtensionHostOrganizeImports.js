import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from './ExtensionHostEditor.js'

const combineResults = (results) => {
  return results[0] ?? []
}

export const executeOrganizeImports = (editor) => {
  return ExtensionHostEditor.execute({
    editor,
    event: `${ExtensionHostActivationEvent.OnLanguage}:${editor.languageId}`,
    method: ExtensionHostCommandType.OrganizeImportsExecute,
    args: [],
    noProviderFoundMessage: 'no code actions provider found',
    noProviderFoundResult: [],
    combineResults,
  })
}
