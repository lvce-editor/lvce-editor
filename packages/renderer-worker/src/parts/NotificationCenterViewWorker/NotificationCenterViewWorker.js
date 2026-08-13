import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchNotificationCenterViewWorker from '../LaunchNotificationCenterViewWorker/LaunchNotificationCenterViewWorker.js'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchNotificationCenterViewWorker.launchNotificationCenterViewWorker)

export { invoke }
