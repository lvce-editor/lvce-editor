import * as Layout from './Layout.js'
import * as Application from '../Application/Application.ts'
import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as ViewletLayout from '../ViewletLayout/ViewletLayout.ts'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const handleWorkspaceRefresh = async (changes) => {
  if (ApplicationRegistry.getOpenIds().length > 0) {
    await Application.handleWorkspaceRefresh(changes)
    return
  }
  const layout = ViewletStates.getInstance('Layout')
  if (layout) {
    await ViewletLayout.handleWorkspaceRefresh(layout.state, changes)
  }
}

const refreshSourceControlBadgeCount = async () => {
  if (ApplicationRegistry.getOpenIds().length > 0) {
    await Application.refreshSourceControlBadgeCount()
    return
  }
  const layout = ViewletStates.getInstance('Layout')
  if (layout) {
    await ViewletLayout.refreshSourceControlBadgeCount(layout.state)
  }
}

export const name = 'Layout'

export const Commands = {
  getApplicationName: Layout.getApplicationName,
  getAssetDir: Layout.getAssetDir,
  getPlatform: Layout.getPlatform,
  handleWorkspaceRefresh,
  refreshSourceControlBadgeCount,
}
