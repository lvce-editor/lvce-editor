import VError from 'verror'
import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  renameProviders: Object.create(null),
}

const registerRenameProviderInternal = (renameProvider) => {
  state.renameProviders[renameProvider.languageId] = renameProvider
}

export const registerRenameProvider = (renameProvider) => {
  try {
    registerRenameProviderInternal(renameProvider)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to register rename provider',
    })
  }
}

const executePrepareRenameInternal = (textDocumentId, offset) => {
  const textDocument = TextDocument.get(textDocumentId)
  const renameProvider = state.renameProviders[textDocument.languageId]
  return renameProvider.prepareRename(textDocument, offset)
}

export const executePrepareRename = async (textDocumentId, offset) => {
  try {
    return await executePrepareRenameInternal(textDocumentId, offset)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute rename provider',
    })
  }
}

const executeRenameInternal = (textDocumentId, offset, newName) => {
  const textDocument = TextDocument.get(textDocumentId)
  const renameProvider = state.renameProviders[textDocument.languageId]
  return renameProvider.rename(textDocument, offset, newName)
}

export const executeRename = async (textDocumentId, offset, newName) => {
  try {
    return await executeRenameInternal(textDocumentId, offset, newName)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute rename provider',
    })
  }
}
