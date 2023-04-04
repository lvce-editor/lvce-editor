import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'
import { NoProviderFoundError } from '../NoProviderFoundError/NoProviderFoundError.js'
import { VError } from '../VError/VError.js'
import * as Validation from '../Validation/Validation.js'

const RE_UPPERCASE_LETTER = /[A-Z]/g
const RE_PROPERTY = /item\..*must be of type/

const spaceOut = (camelCaseWord) => {
  return camelCaseWord.replaceAll(RE_UPPERCASE_LETTER, (character, index) => {
    if (index === 0) {
      return character.toLowerCase()
    }
    return ' ' + character.toLowerCase()
  })
}

const toCamelCase = (string) => {
  return string[0].toLowerCase() + string.slice(1)
}

const improveValidationErrorPostMessage = (validationError, camelCaseName) => {
  if (validationError.startsWith('item must be of type')) {
    return validationError.replace('item', camelCaseName)
  }
  if (validationError.startsWith('expected result to be')) {
    return validationError.replace('result', `${camelCaseName} item`)
  }
  if (RE_PROPERTY.test(validationError)) {
    return validationError.replace('item', camelCaseName)
  }
  return validationError
}

const improveValidationError = (name, validationError) => {
  const camelCaseName = toCamelCase(name)
  const spacedOutName = spaceOut(name)
  const pre = `invalid ${spacedOutName} result`
  const post = improveValidationErrorPostMessage(validationError, camelCaseName)
  return pre + ': ' + post
}

class NonError extends Error {
  name = 'NonError'

  constructor(message) {
    super(message)
  }
}

// ensureError based on https://github.com/sindresorhus/ensure-error/blob/main/index.js (License MIT)
const ensureError = (input) => {
  if (!(input instanceof Error)) {
    return new NonError(input)
  }
  return input
}

export const create = ({ name, resultShape, executeKey = '' }) => {
  const providers = Object.create(null)
  const multipleResults = resultShape.type === 'array'
  const methodName = executeKey || (multipleResults ? `provide${name}s` : `provide${name}`)
  return {
    [`register${name}Provider`](provider) {
      providers[provider.languageId] = provider
    },
    reset() {
      for (const key in providers) {
        delete providers[key]
      }
    },
    async [`execute${name}Provider`](textDocumentId, ...params) {
      try {
        const textDocument = TextDocument.get(textDocumentId)
        if (!textDocument) {
          throw new Error(`textDocument with id ${textDocumentId} not found`)
        }
        const provider = providers[textDocument.languageId]
        if (!provider) {
          const spacedOutName = spaceOut(name)
          throw new NoProviderFoundError(`No ${spacedOutName} provider found for ${textDocument.languageId}`)
        }
        const result = await provider[methodName](textDocument, ...params)
        const error = Validation.validate(result, resultShape)
        if (error) {
          const improvedError = improveValidationError(name, error)
          throw new VError(improvedError)
        }
        return result
      } catch (error) {
        const actualError = ensureError(error)
        const spacedOutName = spaceOut(name)
        if (actualError && actualError.message) {
          if (actualError.message === 'provider[methodName] is not a function') {
            const camelCaseName = toCamelCase(name)

            throw new VError(`Failed to execute ${spacedOutName} provider: VError: ${camelCaseName}Provider.${methodName} is not a function`)
          }
          const message = actualError.name === 'Error' ? `${actualError.message}` : `${actualError.name}: ${actualError.message}`
          actualError.message = `Failed to execute ${spacedOutName} provider: ${message}`
        }
        throw actualError
      }
    },
  }
}
