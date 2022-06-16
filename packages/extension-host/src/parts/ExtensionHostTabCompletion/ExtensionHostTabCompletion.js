import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import { VALIDATION_ENABLED } from '../Flags/Flags.js'
import { ow } from '../Validation/Validation.js'

export const state = {
  tabCompletionProviderMap: Object.create(null),
}

export const registerTabCompletionProvider = (tabCompletionProvider) => {
  if (VALIDATION_ENABLED) {
    ow.object.partialShape({
      languageId: ow.string,
      provideTabCompletion: ow.function,
    })
  }
  state.tabCompletionProviderMap[tabCompletionProvider.languageId] =
    tabCompletionProvider
}

export const unregisterTabCompletionProvider = (tabCompletionProvider) => {
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
  const tabCompletionProvider =
    state.tabCompletionProviderMap[textDocument.languageId]
  if (!tabCompletionProvider) {
    console.info(`no tab Completion provider for ${textDocument.languageId}`)
    return undefined
  }
  const tabCompletion = tabCompletionProvider.provideTabCompletion(
    textDocument,
    offset
  )
  if (VALIDATION_ENABLED) {
    ow(
      tabCompletion,
      ow.any(
        ow.object.exactShape({
          type: ow.number.integer,
          offset: ow.number.integer,
          inserted: ow.string,
          deleted: ow.number.integer,
        })
      )
    )
  }
  return tabCompletion
}

export const executeTabCompletionProvider = (documentId, offset) => {
  try {
    return executeInternal(documentId, offset)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute tab completion provider',
    })
  }
}
