import * as GetOrCreateWorkerWithSleep from '../GetOrCreateWorkerWithSleep/GetOrCreateWorkerWithSleep.js'
import * as LaunchTitleBarWorker from '../LaunchTitleBarWorker/LaunchTitleBarWorker.js'

const { invoke, invokeAndTransfer, restart, sleep } = GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep(
  LaunchTitleBarWorker.launchTitleBarWorker,
  'TitleBar.sleep',
  'TitleBar.wakeUp',
)

export { invoke, invokeAndTransfer, restart, sleep }
