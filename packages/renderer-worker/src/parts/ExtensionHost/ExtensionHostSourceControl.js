import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const acceptInput = async (providerId, text) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: ExtensionHostCommandType.SourceControlAcceptInput,
    params: [providerId, text],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getChangedFiles = (providerId) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: ExtensionHostCommandType.SourceControlGetChangedFiles,
    params: [providerId],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getFileBefore = (path) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: ExtensionHostCommandType.SourceControlGetFileBefore,
    params: [path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const add = (path) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: ExtensionHostCommandType.SourceControlAdd,
    params: [path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const discard = (path) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: ExtensionHostCommandType.SourceControlDiscard,
    params: [path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getEnabledProviderIds = (scheme, root) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: ExtensionHostCommandType.SourceControlGetEnabledProviderIds,
    params: [scheme, root],
    noProviderFoundMessage: 'No source control provider found',
  })
}
