import * as ExtensionHostShared from './ExtensionHostShared.js'

export const acceptInput = async (providerId, text) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: 'ExtensionHost.sourceControlAcceptInput',
    params: [providerId, text],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getChangedFiles = (providerId) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: 'ExtensionHost.sourceControlGetChangedFiles',
    params: [providerId],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getFileBefore = (path) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: 'ExtensionHost.sourceControlGetFileBefore',
    params: [path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const add = (path) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: 'ExtensionHostSourceControl.add',
    params: [path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const discard = (path) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: 'ExtensionHostSourceControl.discard',
    params: [path],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getEnabledProviderIds = (scheme, root) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: 'ExtensionHostSourceControl.getEnabledProviderIds',
    params: [scheme, root],
    noProviderFoundMessage: 'No source control provider found',
  })
}
