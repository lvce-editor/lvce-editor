import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getViewletStorageKey = (viewletId, workspaceUri) => {
  if (viewletId === ViewletModuleId.Layout) {
    return viewletId
  }
  return `viewlet:${workspaceUri || ''}:${viewletId}`
}
