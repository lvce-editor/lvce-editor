import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as DebugTarget from '../DebugTarget/DebugTarget.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const attachDebugger = async (webSocketDebuggerUrl) => {
  Assert.string(webSocketDebuggerUrl)
  DebugTarget.set(webSocketDebuggerUrl)
  await Command.execute('Layout.openSideBarViewlet', ViewletModuleId.RunAndDebug, true)
  await ViewletManager.waitForLoadContentLater(ViewletModuleId.RunAndDebug)
  const pendingTarget = DebugTarget.consume()
  if (pendingTarget) {
    const viewlet = ViewletStates.getInstance(ViewletModuleId.RunAndDebug)
    if (!viewlet) {
      throw new Error('Run and Debug view is unavailable')
    }
    await Viewlet.executeViewletCommand(viewlet.state.uid, 'attach', pendingTarget)
  }
}
