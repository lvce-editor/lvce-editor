import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getPanelViews = () => {
  const views = [ViewletModuleId.Problems, ViewletModuleId.Output, ViewletModuleId.DebugConsole, ViewletModuleId.Terminal]
  return views
}
