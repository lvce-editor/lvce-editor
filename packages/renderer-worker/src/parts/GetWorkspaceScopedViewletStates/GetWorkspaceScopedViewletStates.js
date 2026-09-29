import * as GetViewletStorageKey from '../GetViewletStorageKey/GetViewletStorageKey.js'

export const getWorkspaceScopedViewletStates = (instances, workspaceUri) => {
  const scopedInstances = Object.create(null)
  for (const [viewletId, savedState] of Object.entries(instances)) {
    const storageKey = GetViewletStorageKey.getViewletStorageKey(viewletId, workspaceUri)
    scopedInstances[storageKey] = savedState
  }
  return scopedInstances
}
