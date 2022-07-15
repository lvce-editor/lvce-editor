import * as Validation from '../Validation/Validation.js'
import { VError } from '../VError/VError.js'
import * as TextDocument from '../ExtensionHostTextDocument/ExtensionHostTextDocument.js'

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
  const post = validationError
    .replace('item', camelCaseName)
    .replace(`result`, `${camelCaseName} item`)
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

export const create = ({ name, resultShape }) => {
  const providers = Object.create(null)
  const multipleResults = resultShape.type === 'array'
  const methodName = multipleResults ? `provide${name}s` : `provide${name}`
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
        const provider = providers[textDocument.languageId]
        if (!provider) {
          const spacedOutName = spaceOut(name)
          throw new VError(
            `No ${spacedOutName} provider found for ${textDocument.languageId}`
          )
        }
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
          if (
            actualError.message === 'provider[methodName] is not a function'
          ) {
            const camelCaseName = toCamelCase(name)

            throw new VError(
              `Failed to execute ${spacedOutName} provider: VError: ${camelCaseName}Provider.${methodName} is not a function`
            )
          }
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
