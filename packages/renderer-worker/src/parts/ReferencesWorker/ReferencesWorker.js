import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchReferencesViewWorker from '../LaunchReferencesViewWorker/LaunchReferencesViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchReferencesViewWorker.launchReferencesWorker)

export { invoke, invokeAndTransfer, restart }
