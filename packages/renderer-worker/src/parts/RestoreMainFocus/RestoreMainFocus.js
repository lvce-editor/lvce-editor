import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const restoreMainFocus = async (invoke = MainAreaWorker.invoke) => {
  const mainInstance = ViewletStates.getInstance(ViewletModuleId.Main)
  if (mainInstance) {
    await invoke('MainArea.focus', mainInstance.state.uid)
  }
}
