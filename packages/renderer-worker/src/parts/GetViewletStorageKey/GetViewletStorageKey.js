import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getViewletStorageKey = (viewletId, workspacePath) => {
  if (viewletId === ViewletModuleId.Layout) {
    return viewletId
  }
  return `viewlet:${encodeURIComponent(workspacePath || '')}:${viewletId}`
}
