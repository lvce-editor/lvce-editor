import * as ExtensionHostSourceControl from '../ExtensionHost/ExtensionHostSourceControl.js'
import * as Assert from '../Assert/Assert.js'

export const state = {
  enabledProviders: [],
  initialized: false,
}

export const acceptInput = (providerId, text) => {
  Assert.string(providerId)
  Assert.string(text)
  return ExtensionHostSourceControl.acceptInput(providerId, text)
}

export const getChangedFiles = (providerId) => {
  return ExtensionHostSourceControl.getChangedFiles(providerId)
}

export const getFileBefore = (file) => {
  return ExtensionHostSourceControl.getFileBefore(file)
}

export const add = (file) => {
  return ExtensionHostSourceControl.add(file)
}

export const discard = (file) => {
  return ExtensionHostSourceControl.discard(file)
}

export const openFile = (file) => {
  // TODO
}

export const getEnabledProviderIds = (scheme, root) => {
  Assert.string(scheme)
  Assert.string(root)
  return ExtensionHostSourceControl.getEnabledProviderIds(scheme, root)
}

export const getGroups = (providerId, root) => {
  return ExtensionHostSourceControl.getGroups(providerId, root)
}

export const getSourceControlActions = (providerId) => {
  // TODO get extension.source-control-actions
  return []
}
