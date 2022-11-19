import { VError } from '../VError/VError.js'

const RE_PARAM = /@\w+/g

// TODO test sorting and filtering
const parseValue = (value) => {
  const parameters = Object.create(null)
  // TODO this is not very functional code (assignment)
  const replaced = value.replace(RE_PARAM, (match, by, order) => {
    if (match.startsWith('@installed')) {
      parameters.installed = true
    }
    if (match.startsWith('@enabled')) {
      parameters.enabled = true
    }
    if (match.startsWith('@disabled')) {
      parameters.disabled = true
    }
    if (match.startsWith('@builtin')) {
      parameters.builtin = true
    }
    if (match.startsWith('@sort')) {
      // TODO
      parameters.sort = 'installs'
    }
    if (match.startsWith('@id')) {
      // TODO
      parameters.id = 'abc'
    }
    if (match.startsWith('@outdated')) {
      parameters.outdated = true
    }
    return ''
  })
  const isLocal =
    parameters.enabled ||
    parameters.builtin ||
    parameters.disabled ||
    parameters.outdated
  return {
    query: replaced,
    isLocal,
    params: parameters,
  }
}

const matchesParsedValue = (extension, parsedValue) => {
  if (extension && typeof extension.name === 'string') {
    return extension.name.includes(parsedValue.query)
  }
  if (extension && typeof extension.id === 'string') {
    return extension.id.includes(parsedValue.query)
  }
  return false
}

const getExtensionsLocal = (extensions, parsedValue) => {
  const filteredExtensions = []
  for (const extension of extensions) {
    if (matchesParsedValue(extension, parsedValue)) {
      filteredExtensions.push(extension)
    }
  }
  return filteredExtensions
}

const getExtensions = (extensions, parsedValue) => {
  // if (parsedValue.isLocal) {
  return getExtensionsLocal(extensions, parsedValue)
  // }
  // return getExtensionsMarketplace(parsedValue)
}

export const searchExtensions = async (extensions, value) => {
  try {
    const parsedValue = parseValue(value)
    const filteredExtensions = await getExtensions(extensions, parsedValue)
    return filteredExtensions
  } catch (error) {
    throw new VError(error, `Failed to search for extensions`)
  }
}
