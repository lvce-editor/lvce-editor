import * as GetViewletStorageKey from '../GetViewletStorageKey/GetViewletStorageKey.js'

export const getWorkspaceScopedViewletStates = (instances, workspacePath) => {
  const scopedInstances = Object.create(null)
  for (const [viewletId, savedState] of Object.entries(instances)) {
    const storageKey = GetViewletStorageKey.getViewletStorageKey(viewletId, workspacePath)
    scopedInstances[storageKey] = savedState
  }
  return scopedInstances
}
