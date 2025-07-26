import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchSettingsWorker from '../LaunchSettingsWorker/LaunchSettingsWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchSettingsWorker.launchSettingsWorker)

export { invoke, invokeAndTransfer, restart }
