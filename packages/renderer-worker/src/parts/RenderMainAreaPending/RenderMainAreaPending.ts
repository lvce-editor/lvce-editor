import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as UpdateDynamicFocusContext from '../UpdateDynamicFocusContext/UpdateDynamicFocusContext.js'

export const renderMainAreaPending = async (uid: number): Promise<void> => {
  const diffResult = await MainAreaWorker.invoke('MainArea.diff2', uid)
  if (diffResult.length === 0) {
    return
  }
  const commands = await MainAreaWorker.invoke('MainArea.render2', uid, diffResult)
  UpdateDynamicFocusContext.updateDynamicFocusContext(commands)
  if (commands.length === 0) {
    return
  }
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
}
