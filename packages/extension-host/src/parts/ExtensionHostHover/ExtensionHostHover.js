import { ExecutionError } from '../Error/Error.js'
import { VALIDATION_ENABLED } from '../Flags/Flags.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import { ow } from '../Validation/Validation.js'

export const state = {
  hoverProviderMap: Object.create(null),
}

export const registerHoverProvider = (hoverProvider) => {
  if (VALIDATION_ENABLED) {
    ow.object.partialShape({
      languageId: ow.string,
      provideTabCompletion: ow.function,
    })
  }
  state.hoverProviderMap[hoverProvider.languageId] = hoverProvider
}

export const unregisterHoverProvider = (tabCompletionProvider) => {
  // const tabCompletionProviders =
  //   state.tabCompletionProviderMap[tabCompletionProvider.languageId] || []
  // const index = tabCompletionProviders.indexOf(tabCompletionProvider)
  // if (index === -1) {
  //   throw new Error('not registered')
  // }
  // tabCompletionProviders.splice(index, 1)
}

const executeInternal = (documentId, offset) => {
  const textDocument = TextDocument.get(documentId)
  const hoverProvider = state.hoverProviderMap[textDocument.languageId]
  if (!hoverProvider) {
    console.info(`no hover Completion provider for ${textDocument.languageId}`)
    return undefined
  }
  const hover = hoverProvider.provideHover(textDocument, offset)
  if (VALIDATION_ENABLED) {
  }
  return hover
}

export const executeHoverProvider = async (documentId, offset) => {
  try {
    return await executeInternal(documentId, offset)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute hover provider',
    })
  }
}
