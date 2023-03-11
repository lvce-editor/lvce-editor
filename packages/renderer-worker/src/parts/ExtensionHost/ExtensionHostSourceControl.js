import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const acceptInput = async (providerId, text) => {
  return ExtensionHostShared.executeProvider({
    event: 'none',
    method: ExtensionHostCommandType.SourceControlAcceptInput,
    params: [providerId, text],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getChangedFiles = (providerId) => {
  return ExtensionHostShared.executeProvider({
    event: 'none',
    method: ExtensionHostCommandType.SourceControlGetChangedFiles,
    params: [providerId],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getFileBefore = (providerId, path) => {
  return ExtensionHostShared.executeProvider({
    event: 'none',
    method: ExtensionHostCommandType.SourceControlGetFileBefore,
    params: [providerId, path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const add = (providerId, path) => {
  return ExtensionHostShared.executeProvider({
    event: 'none',
    method: ExtensionHostCommandType.SourceControlAdd,
    params: [providerId, path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const discard = (providerId, path) => {
  return ExtensionHostShared.executeProvider({
    event: 'none',
    method: ExtensionHostCommandType.SourceControlDiscard,
    params: [providerId, path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getEnabledProviderIds = (scheme, root) => {
  return ExtensionHostShared.executeProvider({
    event: `onSourceControl:${scheme}`,
    method: ExtensionHostCommandType.SourceControlGetEnabledProviderIds,
    params: [scheme, root],
    noProviderFoundMessage: 'No source control provider found',
  })
}
