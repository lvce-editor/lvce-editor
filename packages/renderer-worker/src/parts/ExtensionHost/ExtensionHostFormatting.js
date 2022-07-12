import * as ExtensionHostShared from './ExtensionHostShared.js'

export const executeFormattingProvider = (editor) => {
  return ExtensionHostShared.executeProvider({
    event: `onFormatting:${editor.languageId}`,
    method: 'ExtensionHostFormatting.executeFormattingProvider',
    params: [editor.id],
    noProviderFoundMessage: 'No formatting provider found',
  })
}
