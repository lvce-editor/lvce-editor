import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchKeyBindingsViewWorker from '../LaunchKeyBindingsViewWorker/LaunchKeyBindingsViewWorker.js'

const { invoke, invokeAndTransfer, restart } = GetOrCreateWorker.getOrCreateWorker(LaunchKeyBindingsViewWorker.launchKeyBindingsViewWorker)

export { invoke, invokeAndTransfer, restart }
