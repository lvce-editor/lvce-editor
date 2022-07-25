import * as ExtensionHostShared from './ExtensionHostShared.js'

export const acceptInput = async (text) => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: 'ExtensionHost.sourceControlAcceptInput',
    params: [text],
    noProviderFoundMessage: 'No source control provider found',
  })
}

export const getChangedFiles = async () => {
  return ExtensionHostShared.executeProvider({
    event: 'onSourceControl',
    method: 'ExtensionHost.sourceControlGetChangedFiles',
    params: [],
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
