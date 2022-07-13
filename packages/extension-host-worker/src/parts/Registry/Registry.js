import * as Validation from '../Validation/Validation.js'
import { VError } from '../VError/VError.js'

const RE_UPPERCASE_LETTER = /[A-Z]/g

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

const improveValidationError = (name, validationError) => {
  const camelCaseName = toCamelCase(name)
  const spacedOutName = spaceOut(name)
  const pre = `invalid ${spacedOutName} result`
  const post = validationError.replace('item', camelCaseName)
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

export const create = ({ name, resultShape, textDocumentRegistry }) => {
  const providers = Object.create(null)
  return {
    [`register${name}Provider`](provider) {
      providers[provider.languageId] = provider
    },
    async [`execute${name}Provider`](textDocumentId, ...params) {
      try {
        const textDocument = textDocumentRegistry.get(textDocumentId)
        const provider = providers[textDocument.languageId]
        const multipleResults = resultShape.type === 'array'
        const methodName = multipleResults
          ? `provide${name}s`
          : `provide${name}`
        const result = await provider[methodName](textDocumentId, ...params)
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
          const message =
            actualError.name === 'Error'
              ? `${actualError.message}`
              : `${actualError.name}: ${actualError.message}`
          actualError.message = `Failed to execute ${spacedOutName} provider: ${message}`
        }
        throw actualError
      }
    },
  }
}
