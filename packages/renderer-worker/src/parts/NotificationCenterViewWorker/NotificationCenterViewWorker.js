import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchNotificationCenterViewWorker from '../LaunchNotificationCenterViewWorker/LaunchNotificationCenterViewWorker.js'

const { invoke, invokeAndTransfer } = GetOrCreateWorker.getOrCreateWorker(LaunchNotificationCenterViewWorker.launchNotificationCenterViewWorker)

export { invoke, invokeAndTransfer }
