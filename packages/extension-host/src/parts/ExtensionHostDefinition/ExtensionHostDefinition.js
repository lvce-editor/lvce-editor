import { inspect } from 'util'
import VError from 'verror'
import * as Assert from '../Assert/Assert.js'
import { ExecutionError } from '../Error/Error.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

export const state = {
  definitionProviders: Object.create(null),
}

export const registerDefinitionProvider = (definitionProvider) => {
  try {
    state.definitionProviders[definitionProvider.languageId] =
      definitionProvider
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to register definition provider',
    })
  }
}

export const executeDefinitionProvider = async (textDocumentId, offset) => {
  try {
    const textDocument = TextDocument.get(textDocumentId)
    const definitionProvider =
      state.definitionProviders[textDocument.languageId]
    if (!definitionProvider) {
      throw new Error(
        `No definition provider found for ${textDocument.languageId}`
      )
    }
    const definition = await definitionProvider.provideDefinition(
      textDocument,
      offset
    )
    if (definition === undefined || definition === null) {
      return definition
    }
    if (Assert.getType(definition) !== 'object') {
      throw new VError(
        `invalid definition result: definition must be of type object but is ${inspect(
          definition
        )}`
      )
    }
    if (Assert.getType(definition.uri) !== 'string') {
      throw new VError(
        'invalid definition result: definition.uri must be of type string'
      )
    }
    if (Assert.getType(definition.startOffset) !== 'number') {
      throw new VError(
        'invalid definition result: definition.startOffset must be of type number'
      )
    }
    if (Assert.getType(definition.endOffset) !== 'number') {
      throw new VError(
        'invalid definition result: definition.endOffset must be of type number'
      )
    }
    return definition
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute definition provider',
    })
  }
}

export const createDefinitionRegistry = ({ TextDocuments }) => {
  const registry = Registry.create({
    name: 'Definition',
  })
  return {
    registerDefinitionProvider(provider) {
      registry.register(provider)
    },
    executeDefinitionProvider(textDocumentId, offset) {
      const textDocument = TextDocuments.get(textDocumentId)
      const provider = registry.get(textDocument.languageId)
    },
  }
}
