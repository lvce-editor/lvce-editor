import { inspect } from 'util'
import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  typeDefinitionProviders: Object.create(null),
}

export const registerTypeDefinitionProvider = (typeDefinitionProvider) => {
  try {
    state.typeDefinitionProviders[typeDefinitionProvider.languageId] =
      typeDefinitionProvider
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to register definition provider',
    })
  }
}

export const executeTypeDefinitionProvider = async (textDocumentId, offset) => {
  try {
    const textDocument = TextDocument.get(textDocumentId)
    const typeDefinitionProvider =
      state.typeDefinitionProviders[textDocument.languageId]
    if (!typeDefinitionProvider) {
      throw new Error(
        `No type definition provider found for ${textDocument.languageId}`
      )
    }
    const typeDefinition = await typeDefinitionProvider.provideTypeDefinition(
      textDocument,
      offset
    )
    if (typeDefinition === undefined || typeDefinition === null) {
      return typeDefinition
    }
    if (Assert.getType(typeDefinition) !== 'object') {
      throw new VError(
        `invalid type definition result: typeDefinition must be of type object but is ${inspect(
          typeDefinition
        )}`
      )
    }
    if (Assert.getType(typeDefinition.uri) !== 'string') {
      throw new VError(
        'invalid type definition result: typeDefinition.uri must be of type string'
      )
    }
    if (Assert.getType(typeDefinition.startOffset) !== 'number') {
      throw new VError(
        'invalid type definition result: typeDefinition.startOffset must be of type number'
      )
    }
    if (Assert.getType(typeDefinition.endOffset) !== 'number') {
      throw new VError(
        'invalid type definition result: typeDefinition.endOffset must be of type number'
      )
    }
    return typeDefinition
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute type definition provider',
    })
  }
}
