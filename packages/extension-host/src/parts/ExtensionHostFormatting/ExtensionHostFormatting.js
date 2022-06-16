import { VALIDATION_ENABLED } from '../Flags/Flags.js'
import { ow } from '../Validation/Validation.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import { ExecutionError } from '../Error/Error.js'
import * as Debug from '../Debug/Debug.js'

export const state = {
  formattingProviders: Object.create(null),
}

// region formatter
export const registerFormattingProvider = (formattingProvider) => {
  try {
    state.formattingProviders[formattingProvider.id] ||= []
    state.formattingProviders[formattingProvider.id].push(formattingProvider)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to register formatting provider',
    })
  }

  // ow(formattingProvider.languageId, ow.string)
  // ow(formattingProvider, ow.function)
}

export const executeFormattingProvider = async (id) => {
  try {
    Debug.debug(`execute formatting provider ${id}`)
    const formattingProviders = Object.values(state.formattingProviders)[0]
    if (!formattingProviders) {
      return null
    }
    const formattingProvider = formattingProviders[0]
    if (!formattingProvider) {
      return null
    }
    const textDocument = TextDocument.state.textDocuments[id]
    const result = await formattingProvider.format(textDocument)
    console.log({ result })
    return result
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute formatting provider',
    })
  }
  // // TODO try/catch?
  // // TODO verify type of result is correct
  // const result = await formattingProvider.format(textDocument)
  // if (VALIDATION_ENABLED) {
  //   ow(result, ow.string)
  // }
  // return result
}

export const unregisterFormatter = (languageId, formattingProvider) => {
  if (VALIDATION_ENABLED) {
    ow(languageId, ow.string)
    ow(formattingProvider, ow.function)
  }
  const index =
    state.formattingProviders[languageId].indexOf(formattingProvider)
  if (index === -1) {
    throw new Error('not registered')
  }
  state.formattingProviders[languageId].splice(index, 1)
}
