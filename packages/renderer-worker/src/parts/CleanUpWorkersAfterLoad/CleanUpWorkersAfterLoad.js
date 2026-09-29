import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const getUid = (moduleId) => {
  const instance = ViewletStates.getInstance(moduleId)
  return instance?.state.uid
}

export const cleanUpWorkersAfterLoad = async () => {
  if (!Preferences.get('Workers.cleanUpAfterLoad')) {
    return
  }
  const activityBarUid = getUid(ViewletModuleId.ActivityBar)
  const titleBarUid = getUid(ViewletModuleId.TitleBar)
  const promises = []
  if (typeof activityBarUid === 'number') {
    promises.push(ActivityBarWorker.sleep(activityBarUid))
  }
  if (typeof titleBarUid === 'number') {
    promises.push(TitleBarWorker.sleep(titleBarUid))
  }
  await Promise.all(promises)
}
