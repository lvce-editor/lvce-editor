import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'

const executeProvider = async (providerId, methodName, ...args) => {
  const { found, result } = await ExtensionManagementWorker.invoke('Extensions.executeSourceControlProvider', providerId, methodName, ...args)
  if (!found) {
    throw new Error('No source control provider found')
  }
  return result
}

export const acceptInput = async (providerId, text) => {
  return executeProvider(providerId, 'executeSourceControlAcceptInput', text)
}

export const getChangedFiles = (providerId) => {
  return executeProvider(providerId, 'executeSourceControlGetChangedFiles')
}

export const generateCommitMessage = (providerId) => {
  return executeProvider(providerId, 'executeSourceControlGenerateCommitMessage')
}

export const getBadgeCount = (providerId) => {
  return executeProvider(providerId, 'executeSourceControlGetBadgeCount')
}

export const getFeatures = (providerId) => {
  return executeProvider(providerId, 'executeSourceControlGetFeatures')
}

export const getFileBefore = (providerId, path) => {
  return executeProvider(providerId, 'executeSourceControlGetFileBefore', path)
}

export const getFileDecorations = (providerId, uris) => {
  return executeProvider(providerId, 'executeSourceControlGetFileDecorations', uris)
}

export const getGroups = (providerId, path) => {
  return executeProvider(providerId, 'executeSourceControlGetGroups', path)
}

export const add = (providerId, path) => {
  return executeProvider(providerId, 'executeSourceControlAdd', path)
}

export const discard = (providerId, path) => {
  return executeProvider(providerId, 'executeSourceControlDiscard', path)
}

export const getEnabledProviderIds = (scheme, root) => {
  return ExtensionManagementWorker.invoke('Extensions.getEnabledSourceControlProviderIds', scheme, root)
}

export const getIconDefinitions = () => []
