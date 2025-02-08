import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchTitleBarWorker from '../LaunchTitleBarWorker/LaunchTitleBarWorker.js'

const { invoke, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchTitleBarWorker.launchTitleBarWorker)

export { invoke, restart }
