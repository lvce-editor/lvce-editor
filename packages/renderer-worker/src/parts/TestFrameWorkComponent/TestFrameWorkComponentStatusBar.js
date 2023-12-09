import * as Command from '../Command/Command.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getStatusBarItems = async () => {
  await Command.execute('StatusBar.updateStatusBarItems')
  const statusBar = ViewletStates.getState(ViewletModuleId.StatusBar)
  return statusBar
}
