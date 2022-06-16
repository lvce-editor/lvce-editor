import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import * as Debug from '../Debug/Debug.js'

export const state = {
  diagnosticProviderMap: Object.create(null),
}

export const registerDiagnosticProvider = (diagnosticProvider) => {
  try {
    state.diagnosticProviderMap[diagnosticProvider.languageId] = [
      diagnosticProvider,
    ]
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to register diagnostic provider',
    })
  }
}

const promiseFlatMap = async (promises) => {
  const results = await Promise.all(promises)
  return results.flat(1)
}

export const executeDiagnosticProvider = async (documentId) => {
  try {
    const textDocument = TextDocument.get(documentId)
    if (!textDocument) {
      console.log({ documentId })
      console.log(TextDocument.state.textDocuments)
      console.warn('no text document, something is wrong')
      return []
    }
    console.log('diag map', state.diagnosticProviderMap)
    const providers = state.diagnosticProviderMap[textDocument.languageId] || []
    if (providers.length === 0) {
      Debug.debug(`no diagnostics providers found for document ${documentId}`)
    }
    const getDiagnostics = (provider) => {
      return provider.provideDiagnostics(textDocument)
    }
    return promiseFlatMap(providers.map(getDiagnostics))
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute diagnostic provider',
    })
  }
}
