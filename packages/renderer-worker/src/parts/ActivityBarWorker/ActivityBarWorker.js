import * as GetOrCreateWorkerWithSleep from '../GetOrCreateWorkerWithSleep/GetOrCreateWorkerWithSleep.js'
import * as LaunchActivityBarWorker from '../LaunchActivityBarWorker/LaunchActivityBarWorker.ts'

const { invoke, invokeAndTransfer, restart, sleep } = GetOrCreateWorkerWithSleep.getOrCreateWorkerWithSleep(
  LaunchActivityBarWorker.launchActivityBarWorker,
  'ActivityBar.sleep',
  'ActivityBar.wakeUp',
)

export { invoke, invokeAndTransfer, restart, sleep }
