import { VError } from '../VError/VError.js'
import * as ExtensionFilterParameter from '../ExtensionFilterParameter/ExtensionFilterParameter.js'

const RE_PARAM = /@\w+/g

// TODO test sorting and filtering
export const parseValue = (value) => {
  const parameters = Object.create(null)
  // TODO this is not very functional code (assignment)
  const replaced = value.replace(RE_PARAM, (match, by, order) => {
    if (match.startsWith(ExtensionFilterParameter.Installed)) {
      parameters.installed = true
    }
    if (match.startsWith(ExtensionFilterParameter.Enabled)) {
      parameters.enabled = true
    }
    if (match.startsWith(ExtensionFilterParameter.Disabled)) {
      parameters.disabled = true
    }
    if (match.startsWith(ExtensionFilterParameter.Builtin)) {
      parameters.builtin = true
    }
    if (match.startsWith(ExtensionFilterParameter.Sort)) {
      // TODO
      parameters.sort = 'installs'
    }
    if (match.startsWith(ExtensionFilterParameter.Id)) {
      // TODO
      parameters.id = 'abc'
    }
    if (match.startsWith(ExtensionFilterParameter.Outdated)) {
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
