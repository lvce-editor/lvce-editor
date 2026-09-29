import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'

const languageProviderByMethod = {
  'ExtensionHostBraceCompletion.executeBraceCompletionProvider': ['brace completion', 'provideBraceCompletion'],
  'ExtensionHostClosingTag.executeClosingTagProvider': ['closing tag', 'provideClosingTag'],
  'ExtensionHostDefinition.executeDefinitionProvider': ['definition', 'provideDefinition'],
  'ExtensionHostImplementation.executeImplementationProvider': ['implementation', 'provideImplementations'],
  'ExtensionHostReference.executeReferenceProvider': ['reference', 'provideReferences2'],
  'ExtensionHostSelection.executeSelectionProvider': ['selection', 'provideSelectionRanges'],
  'ExtensionHost.executeTabCompletionProvider': ['tab completion', 'provideTabCompletion'],
  'ExtensionHostTypeDefinition.executeTypeDefinitionProvider': ['type definition', 'provideTypeDefinition'],
}

/**
 * @param {any} options
 */
export const execute = async (options) => {
  const { editor, args, method, noProviderFoundResult } = options
  if (method === 'ExtensionHostHover.execute') {
    return ExtensionManagementWorker.invoke('Extensions.executeHoverProvider', editor, ...args)
  }
  if (method === 'ExtensionHostOrganizeImports.execute') {
    const { found, result } = await ExtensionManagementWorker.invoke('Extensions.executeOrganizeImportsProvider', editor)
    return found ? result : noProviderFoundResult
  }
  if (method === 'ExtensionHostFormatting.executeFormattingProvider') {
    return ExtensionManagementWorker.invoke('Extensions.executeFormattingProvider', editor, ...args)
  }
  const provider = languageProviderByMethod[method]
  if (!provider) {
    throw new Error(`Unsupported isolated language provider method: ${method}`)
  }
  const [kind, methodName] = provider
  const { found, result } = await ExtensionManagementWorker.invoke('Extensions.executeLanguageProvider', kind, methodName, editor, ...args)
  return found ? result : noProviderFoundResult
}
