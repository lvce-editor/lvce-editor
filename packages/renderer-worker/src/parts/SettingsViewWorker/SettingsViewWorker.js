import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchSettingsViewWorker from '../LaunchSettingsViewWorker/LaunchSettingsViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchSettingsViewWorker.launchSettingsViewWorker)

export { invoke, invokeAndTransfer, restart }
