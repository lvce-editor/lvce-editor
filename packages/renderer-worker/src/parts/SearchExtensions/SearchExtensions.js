import * as ExtensionsMarketplace from '../ExtensionMarketplace/ExtensionMarketplace.js'
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
  // TODO handle error when extension.name is not of type string
  if (extension && extension.name) {
    return extension.name.includes(parsedValue.query)
  }
  // TODO handle error when extension id is not of type string
  if (extension && extension.id) {
    return extension.id.includes(parsedValue.query)
  }
  return false
}

const filterExtensions = (extensions, parsedValue, itemHeight) => {
  const items = []
  for (const extension of extensions) {
    if (matchesParsedValue(extension, parsedValue)) {
      items.push(extension)
    }
  }
  // TODO make this more efficient / more functional
  const itemsLength = items.length
  for (let i = 0; i < itemsLength; i++) {
    items[i].setSize = itemsLength
    items[i].posInSet = i + 1
    items[i].top = i * itemHeight
  }
  return items
}

const getExtensionsLocal = (extensions, parsedValue) => {
  // TODO get local extensions from shared process
  // return state.localExtensions
  return extensions
}

const getExtensionsMarketplace = (parsedValue) => {
  return ExtensionsMarketplace.getMarketplaceExtensions({
    q: parsedValue.query,
    ...parsedValue.params,
  })
}

const getExtensions = (extensions, parsedValue) => {
  // if (parsedValue.isLocal) {
  return getExtensionsLocal(extensions, parsedValue)
  // }
  // return getExtensionsMarketplace(parsedValue)
}

const toUiExtension = (extension, index) => {
  return {
    name: extension.name,
    authorId: extension.authorId,
    version: extension.version,
    id: extension.id,
  }
}

const toDisplayExtensions = (extensions) => {
  const toDisplayExtension = (extension, index) => {
    return {
      name: extension.name,
      posInSet: index + 1,
      setSize: extensions.length,
    }
  }
  return extensions.map(toDisplayExtension)
}

export const searchExtensions = async (extensions, value) => {
  try {
    const parsedValue = parseValue(value)
    const extensions = await getExtensions(extensions, parsedValue)
    const items = filterExtensions(extensions, parsedValue, 62)
    return items
  } catch (error) {
    throw new VError(error, `Failed to search for extensions`)
  }
}
